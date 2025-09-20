const autoresRepository = require('../repository/autoresRepository');
const Autor = require('../models/Autor');

class AutoresController {
    async getAll(req, res) {
        try {
            const autores = await autoresRepository.findAll();
            res.json(autores);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const autor = await autoresRepository.findById(req.params.id);
            autor ? res.json(autor) : res.status(404).json({ error: 'Autor não encontrado' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const autor = new Autor(req.body);
            const validacao = autor.validar();
            
            if (validacao !== true) {
                return res.status(400).json({ errors: validacao });
            }
            
            const novoAutor = await autoresRepository.create(autor);
            res.status(201).json(novoAutor);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const autor = new Autor({ ...req.body, id: req.params.id });
            const validacao = autor.validar();
            
            if (validacao !== true) {
                return res.status(400).json({ errors: validacao });
            }
            
            const autorAtualizado = await autoresRepository.update(req.params.id, autor);
            res.json(autorAtualizado);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const sucesso = await autoresRepository.delete(req.params.id);
            sucesso ? res.sendStatus(204) : res.status(404).json({ error: 'Autor não encontrado' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new AutoresController();