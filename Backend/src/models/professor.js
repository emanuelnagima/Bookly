class Professor {
    constructor(data) {
        this.id = data.id || null;
        this.nome = data.nome || '';
        this.cpf = data.cpf || '';
        this.data_nascimento = data.data_nascimento || null;
        this.matricula = data.matricula || '';
        this.email = data.email || '';
        this.telefone = data.telefone || '';
        this.departamento = data.departamento || '';

        console.log('👤 Professor constructor - data_nascimento:', this.data_nascimento); 

        this.departamentosPermitidos = [
            'Matemática', 'Ciências', 'Português', 'História', 'Geografia', 
            'Inglês', 'Espanhol', 'Educação Física', 'Artes', 'Música', 
            'Teatro', 'Filosofia', 'Sociologia', 'Biologia', 'Física', 
            'Química', 'Informática', 'Programação', 'Administração', 
            'Economia', 'Psicologia', 'Pedagogia'
        ];
    }

    validar() {
        const erros = [];
        
        // Validações obrigatórias
        if (!this.nome || this.nome.trim() === '') erros.push('Nome é obrigatório');
        if (!this.matricula || this.matricula.trim() === '') erros.push('Matrícula é obrigatória');
        if (!this.email || this.email.trim() === '') erros.push('Email é obrigatório');
        if (!this.departamento || this.departamento.trim() === '') erros.push('Departamento é obrigatório');
        
        // Validações específicas
        if (this.email && !this.email.includes('@')) erros.push('Email inválido');
        if (this.departamento && !this.departamentosPermitidos.includes(this.departamento)) {
            erros.push(`Departamento inválido. Use: ${this.departamentosPermitidos.join(', ')}`);
        }
        
        return erros.length === 0 ? true : erros;
    }

    toJSON() {
        const json = {
            id: this.id,
            nome: this.nome,
            cpf: this.cpf,
            data_nascimento: this.data_nascimento, 
            matricula: this.matricula,
            email: this.email,
            telefone: this.telefone,
            departamento: this.departamentosPermitidos.includes(this.departamento) 
                ? this.departamento 
                : ''
        };
        return json;
    }
}

module.exports = Professor;