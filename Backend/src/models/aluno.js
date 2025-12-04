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
        this.data_cadastro = data.data_cadastro || data.created_at || data.dataCadastro || null;
        
        // Turmas permitidas 
        this.turmasValidas = [
            '1º Ano Fundamental', '2º Ano Fundamental', '3º Ano Fundamental', 
            '4º Ano Fundamental', '5º Ano Fundamental', '6º Ano Fundamental', 
            '7º Ano Fundamental', '8º Ano Fundamental', '9º Ano Fundamental',
            '1º Ano Médio', '2º Ano Médio', '3º Ano Médio'
        ];
    }

    validar() {
        const erros = [];
        
        if (!this.nome || this.nome.trim() === '') erros.push('Nome é obrigatório');
        if (!this.cpf || this.cpf.trim() === '') erros.push('CPF é obrigatório');
        if (!this.data_nascimento) erros.push('Data de nascimento é obrigatória');
        if (!this.email || this.email.trim() === '') erros.push('Email é obrigatório');
        if (!this.turma || this.turma.trim() === '') erros.push('Turma é obrigatória');
        
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
            turma: this.turma,
            data_cadastro: this.data_cadastro
        };
    }
}

module.exports = Aluno;