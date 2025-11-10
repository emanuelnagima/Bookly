const db = require('../../config/database');
const Professor = require('../models/professor');

class ProfessoresRepository {
async findAll() {
    const [rows] = await db.execute('SELECT * FROM professores');    
    const professores = rows.map(row => new Professor(row));    
    return professores;
}

    async findById(id) {
        const [rows] = await db.execute('SELECT * FROM professores WHERE id = ?', [id]);
        return rows.length ? new Professor(rows[0]) : null;
    }

    async findByMatricula(matricula) {
        const [rows] = await db.execute('SELECT * FROM professores WHERE matricula = ?', [matricula]);
        return rows.length ? new Professor(rows[0]) : null;
    }

    async findByCpf(cpf) {
        const [rows] = await db.execute('SELECT * FROM professores WHERE cpf = ?', [cpf]);
        return rows.length ? new Professor(rows[0]) : null;
    }

    async create(professorData) {
        const professor = new Professor(professorData);
        const [result] = await db.execute(
            'INSERT INTO professores (nome, cpf, data_nascimento, matricula, email, telefone, departamento) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                professor.nome,
                professor.cpf,
                professor.data_nascimento, 
                professor.matricula,
                professor.email,
                professor.telefone,
                professor.departamento
            ]
        );
        return this.findById(result.insertId);
    }

    async update(id, professorData) {
        const professor = new Professor(professorData);
        await db.execute(
            'UPDATE professores SET nome=?, cpf=?, data_nascimento=?, matricula=?, email=?, telefone=?, departamento=? WHERE id=?',
            [
                professor.nome,
                professor.cpf,
                professor.data_nascimento,
                professor.matricula,
                professor.email,
                professor.telefone,
                professor.departamento,
                id
            ]
        );
        return this.findById(id);
    }

    async delete(id) {
        const [result] = await db.execute('DELETE FROM professores WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = new ProfessoresRepository();