class Aluno {
    constructor(data) {
        this.id = data.id || null;
        this.nome = data.nome || '';
        this.matricula = data.matricula || '';
        this.cpf = data.cpf || '';
        this.data_nascimento = data.data_nascimento || null;
        this.email = data.email || '';
        this.telefone = data.telefone || '';
        this.turma = data.turma || '';
        
        // Turmas permitidas (do 6º ano ao 3º colegial)
        this.turmasValidas = [
            '6º Ano',
            '7º Ano',
            '8º Ano',
            '9º Ano',
            '1º Colegial',
            '2º Colegial',
            '3º Colegial'
        ];
    }

    validar() {
        const erros = [];
        
        if (!this.nome || this.nome.trim() === '') erros.push('Nome é obrigatório');
        if (!this.matricula || this.matricula.trim() === '') erros.push('Matrícula é obrigatória');
        if (!this.cpf || this.cpf.trim() === '') erros.push('CPF é obrigatório');
        if (!this.data_nascimento) erros.push('Data de nascimento é obrigatória');
        if (!this.email || this.email.trim() === '') erros.push('Email é obrigatório');
        if (!this.turma || this.turma.trim() === '') erros.push('Turma é obrigatória');
        
        // Validações específicas
        if (this.email && !this.email.includes('@')) erros.push('Email inválido');
        if (this.turma && !this.turmasValidas.includes(this.turma)) {
            erros.push(`Turma inválida. Use: ${this.turmasValidas.join(', ')}`);
        }
        
        return erros.length === 0 ? true : erros;
    }

    toJSON() {
        return {
            id: this.id,
            nome: this.nome,
            matricula: this.matricula,
            cpf: this.cpf,
            data_nascimento: this.data_nascimento,
            email: this.email,
            telefone: this.telefone,
            turma: this.turma
        };
    }
}

module.exports = Aluno;