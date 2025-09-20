const db = require('../config/database');
const Livro = require('../models/livros');

class LivrosRepository {
    async findAll() {
        try {
            const [rows] = await db.execute(`
                SELECT l.*, a.nome as autor_nome, e.nome as editora_nome 
                FROM livros l
                LEFT JOIN autores a ON l.autor_id = a.id
                LEFT JOIN editoras e ON l.editora_id = e.id
                ORDER BY l.titulo
            `);
            return rows.map(row => new Livro(row));
        } catch (error) {
            throw new Error(`Erro ao buscar livros: ${error.message}`);
        }
    }

    async findById(id) {
        try {
            const [rows] = await db.execute(`
                SELECT l.*, a.nome as autor_nome, e.nome as editora_nome 
                FROM livros l
                LEFT JOIN autores a ON l.autor_id = a.id
                LEFT JOIN editoras e ON l.editora_id = e.id
                WHERE l.id = ?
            `, [id]);
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

            const [rows] = await db.execute(`
                SELECT l.*, a.nome as autor_nome, e.nome as editora_nome 
                FROM livros l
                LEFT JOIN autores a ON l.autor_id = a.id
                LEFT JOIN editoras e ON l.editora_id = e.id
                WHERE l.genero = ?
                ORDER BY l.titulo
            `, [genero]);
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
                'INSERT INTO livros (titulo, autor_id, editora_id, isbn, genero, ano_publicacao, imagem) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [
                    livroParaInserir.titulo,
                    livroParaInserir.autor_id,
                    livroParaInserir.editora_id,
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
            const livro = new Livro(livroData);
            const livroParaAtualizar = livro.toJSON();

            await db.execute(
                'UPDATE livros SET titulo = ?, autor_id = ?, editora_id = ?, isbn = ?, genero = ?, ano_publicacao = ?, imagem = ? WHERE id = ?',
                [
                    livroParaAtualizar.titulo,
                    livroParaAtualizar.autor_id,
                    livroParaAtualizar.editora_id,
                    livroParaAtualizar.isbn,
                    livroParaAtualizar.genero,
                    livroParaAtualizar.ano_publicacao,
                    livroParaAtualizar.imagem,
                    id
                ]
            );

            return await this.findById(id);
        } catch (error) {
            throw new Error(`Erro ao atualizar livro: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            const [result] = await db.execute('DELETE FROM livros WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Erro ao deletar livro: ${error.message}`);
        }
    }
}

module.exports = new LivrosRepository();