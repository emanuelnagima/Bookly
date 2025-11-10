const autoresRepository = require('../repository/autoresRepository');
const Autor = require('../models/Autor');

class AutoresController {
    async getAll(req, res) {
        try {
            const autores = await autoresRepository.findAll();
            res.json({
                success: true,
                data: autores
            });
        } catch (error) {
            console.error('Erro ao buscar autores:', error);
            res.status(500).json({ 
                success: false,
                message: 'Erro interno do servidor ao buscar autores.' 
            });
        }
    }

    async getById(req, res) {
        try {
            const autor = await autoresRepository.findById(req.params.id);
            if (autor) {
                res.json({
                    success: true,
                    data: autor
                });
            } else {
                res.status(404).json({ 
                    success: false,
                    message: 'Autor não encontrado.' 
                });
            }
        } catch (error) {
            console.error('Erro ao buscar autor:', error);
            res.status(500).json({ 
                success: false,
                message: 'Erro interno do servidor ao buscar autor.' 
            });
        }
    }

    async create(req, res) {
        try {
            const autor = new Autor(req.body);
            const validacao = autor.validar();

            if (validacao !== true) {
                return res.status(400).json({ 
                    success: false,
                    errors: validacao 
                });
            }

            const novoAutor = await autoresRepository.create(autor);
            res.status(201).json({
                success: true,
                data: novoAutor,
                message: 'Autor criado com sucesso!'
            });
        } catch (error) {
            console.error('Erro ao criar autor:', error);
            res.status(500).json({ 
                success: false,
                message: 'Erro interno do servidor ao criar autor.' 
            });
        }
    }

    async update(req, res) {
        try {
            const autor = new Autor({ ...req.body, id: req.params.id });
            const validacao = autor.validar();

            if (validacao !== true) {
                return res.status(400).json({ 
                    success: false,
                    errors: validacao 
                });
            }

            const autorAtualizado = await autoresRepository.update(req.params.id, autor);
            if (autorAtualizado) {
                res.json({
                    success: true,
                    data: autorAtualizado,
                    message: 'Autor atualizado com sucesso!'
                });
            } else {
                res.status(404).json({ 
                    success: false,
                    message: 'Autor não encontrado.' 
                });
            }
        } catch (error) {
            console.error('Erro ao atualizar autor:', error);
            res.status(500).json({ 
                success: false,
                message: 'Erro interno do servidor ao atualizar autor.' 
            });
        }
    }

    async delete(req, res) {
        try {
            // 🧩 Verifica livros vinculados antes de tentar excluir
            const livrosVinculados = await autoresRepository.verificarLivrosVinculados(req.params.id);
            
            if (livrosVinculados > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Não é possível excluir este autor. Existem ${livrosVinculados} livro(s) vinculado(s) a ele. Remova primeiro os livros associados.`
                });
            }

            const sucesso = await autoresRepository.delete(req.params.id);
            if (sucesso) {
                res.json({
                    success: true,
                    message: 'Autor excluído com sucesso!'
                });
            } else {
                res.status(404).json({ 
                    success: false,
                    message: 'Autor não encontrado.' 
                });
            }
        } catch (error) {
            console.error('Erro ao excluir autor:', error);

            if (
                error.message?.includes('foreign key') ||
                error.message?.includes('livros') ||
                error.code === 'ER_ROW_IS_REFERENCED' ||
                error.code === 'ER_ROW_IS_REFERENCED_2' ||
                error.errno === 1451
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'Não é possível excluir este autor pois ele está vinculado a um ou mais livros. Remova primeiro os livros associados.'
                });
            }

            res.status(500).json({ 
                success: false,
                message: 'Erro interno do servidor ao excluir autor.' 
            });
        }
    }
}

module.exports = new AutoresController();
