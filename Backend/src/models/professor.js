class Professor {
    constructor(data) {
        this.id = data.id || null;
        this.nome = data.nome || '';
        this.cpf = data.cpf || '';
        this.data_nascimento = data.data_nascimento || null;
        this.matricula = data.matricula || ''; // Será gerada automaticamente
        this.email = data.email || '';
        this.telefone = data.telefone || '';
        this.departamento = data.departamento || '';
        this.data_cadastro = data.data_cadastro || null; 
        
        this.departamentosPermitidos = [
            'Matemática', 'Ciências', 'Português', 'História', 'Geografia', 
            'Inglês', 'Espanhol', 'Educação Física', 'Artes', 'Música', 
            'Teatro', 'Filosofia', 'Sociologia', 'Biologia', 'Física', 
            'Química', 'Informática', 'Programação', 'Administração', 
            'Psicologia', 'Pedagogia'
        ];
    }

    validar() {
        const erros = [];
        
        // Validações obrigatórias
        if (!this.nome || this.nome.trim() === '') erros.push('Nome é obrigatório');
        if (!this.cpf || this.cpf.trim() === '') erros.push('CPF é obrigatório');
        if (!this.data_nascimento) erros.push('Data de nascimento é obrigatória');
        if (!this.email || this.email.trim() === '') erros.push('Email é obrigatório');
        if (!this.departamento || this.departamento.trim() === '') erros.push('Departamento é obrigatório');
        
        // Validações específicas
        if (this.email && !this.email.includes('@')) erros.push('Email inválido');
        if (this.departamento && !this.departamentosPermitidos.includes(this.departamento)) {
            erros.push(`Departamento inválido. Use: ${this.departamentosPermitidos.join(', ')}`);
        }
        
        // Validação de CPF (11 dígitos)
        if (this.cpf && this.cpf.replace(/\D/g, '').length !== 11) {
            erros.push('CPF deve ter 11 dígitos');
        }
        
        return erros.length === 0 ? true : erros;
    }

    toJSON() {
        return {
            id: this.id,
            nome: this.nome,
            cpf: this.cpf,
            data_nascimento: this.data_nascimento, 
            matricula: this.matricula,
            email: this.email,
            telefone: this.telefone,
            departamento: this.departamentosPermitidos.includes(this.departamento) 
                ? this.departamento 
                : '',
            data_cadastro: this.data_cadastro 
        };
    }
}

module.exports = Professor;