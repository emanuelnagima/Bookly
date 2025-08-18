const db = require('../config/database');
const Editora = require('../models/editoras');

class EditorasRepository {
    async findAll() {
        try {
            const [rows] = await db.execute('SELECT * FROM editoras');
            return rows.map(row => new Editora(row));
        } catch (error) {
            throw new Error(`Erro ao buscar editoras: ${error.message}`);
        }
    }

    async findById(id) {
        try {
            const [rows] = await db.execute('SELECT * FROM editoras WHERE id = ?', [id]);
            if (rows.length === 0) return null;
            return new Editora(rows[0]);
        } catch (error) {
            throw new Error(`Erro ao buscar editora por ID: ${error.message}`);
        }
    }

    async create(editoraData) {
        try {
            const editora = new Editora(editoraData);
            const editoraParaInserir = editora.toJSON();

            const [result] = await db.execute(
                'INSERT INTO editoras (nome, cnpj, endereco, telefone, email) VALUES (?, ?, ?, ?, ?)',
                [
                    editoraParaInserir.nome,
                    editoraParaInserir.cnpj,
                    editoraParaInserir.endereco,
                    editoraParaInserir.telefone,
                    editoraParaInserir.email
                ]
            );

            return await this.findById(result.insertId);
        } catch (error) {
            throw new Error(`Erro ao criar editora: ${error.message}`);
        }
    }

    async update(id, editoraData) {
        try {
            const { nome, cnpj, endereco, telefone, email } = editoraData;

            await db.execute(
                'UPDATE editoras SET nome = ?, cnpj = ?, endereco = ?, telefone = ?, email = ? WHERE id = ?',
                [nome, cnpj, endereco, telefone, email, id]
            );

            return await this.findById(id);
        } catch (error) {
            throw new Error(`Erro ao atualizar editora: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            const [result] = await db.execute('DELETE FROM editoras WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Erro ao deletar editora: ${error.message}`);
        }
    }
}

module.exports = new EditorasRepository();