const db = require('../../config/database');
const Editora = require('../models/editora');

class EditorasRepository {
    async findAll() {
        const [rows] = await db.execute('SELECT * FROM editoras');
        return rows.map(row => new Editora(row));
    }

    async findById(id) {
        const [rows] = await db.execute('SELECT * FROM editoras WHERE id = ?', [id]);
        if (rows.length === 0) return null;
        return new Editora(rows[0]);
    }

    async create(editoraData) {
        try {
            const { nome, cnpj, endereco, telefone, email } = new Editora(editoraData).toJSON();
            const [result] = await db.execute(
                'INSERT INTO editoras (nome, cnpj, endereco, telefone, email) VALUES (?, ?, ?, ?, ?)',
                [nome, cnpj, endereco, telefone, email]
            );
            return this.findById(result.insertId);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') throw error;
            throw new Error(`Erro ao criar editora: ${error.message}`);
        }
    }

    async update(id, editoraData) {
        try {
            const { nome, cnpj, endereco, telefone, email } = new Editora(editoraData).toJSON();
            await db.execute(
                'UPDATE editoras SET nome = ?, cnpj = ?, endereco = ?, telefone = ?, email = ? WHERE id = ?',
                [nome, cnpj, endereco, telefone, email, id]
            );
            return this.findById(id);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') throw error;
            throw new Error(`Erro ao atualizar editora: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            const [result] = await db.execute('DELETE FROM editoras WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erro no repositório ao excluir editora:', error);
            throw error;
        }
    }

    // MÉTODO PARA VERIFICAR LIVROS VINCULADOS
    async verificarLivrosVinculados(editoraId) {
        try {
            console.log(`🔍 Executando query para verificar livros da editora ${editoraId}`);
            const [rows] = await db.execute(
                'SELECT COUNT(*) as total FROM livros WHERE editora_id = ?',
                [editoraId]
            );
            console.log(`📊 Resultado da verificação: ${rows[0].total} livros`);
            return rows[0].total;
        } catch (error) {
            console.error('❌ Erro ao verificar livros vinculados:', error);
            throw error;
        }
    }
}

module.exports = new EditorasRepository();