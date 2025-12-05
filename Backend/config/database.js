const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',               
    password: '',               
    database: 'teste',
    waitForConnections: true,
    connectionLimit: 200,
    idleTimeout: 60000,
};


const pool = mysql.createPool(dbConfig);

const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Conectado com sucesso!!');
        connection.release();
    } catch (error) {
        console.error('Erro ao conectar ao mysql', error.message);
    }
};

testConnection(); 

module.exports = pool;