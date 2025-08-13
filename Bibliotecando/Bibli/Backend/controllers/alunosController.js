const alunosRepository = require('../repository/alunosRepository');
const Aluno = require('../models/aluno');

class AlunosController {
    async getAll(req, res) {
        try {
            const alunos = await alunosRepository.findAll();
            res.json({ success: true, data: alunos, total: alunos.length });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getById(req, res) {
        try {
            const aluno = await alunosRepository.findById(req.params.id);
            aluno 
                ? res.json({ success: true, data: aluno })
                : res.status(404).json({ success: false, message: 'Aluno não encontrado' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async create(req, res) {
        try {
            const aluno = new Aluno(req.body);
            const erros = aluno.validar();

            if (erros !== true) {
                return res.status(400).json({ success: false, message: 'Dados inválidos', errors: erros });
            }

            const novoAluno = await alunosRepository.create(aluno);
            res.status(201).json({ success: true, data: novoAluno, message: 'Aluno criado!' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async update(req, res) {
        try {
            const alunoExistente = await alunosRepository.findById(req.params.id);
            if (!alunoExistente) {
                return res.status(404).json({ success: false, message: 'Aluno não encontrado' });
            }

            const aluno = new Aluno({ ...req.body, id: req.params.id });
            const erros = aluno.validar();

            if (erros !== true) {
                return res.status(400).json({ success: false, message: 'Dados inválidos', errors: erros });
            }

            const alunoAtualizado = await alunosRepository.update(req.params.id, aluno);
            res.json({ success: true, data: alunoAtualizado, message: 'Aluno atualizado!' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async delete(req, res) {
        try {
            const deleted = await alunosRepository.delete(req.params.id);
            deleted
                ? res.json({ success: true, message: 'Aluno deletado!' })
                : res.status(404).json({ success: false, message: 'Aluno não encontrado' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new AlunosController();