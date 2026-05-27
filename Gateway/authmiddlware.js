const jwt = require('jsonwebtoken');
// Giả định bạn đã import jwt và env ở trên

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    // Kiểm tra luôn định dạng Bearer cho chặt chẽ
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header missing or invalid' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 1. Xác thực token ngay tại Gateway bằng Secret Key
        const decoded = jwt.verify(token, env.JWT_SECRET);

        // 2. Gán ID và Role vào Header
        // Lưu ý: Chuẩn đặt tên cho custom header thường có tiền tố 'x-'
        req.headers['x-user-id'] = decoded.id;
        req.headers['x-user-role'] = decoded.role;

        // (Tùy chọn) Vẫn gán vào req.user phòng trường hợp bản thân Gateway cần dùng
        req.user = decoded;

        // 3. Cho phép request đi tiếp xuống các service phía sau
        next();
    } catch (error) {
        // Token hết hạn hoặc không hợp lệ sẽ nhảy vào catch này
        return res.status(401).json({ message: 'Unauthorized', error: error.message });
    }
};

module.exports = authMiddleware;