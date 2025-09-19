class Entrada {
    constructor(data) {
        this.id = data.id || null;
        this.livro_id = data.livro_id || null;
        this.origem = data.origem || '';
        this.observacoes = data.observacoes || '';
        this.quantidade = data.quantidade || 1;
        this.data_aquisicao = data.data_aquisicao || new Date();
    }

    validar() {
        const erros = [];
        
        if (!this.livro_id) erros.push('Livro é obrigatório');
        if (!this.origem) erros.push('Origem é obrigatória');
        if (!this.quantidade || this.quantidade <= 0) erros.push('Quantidade deve ser maior que zero');
        
        // Validação específica para ajuste de inventário
        // Entrada
if (this.origem?.trim().toLowerCase() === 'ajuste de inventário' && (!this.observacoes || this.observacoes.trim() === '')) {
    erros.push('Para ajuste de inventário, as observações são obrigatórias');
}
        
        return erros.length === 0 ? true : erros;
    }

    toJSON() {
        return {
            id: this.id,
            livro_id: this.livro_id,
            origem: this.origem,
            observacoes: this.observacoes,
            quantidade: this.quantidade,
            data_aquisicao: this.data_aquisicao
        };
    }
}

class Saida {
    constructor(data) {
        this.id = data.id || null;
        this.livro_id = data.livro_id || null;
        this.origem = data.origem || '';
        this.observacoes = data.observacoes || '';
        this.quantidade = data.quantidade || 1;
        this.data_saida = data.data_saida || new Date();
    }

    validar() {
        const erros = [];
        
        if (!this.livro_id) erros.push('Livro é obrigatório');
        if (!this.origem) erros.push('Origem é obrigatória');
        if (!this.quantidade || this.quantidade <= 0) erros.push('Quantidade deve ser maior que zero');
        
        // Validação específica para ajuste de inventário
        if (this.origem?.trim().toLowerCase() === 'ajuste de inventário' && (!this.observacoes || this.observacoes.trim() === '')) {
    erros.push('Para ajuste de inventário, as observações são obrigatórias');
}
        
        return erros.length === 0 ? true : erros;
    }

    toJSON() {
        return {
            id: this.id,
            livro_id: this.livro_id,
            origem: this.origem,
            observacoes: this.observacoes,
            quantidade: this.quantidade,
            data_saida: this.data_saida
        };
    }
}

module.exports = { Entrada, Saida };