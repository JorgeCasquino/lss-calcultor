require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3001,
    database: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'lss_dashboard'
    },
    jwtSecret: process.env.JWT_SECRET || 'tu_secreto_super_seguro'
};