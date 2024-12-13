const mysql = require('mysql2');
require('dotenv').config();

// Configuración de la base de datos
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

// Crear el pool de conexiones
const pool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Verificar la conexión
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error al conectar con la base de datos:');
        console.error('Config:', {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_NAME
        });
        console.error('Error:', err.message);
        return;
    }
    console.log('✓ Conexión a la base de datos establecida correctamente');
    console.log('Base de datos:', process.env.DB_NAME);
    connection.release();
});

// Convertir el pool a promesas
const promisePool = pool.promise();

module.exports = promisePool;