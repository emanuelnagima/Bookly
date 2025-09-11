const livrosRepository = require('../repository/livrosRepository');
const editorasRepository = require('../repository/editorasRepository');
const autoresRepository = require('../repository/autoresRepository');
const Livro = require('../models/livros');

class LivrosController {
    async getAll(req, res) {
        try {
            const { genero } = req.query;
            const livros = genero ? await livrosRepository.findByGenero(genero) : await livrosRepository.findAll();

            res.json({
                success: true,
                data: livros,
                total: livros.length
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const livro = await livrosRepository.findById(id);

            if (!livro) {
                return res.status(404).json({ success: false, message: 'Livro não encontrado' });
            }

            res.json({ success: true, data: livro });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getGeneros(req, res) {
        try {
            const livro = new Livro({});
            res.json({ success: true, generos: livro.generosValidos });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getOptions(req, res) {
        try {
            const [editoras, autores] = await Promise.all([
                editorasRepository.findAll(),
                autoresRepository.findAll()
            ]);
            
            res.json({
                success: true,
                data: {
                    editoras,
                    autores
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async create(req, res) {
        try {
            const livro = new Livro(req.body);

            if (req.file) {
                livro.imagem = `/uploads/${req.file.filename}`;
            }

            const erros = livro.validar();
            if (erros !== true) {
                return res.status(400).json({ success: false, message: 'Dados inválidos', errors: erros });
            }

            const newLivro = await livrosRepository.create(livro.toJSON());

            res.status(201).json({ success: true, data: newLivro, message: 'Livro criado com sucesso' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const livroExistente = await livrosRepository.findById(id);

            if (!livroExistente) {
                return res.status(404).json({ success: false, message: 'Livro não encontrado' });
            }

            const livro = new Livro({ ...req.body, id });

            if (req.file) {
                livro.imagem = `/uploads/${req.file.filename}`;
            } else {
                livro.imagem = livroExistente.imagem;
            }

            const erros = livro.validar();
            if (erros !== true) {
                return res.status(400).json({ success: false, message: 'Dados inválidos', errors: erros });
            }

            const livroAtualizado = await livrosRepository.update(id, livro.toJSON());

            res.json({ success: true, data: livroAtualizado, message: 'Livro atualizado com sucesso' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const livro = await livrosRepository.findById(id);

            if (!livro) {
                return res.status(404).json({ success: false, message: 'Livro não encontrado' });
            }

            const deleted = await livrosRepository.delete(id);
            if (deleted) {
                res.json({ success: true, message: 'Livro deletado com sucesso' });
            } else {
                res.status(500).json({ success: false, message: 'Erro ao deletar livro' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new LivrosController();