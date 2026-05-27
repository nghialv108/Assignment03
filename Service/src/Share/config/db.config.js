const mysql = require('mysql2/promise');
const env = require('./enviroment');

const pool = mysql.createPool({
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    port: env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Hàm khởi tạo các bảng (Models)
const initDatabase = async (connection) => {
    // 1. Bảng Users
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS Users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'reader',
            phone VARCHAR(20),
            status VARCHAR(50) DEFAULT 'Active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    // 2. Bảng Categories
    const createCategoriesTable = `
        CREATE TABLE IF NOT EXISTS Categories (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    // 3. Bảng Books (Có khóa ngoại category_id)
    const createBooksTable = `
        CREATE TABLE IF NOT EXISTS Books (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            author VARCHAR(255) NOT NULL,
            category_id INT,
            description TEXT,
            total_copies INT DEFAULT 1,
            available_copies INT DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (category_id) REFERENCES Categories(id) ON DELETE SET NULL
        );
    `;

    // 4. Bảng BorrowRecords (Có khóa ngoại user_id và book_id)
    const createBorrowRecordsTable = `
        CREATE TABLE IF NOT EXISTS BorrowRecords (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            book_id INT NOT NULL,
            borrow_date DATE NOT NULL,
            due_date DATE NOT NULL,
            return_date DATE NULL,
            status VARCHAR(50) DEFAULT 'PENDING',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
            FOREIGN KEY (book_id) REFERENCES Books(id) ON DELETE CASCADE
        );
    `;

    try {
        // Chạy tuần tự các lệnh tạo bảng
        await connection.query(createUsersTable);
        await connection.query(createCategoriesTable);
        await connection.query(createBooksTable);
        await connection.query(createBorrowRecordsTable);
        console.log('📦 Đã kiểm tra và khởi tạo các bảng CSDL thành công!');
    } catch (error) {
        console.error('❌ Lỗi khi khởi tạo bảng:', error.message);
        throw error;
    }
};

const checkConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Đã kết nối thành công với MySQL!');

        // Gọi hàm khởi tạo bảng ngay khi kết nối thành công
        await initDatabase(connection);

        connection.release(); // Trả lại connection cho pool
    } catch (err) {
        console.error('❌ Lỗi kết nối MySQL:', err.message);
        process.exit(1);
    }
};

module.exports = { pool, checkConnection };