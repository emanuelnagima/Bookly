class Editora {
    constructor(data) {
        this.id = data.id || null;
        this.nome = data.nome || '';
        this.cnpj = data.cnpj || null;
        this.endereco = data.endereco || null;
        this.telefone = data.telefone || null;
        this.email = data.email || null;
    }

    validar() {
        const erros = [];
        
        if (!this.nome || this.nome.trim() === '') {
            erros.push('Nome é obrigatório');
        }
        
        // Validação opcional para CNPJ (se fornecido)
        if (this.cnpj && !this.validarCNPJ(this.cnpj)) {
            erros.push('CNPJ inválido');
        }
        
        // Validação opcional para email (se fornecido)
        if (this.email && !this.validarEmail(this.email)) {
            erros.push('Email inválido');
        }
        
        return erros.length === 0 ? true : erros;
    }

    validarCNPJ(cnpj) {
        // Implementação básica de validação de CNPJ
        const regex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/;
        return regex.test(cnpj);
    }

    validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    toJSON() {
        return {
            id: this.id,
            nome: this.nome,
            cnpj: this.cnpj,
            endereco: this.endereco,
            telefone: this.telefone,
            email: this.email
        };
    }
}

module.exports = Editora;