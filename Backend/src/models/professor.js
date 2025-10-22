class Professor {
    constructor(data) {
        this.id = data.id || null;
        this.nome = data.nome || '';
        this.matricula = data.matricula || '';
        this.email = data.email || '';
        this.telefone = data.telefone || '';
        this.departamento = data.departamento || ''; 

        // Departamentos permitidos 
        this.departamentosPermitidos = [
            'Educação Física',
            'Matemática',
            'Português',
            'Ciências',
            'História',
            'Inglês',
            'Geografia',
            'Artes'
        ];
    }

    validar() {
        const erros = [];
        
        
        if (!this.nome || this.nome.trim() === '') erros.push('Nome é obrigatório');
        if (!this.matricula || this.matricula.trim() === '') erros.push('Matrícula é obrigatória');
        if (!this.email || this.email.trim() === '') erros.push('Email é obrigatório');
        
        
        if (!this.departamento) {
            erros.push('Departamento é obrigatório');
        } else if (!this.departamentosPermitidos.includes(this.departamento)) {
            erros.push(`Departamento inválido. Use: ${this.departamentosPermitidos.join(', ')}`);
        }
        
        
        if (this.email && !this.email.includes('@')) {
            erros.push('Email inválido');
        }
        
        return erros.length === 0 ? true : erros;
    }

    toJSON() {
        return {
            id: this.id,
            nome: this.nome,
            matricula: this.matricula,
            email: this.email,
            telefone: this.telefone,
            departamento: this.departamentosPermitidos.includes(this.departamento) 
                ? this.departamento 
                : ''
        };
    }
}

module.exports = Professor;