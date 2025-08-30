const db = require('../config/database');
const Livro = require('../models/livros');

class LivrosRepository {
    async findAll() {
        try {
            const [rows] = await db.execute('SELECT * FROM livros');
            return rows.map(row => new Livro(row));
        } catch (error) {
            throw new Error(`Erro ao buscar livros: ${error.message}`);
        }
    }

    async findById(id) {
        try {
            const [rows] = await db.execute('SELECT * FROM livros WHERE id = ?', [id]);
            if (rows.length === 0) return null;
            return new Livro(rows[0]);
        } catch (error) {
            throw new Error(`Erro ao buscar livro por ID: ${error.message}`);
        }
    }

    async findByGenero(genero) {
        try {
            const livro = new Livro({});
            if (!livro.generosValidos.includes(genero)) {
                throw new Error('Gênero inválido');
            }

            const [rows] = await db.execute('SELECT * FROM livros WHERE genero = ?', [genero]);
            return rows.map(row => new Livro(row));
        } catch (error) {
            throw new Error(`Erro ao buscar livros por gênero: ${error.message}`);
        }
    }

    async create(livroData) {
    try {
        const livro = new Livro(livroData);
        const livroParaInserir = livro.toJSON();

        const [result] = await db.execute(
            'INSERT INTO livros (titulo, autor, editora, isbn, genero, ano_publicacao, imagem) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                livroParaInserir.titulo,
                livroParaInserir.autor,
                livroParaInserir.editora,
                livroParaInserir.isbn,
                livroParaInserir.genero,
                livroParaInserir.ano_publicacao,
                livroParaInserir.imagem
            ]
        );

        return await this.findById(result.insertId);
    } catch (error) {
        throw new Error(`Erro ao criar livro: ${error.message}`);
    }
}

async update(id, livroData) {
    try {
        const { titulo, autor, editora, isbn, genero, ano_publicacao, imagem } = livroData;

        await db.execute(
            'UPDATE livros SET titulo = ?, autor = ?, editora = ?, isbn = ?, genero = ?, ano_publicacao = ?, imagem = ? WHERE id = ?',
            [titulo, autor, editora, isbn, genero, ano_publicacao, imagem, id]
        );

        return await this.findById(id);
    } catch (error) {
        throw new Error(`Erro ao atualizar livro: ${error.message}`);
    }
}


    async updateStatus(id, status) {
        try {
            await db.execute('UPDATE livros SET status = ? WHERE id =?', [status, id]);
            return await this.findById(id);
        } catch (error) {
            throw new Error(`Erro ao atualizar status:${error.message}`);
        }
    }

    async delete(id) {
        try {
            const livro = await this.findById(id);
            if (!livro) return false;

            await db.execute('DELETE FROM livros WHERE id = ?', [id]);
            return true;
        } catch (error) {
            throw new Error(`Erro ao deletar livro: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            const [result] = await db.execute('DELETE FROM livros WHERE id = ?',[id]);
            return result.affectedRows > 0
        } catch (error) {
            throw new Error(`Erro ao deletar livros: ${error.message}`);
        }
    }
}
module.exports = new LivrosRepository();
