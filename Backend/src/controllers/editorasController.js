const editorasRepository = require('../repository/editorasRepository');
const Editora = require('../models/editora');

class EditorasController {
    async getAll(req, res) {
        try {
            const editoras = await editorasRepository.findAll();
            res.json({ success: true, data: editoras, total: editoras.length });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const editora = await editorasRepository.findById(id);
            if (!editora) return res.status(404).json({ success: false, message: 'Editora não encontrada' });
            res.json({ success: true, data: editora }); // CORREÇÃO: mudar para success: true
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async create(req, res) {
        try {
            const editora = new Editora(req.body);
            const erros = editora.validar();
            if (erros !== true) return res.status(400).json({ success: false, message: 'Dados inválidos', errors: erros });

            const newEditora = await editorasRepository.create(editora.toJSON());
            res.status(201).json({ success: true, data: newEditora, message: 'Editora criada com sucesso' });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                const mensagem = this.getMensagemDuplicidade(error.message);
                return res.status(400).json({ success: false, message: mensagem });
            }
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const editoraExistente = await editorasRepository.findById(id);
            if (!editoraExistente) return res.status(404).json({ success: false, message: 'Editora não encontrada' });

            const editora = new Editora({ ...req.body, id });
            const erros = editora.validar();
            if (erros !== true) return res.status(400).json({ success: false, message: 'Dados inválidos', errors: erros });

            const editoraAtualizada = await editorasRepository.update(id, editora.toJSON());
            res.json({ success: true, data: editoraAtualizada, message: 'Editora atualizada com sucesso' });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                const mensagem = this.getMensagemDuplicidade(error.message);
                return res.status(400).json({ success: false, message: mensagem });
            }
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const editora = await editorasRepository.findById(id);
            if (!editora) return res.status(404).json({ success: false, message: 'Editora não encontrada' });

            const livrosVinculados = await editorasRepository.verificarLivrosVinculados(id);
            
            if (livrosVinculados > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Não é possível excluir esta editora. Existem ${livrosVinculados} livro(s) vinculado(s) a ela. Remova primeiro os livros associados.`
                });
            }

            const deleted = await editorasRepository.delete(id);
            if (deleted) res.json({ success: true, message: 'Editora deletada com sucesso' });
            else res.status(500).json({ success: false, message: 'Erro ao deletar editora' });
        } catch (error) {
            console.error('Erro ao excluir editora:', error);
            
            if (
                error.message?.includes('foreign key') ||
                error.message?.includes('livros') ||
                error.code === 'ER_ROW_IS_REFERENCED' ||
                error.code === 'ER_ROW_IS_REFERENCED_2' ||
                error.errno === 1451
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'Não é possível excluir esta editora pois ela está vinculada a um ou mais livros. Remova primeiro os livros associados.'
                });
            }

            res.status(500).json({ success: false, message: error.message });
        }
    }

    getMensagemDuplicidade(errorMessage) {
        const constraintMap = {
            'idx_email': 'e-mail',
            'idx_cnpj': 'CNPJ',
            'idx_telefone': 'telefone',
            'idx_nome': 'nome'  
        };

        const match = errorMessage.match(/for key '(.+?)'/);
        if (match && match[1]) {
            const constraintName = match[1];
            const campoAmigavel = constraintMap[constraintName] || constraintName;
            return `Já existe uma editora com este ${campoAmigavel} cadastrado.`;
        }

        return 'Já existe uma editora com estes dados cadastrada.';
    }
}

module.exports = new EditorasController();