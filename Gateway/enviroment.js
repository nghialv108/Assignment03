require('dotenv').config();

const env = {
    PORT: process.env.PORT || 3000,
    SERVICE_URL: process.env.SERVICE_URL || 'http://localhost:4000',
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key',
};

module.exports = env;