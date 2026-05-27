require('dotenv').config();

const env = {
    PORT: process.env.PORT || 4000,
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key',
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || 'your_mysql_password',
    DB_NAME: process.env.DB_NAME || 'library_db',
    DB_PORT: process.env.DB_PORT || 3306,
};

module.exports = env;