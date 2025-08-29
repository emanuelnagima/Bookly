const db = require('./config/database');

(async () => {
  try {
    const [rows] = await db.execute('SELECT * FROM usuarios_especiais');
    console.log(rows);
  } catch (err) {
    console.error('Erro no DB:', err);
  }
})();
