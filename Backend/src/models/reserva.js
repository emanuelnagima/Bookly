class Reserva {
    constructor(data) {
        this.id = data.id || null;
        this.usuario_id = data.usuario_id || null;
        this.usuario_tipo = data.usuario_tipo || '';
        this.livro_id = data.livro_id || null;
        this.data_reserva = data.data_reserva || new Date();
        this.data_validade = data.data_validade || null;
        this.status = data.status || 'ativa';
        this.observacoes = data.observacoes || '';
        this.livro = data.livro || null; // Dados do livro
        this.usuario = data.usuario || null; // Dados do usuário
    }

    validar() {
        const erros = [];
        
        if (!this.usuario_id) erros.push('Usuário é obrigatório');
        if (!this.usuario_tipo) erros.push('Tipo de usuário é obrigatório');
        if (!this.livro_id) erros.push('Livro é obrigatório');
        if (!this.data_validade) erros.push('Data de validade é obrigatória');
        
        // Validar se a data de validade é futura
        if (this.data_validade) {
            const hoje = new Date();
            const dataValidade = new Date(this.data_validade);
            if (dataValidade <= hoje) {
                erros.push('Data de validade deve ser futura');
            }
        }

        return erros.length === 0 ? true : erros;
    }

    toJSON() {
        return {
            id: this.id,
            usuario_id: this.usuario_id,
            usuario_tipo: this.usuario_tipo,
            livro_id: this.livro_id,
            data_reserva: this.data_reserva,
            data_validade: this.data_validade,
            status: this.status,
            observacoes: this.observacoes,
            livro: this.livro,
            usuario: this.usuario
        };
    }
}

module.exports = Reserva;