const db = require('../config/database');
const Autor = require('../models/Autor');

class AutoresRepository {
    async findAll() {
        const [rows] = await db.execute('SELECT id, nome, nacionalidade, data_nascimento FROM autores');
        return rows.map(row => new Autor(row));
    }

    async findById(id) {
        const [rows] = await db.execute(
            'SELECT id, nome, nacionalidade, data_nascimento FROM autores WHERE id = ?', 
            [id]
        );
        return rows.length ? new Autor(rows[0]) : null;
    }

    async create(autor) {
        const [result] = await db.execute(
            'INSERT INTO autores (nome, nacionalidade, data_nascimento) VALUES (?, ?, ?)',
            [autor.nome, autor.nacionalidade, autor.data_nascimento]
        );
        return this.findById(result.insertId);
    }

    async update(id, autor) {
        await db.execute(
            'UPDATE autores SET nome = ?, nacionalidade = ?, data_nascimento = ? WHERE id = ?',
            [autor.nome, autor.nacionalidade, autor.data_nascimento, id]
        );
        return this.findById(id);
    }

    async delete(id) {
        const [result] = await db.execute('DELETE FROM autores WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = new AutoresRepository();