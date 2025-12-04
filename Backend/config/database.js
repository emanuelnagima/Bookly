const mysql = require('mysql2/promise');

const dbConfig = {
    host: '132.226.245.178',
    user: '10482521821',
    password: '10482521821',  
    database: 'PIT_10482521821',
    waitForConnections: true,
    connectionLimit: 10,  
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