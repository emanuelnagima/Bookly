class Emprestimo {
    constructor(data) {
        this.id = data.id || null;
        this.usuario_id = data.usuario_id || null;
        this.usuario_tipo = data.usuario_tipo || '';
        this.data_emprestimo = data.data_emprestimo || new Date();
        this.data_devolucao_prevista = data.data_devolucao_prevista || null;
        this.data_devolucao_real = data.data_devolucao_real || null;
        this.status = data.status || 'ativo';
        this.observacoes = data.observacoes || '';
        this.livros = data.livros || []; // Array de livros do empréstimo
        this.usuario = data.usuario || null; // Dados do usuário
    }

    validar() {
        const erros = [];
        
        if (!this.usuario_id) erros.push('Usuário é obrigatório');
        if (!this.usuario_tipo) erros.push('Tipo de usuário é obrigatório');
        if (!this.data_devolucao_prevista) erros.push('Data de devolução prevista é obrigatória');
        
        // Validar se a data de devolução é futura
        if (this.data_devolucao_prevista) {
            const hoje = new Date();
            const dataDevolucao = new Date(this.data_devolucao_prevista);
            if (dataDevolucao <= hoje) {
                erros.push('Data de devolução deve ser futura');
            }
        }

        // Validar livros
        if (!this.livros || this.livros.length === 0) {
            erros.push('Pelo menos um livro deve ser selecionado');
        }

        return erros.length === 0 ? true : erros;
    }

    toJSON() {
        return {
            id: this.id,
            usuario_id: this.usuario_id,
            usuario_tipo: this.usuario_tipo,
            data_emprestimo: this.data_emprestimo,
            data_devolucao_prevista: this.data_devolucao_prevista,
            data_devolucao_real: this.data_devolucao_real,
            status: this.status,
            observacoes: this.observacoes,
            livros: this.livros,
            usuario: this.usuario
        };
    }
}

module.exports = Emprestimo;