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

const checkConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Đã kết nối thành công với MySQL!');
        connection.release(); // Trả lại connection cho pool
    } catch (err) {
        console.error('❌ Lỗi kết nối MySQL:', err.message);
        process.exit(1);
    }
};

module.exports = { pool, checkConnection };