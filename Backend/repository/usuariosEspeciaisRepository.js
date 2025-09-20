const db = require('../config/database');
const UsuarioEspecial = require('../models/usuarioEspecial');

class UsuariosEspeciaisRepository {
    async findAll() {
        const [rows] = await db.execute('SELECT * FROM usuarios_especiais');
        return rows.map(row => new UsuarioEspecial(row));
    }

    async findById(id) {
        const [rows] = await db.execute('SELECT * FROM usuarios_especiais WHERE id = ?', [id]);
        return rows.length ? new UsuarioEspecial(rows[0]) : null;
    }

    async create(data) {
        const usuario = new UsuarioEspecial(data);
        const [result] = await db.execute(
            'INSERT INTO usuarios_especiais (nome_completo, email, telefone, cpf, tipo_usuario) VALUES (?, ?, ?, ?, ?)',
            [usuario.nome_completo, usuario.email, usuario.telefone, usuario.cpf, usuario.tipo_usuario]
        );
        return this.findById(result.insertId);
    }

    async update(id, data) {
        const usuario = new UsuarioEspecial(data);
        await db.execute(
            'UPDATE usuarios_especiais SET nome_completo=?, email=?, telefone=?, cpf=?, tipo_usuario=? WHERE id=?',
            [usuario.nome_completo, usuario.email, usuario.telefone, usuario.cpf, usuario.tipo_usuario, id]
        );
        return this.findById(id);
    }

    async delete(id) {
        const [result] = await db.execute('DELETE FROM usuarios_especiais WHERE id=?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = new UsuariosEspeciaisRepository();
