const professoresRepository = require('../repository/professoresRepository');
const Professor = require('../models/professor');

class ProfessoresController {
    async getAll(req, res) {
        try {
            const professores = await professoresRepository.findAll();
            res.json({ success: true, data: professores, total: professores.length });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getById(req, res) {
        try {
            const professor = await professoresRepository.findById(req.params.id);
            professor 
                ? res.json({ success: true, data: professor })
                : res.status(404).json({ success: false, message: 'Professor não encontrado' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async create(req, res) {
        try {
            const professor = new Professor(req.body);
            const erros = professor.validar();

            if (erros !== true) {
                return res.status(400).json({ success: false, message: 'Dados inválidos', errors: erros });
            }

            const novoProfessor = await professoresRepository.create(professor);
            res.status(201).json({ success: true, data: novoProfessor, message: 'Professor criado!' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async update(req, res) {
        try {
            const professorExistente = await professoresRepository.findById(req.params.id);
            if (!professorExistente) {
                return res.status(404).json({ success: false, message: 'Professor não encontrado' });
            }

            const professor = new Professor({ ...req.body, id: req.params.id });
            const erros = professor.validar();

            if (erros !== true) {
                return res.status(400).json({ success: false, message: 'Dados inválidos', errors: erros });
            }

            const professorAtualizado = await professoresRepository.update(req.params.id, professor);
            res.json({ success: true, data: professorAtualizado, message: 'Professor atualizado!' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async delete(req, res) {
        try {
            const deleted = await professoresRepository.delete(req.params.id);
            deleted
                ? res.json({ success: true, message: 'Professor deletado!' })
                : res.status(404).json({ success: false, message: 'Professor não encontrado' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new ProfessoresController();