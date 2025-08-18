const editorasRepository = require('../repository/editorasRepository');
const Editora = require('../models/editoras');

class EditorasController {
    async getAll(req, res) {
        try {
            const editoras = await editorasRepository.findAll();

            res.json({
                success: true,
                data: editoras,
                total: editoras.length
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const editora = await editorasRepository.findById(id);

            if (!editora) {
                return res.status(404).json({ success: false, message: 'Editora não encontrada' });
            }

            res.json({ success: true, data: editora });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async create(req, res) {
        try {
            const editora = new Editora(req.body);
            const erros = editora.validar();

            if (erros !== true) {
                return res.status(400).json({ success: false, message: 'Dados inválidos', errors: erros });
            }

            const newEditora = await editorasRepository.create(editora.toJSON());

            res.status(201).json({ success: true, data: newEditora, message: 'Editora criada com sucesso' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const editoraExistente = await editorasRepository.findById(id);

            if (!editoraExistente) {
                return res.status(404).json({ success: false, message: 'Editora não encontrada' });
            }

            const editora = new Editora({ ...req.body, id });
            const erros = editora.validar();

            if (erros !== true) {
                return res.status(400).json({ success: false, message: 'Dados inválidos', errors: erros });
            }

            const editoraAtualizada = await editorasRepository.update(id, editora.toJSON());

            res.json({ success: true, data: editoraAtualizada, message: 'Editora atualizada com sucesso' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const editora = await editorasRepository.findById(id);
            
            if (!editora) {
                return res.status(404).json({ success: false, message: 'Editora não encontrada' });
            }

            const deleted = await editorasRepository.delete(id);
            
            if (deleted) {
                res.json({ success: true, message: 'Editora deletada com sucesso' });
            } else {
                res.status(500).json({ success: false, message: 'Erro ao deletar editora' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new EditorasController();