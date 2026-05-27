/**
 * Middleware 1: Kiểm tra request đã đi qua Gateway và có chứa thông tin user chưa
 */
const requireAuth = (req, res, next) => {
    const userId = req.headers['x-user-id'];
    const userRole = req.headers['x-user-role'];

    // Nếu không có header này, request có thể bị gọi lén trực tiếp vào service 
    // mà không thông qua API Gateway, hoặc người dùng chưa đăng nhập.
    if (!userId || !userRole) {
        return res.status(401).json({ message: 'Unauthorized: Yêu cầu từ chối truy cập trực tiếp' });
    }

    // Gán thông tin vào req.user để các Controller sau này dùng cho tiện
    // thay vì phải gọi req.headers liên tục
    req.user = {
        id: parseInt(userId, 10),
        role: userRole
    };

    next();
};

/**
 * Middleware 2: Phân quyền (Role-Based Access Control)
 * @param {Array} allowedRoles - Danh sách các mảng role được phép truy cập (VD: ['admin', 'manager'])
 */
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        // Lấy role từ thông tin đã gán ở requireAuth (hoặc lấy trực tiếp từ header)
        const userRole = req.headers['x-user-role'];

        if (!userRole || !allowedRoles.includes(userRole)) {
            return res.status(403).json({
                message: 'Forbidden: Bạn không có quyền thực hiện hành động này'
            });
        }

        next();
    };
};

module.exports = {
    requireAuth,
    requireRole
};