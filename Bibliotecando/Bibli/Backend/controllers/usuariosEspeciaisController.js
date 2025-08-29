const usuariosRepo = require('../repository/usuariosEspeciaisRepository');
const UsuarioEspecial = require('../models/usuarioEspecial');

class UsuariosEspeciaisController {
    async getAll(req, res) {
        try {
            const usuarios = await usuariosRepo.findAll();
            res.json({ success: true, data: usuarios, total: usuarios.length });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getById(req, res) {
        try {
            const usuario = await usuariosRepo.findById(req.params.id);
            usuario 
                ? res.json({ success: true, data: usuario })
                : res.status(404).json({ success: false, message: 'Usuário não encontrado' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async create(req, res) {
        try {
            const usuario = new UsuarioEspecial(req.body);
            const erros = usuario.validar();
            if (erros !== true) return res.status(400).json({ success: false, message: 'Dados inválidos', errors: erros });

            const novoUsuario = await usuariosRepo.create(usuario);
            res.status(201).json({ success: true, data: novoUsuario, message: 'Usuário criado!' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async update(req, res) {
        try {
            const usuarioExistente = await usuariosRepo.findById(req.params.id);
            if (!usuarioExistente) return res.status(404).json({ success: false, message: 'Usuário não encontrado' });

            const usuario = new UsuarioEspecial({ ...req.body, id: req.params.id });
            const erros = usuario.validar();
            if (erros !== true) return res.status(400).json({ success: false, message: 'Dados inválidos', errors: erros });

            const atualizado = await usuariosRepo.update(req.params.id, usuario);
            res.json({ success: true, data: atualizado, message: 'Usuário atualizado!' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async delete(req, res) {
        try {
            const deleted = await usuariosRepo.delete(req.params.id);
            deleted 
                ? res.json({ success: true, message: 'Usuário deletado!' }) 
                : res.status(404).json({ success: false, message: 'Usuário não encontrado' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new UsuariosEspeciaisController();
