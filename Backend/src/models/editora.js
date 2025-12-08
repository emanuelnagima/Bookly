class Editora {
    constructor(data) {
        this.id = data.id || null;
        this.nome = data.nome || '';
        this.cnpj = (data.cnpj !== undefined && data.cnpj !== null) ? String(data.cnpj) : '';
        
        this.endereco = data.endereco || null;  
        this.telefone = data.telefone || null;
        this.email = data.email || null;
        this.data_cadastro = data.data_cadastro || null; 
    }

    validar() {
        const erros = [];
        
        // NOME obrigatório
        if (!this.nome || this.nome.trim() === '') {
            erros.push('Nome é obrigatório');
        }
        
        // CNPJ OBRIGATÓRIO - verifica se está preenchido
        if (!this.cnpj || this.cnpj.trim() === '') {
            erros.push('CNPJ é obrigatório');
        } else {
            // Remove formatação para validação
            const cnpjLimpo = this.cnpj.replace(/\D/g, '');
            
            // Verifica se tem 14 dígitos (número puro)
            if (cnpjLimpo.length !== 14) {
                erros.push('CNPJ deve ter exatamente 14 dígitos');
            }
            // Verifica sequência repetida (ex: 00.000.000/0000-00)
            else if (/^(\d)\1{13}$/.test(cnpjLimpo)) {
                erros.push('CNPJ não pode ter todos os dígitos iguais');
            }
        }
        
        // VALIDAÇÃO DE EMAIL - SOMENTE SE INFORMADO (opcional)
        if (this.email && this.email.trim() !== '') {
            if (!this.validarEmail(this.email)) {
                erros.push('Email inválido');
            }
        }

        // VALIDAÇÃO DE TELEFONE - SOMENTE SE INFORMADO (opcional)
        if (this.telefone && this.telefone.trim() !== '') {
            const telefoneLimpo = this.telefone.replace(/\D/g, '');
            if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
                erros.push('Telefone deve ter 10 ou 11 dígitos');
            } else if (!this.validarTelefone(this.telefone)) {
                erros.push('Telefone inválido');
            }
        }
        
        return erros.length === 0 ? true : erros;
    }

    validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    validarTelefone(telefone) {
        // Remove formatação
        const telefoneLimpo = telefone.replace(/\D/g, '');
        
        // Verifica se tem 10 ou 11 dígitos (com DDD)
        if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) return false;
        
        // Verifica se começa com DDD válido (11 a 99)
        const ddd = parseInt(telefoneLimpo.substring(0, 2));
        if (ddd < 11 || ddd > 99) return false;
        
        // Formato simples: permite (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
        const regex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
        return regex.test(telefone);
    }

    toJSON() {
        return {
            id: this.id,
            nome: this.nome,
            cnpj: this.cnpj || '',         
            endereco: this.endereco || null, 
            telefone: this.telefone || null,
            email: this.email || null,
            data_cadastro: this.data_cadastro 
        };
    }
}

module.exports = Editora;