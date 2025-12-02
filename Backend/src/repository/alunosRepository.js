const db = require('../../config/database');
const Aluno = require('../models/aluno');

class AlunosRepository {
    async getUltimaMatricula() {
        const [rows] = await db.execute(
            'SELECT matricula FROM alunos ORDER BY id DESC LIMIT 1'
        );
        return rows.length ? rows[0].matricula : null;
    }

    async findAll() {
        const [rows] = await db.execute('SELECT * FROM alunos');
        return rows.map(row => new Aluno(row));
    }

    async findById(id) {
        const [rows] = await db.execute('SELECT * FROM alunos WHERE id = ?', [id]);
        return rows.length ? new Aluno(rows[0]) : null;
    }

    async findByMatricula(matricula) {
        const [rows] = await db.execute('SELECT * FROM alunos WHERE matricula = ?', [matricula]);
        return rows.length ? new Aluno(rows[0]) : null;
    }

    async create(alunoData) {
        const aluno = new Aluno(alunoData);
        const [result] = await db.execute(
            'INSERT INTO alunos (nome, matricula, cpf, data_nascimento, email, telefone, turma) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                aluno.nome,
                aluno.matricula, //  Já vem preenchida do controller
                aluno.cpf,
                aluno.data_nascimento,
                aluno.email,
                aluno.telefone,
                aluno.turma
            ]
        );
        return this.findById(result.insertId);
    }

    async update(id, alunoData) {
        const aluno = new Aluno(alunoData);
        await db.execute(
            'UPDATE alunos SET nome=?, matricula=?, cpf=?, data_nascimento=?, email=?, telefone=?, turma=? WHERE id=?',
            [
                aluno.nome,
                aluno.matricula,
                aluno.cpf,
                aluno.data_nascimento,
                aluno.email,
                aluno.telefone,
                aluno.turma,
                id
            ]
        );
        return this.findById(id);
    }

    async delete(id) {
        const [result] = await db.execute('DELETE FROM alunos WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

// REMOVA a função gerarNovaMatricula daqui - Ela já está no controller
module.exports = new AlunosRepository();