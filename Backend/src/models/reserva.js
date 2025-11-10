class Reserva {
    constructor(data) {
        this.id = data.id || null;
        this.usuario_id = data.usuario_id || null;
        this.usuario_tipo = data.usuario_tipo || '';
        this.data_reserva = data.data_reserva || new Date().toISOString().split('T')[0];
        this.data_validade = data.data_validade || null;
        this.status = data.status || 'ativa';
        this.observacoes = data.observacoes || '';
        this.usuario = data.usuario || null;
        this.livros = data.livros || []; 
        this.usuario_detalhes = data.usuario_detalhes || {
            nome: data.usuario_nome || '',
            email: data.usuario_email || '',
            telefone: data.usuario_telefone || '',
            turma: data.usuario_turma || '',
            departamento: data.usuario_departamento || '',
            tipo_especial: data.usuario_tipo_especial || ''
        };

        this.livro_id = data.livro_id || (this.livros.length > 0 ? this.livros[0].livro_id : null);
        this.total_livros = data.total_livros || this.livros.length;
    }

    validar() {
        const erros = [];
        
        if (!this.usuario_id) erros.push('Usuário é obrigatório');
        if (!this.usuario_tipo) erros.push('Tipo de usuário é obrigatório');
        if (!this.data_validade) erros.push('Data de validade é obrigatória');
        
        if (!this.livros || this.livros.length === 0) {
            erros.push('Pelo menos um livro deve ser selecionado');
        } else {
            // Validar cada livro individualmente
            this.livros.forEach((livro, index) => {
                if (!livro.livro_id) {
                    erros.push(`Livro ${index + 1}: ID do livro é obrigatório`);
                }
                // Garantir quantidade padrão
                if (!livro.quantidade || livro.quantidade < 1) {
                    livro.quantidade = 1;
                }
            });
        }

        // Validar data
        if (this.data_validade) {
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            
            const dataValidade = new Date(this.data_validade);
            dataValidade.setHours(0, 0, 0, 0);
            
            if (dataValidade < hoje) {
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
            data_reserva: this.data_reserva,
            data_validade: this.data_validade,
            status: this.status,
            observacoes: this.observacoes,
            usuario: this.usuario,
            livros: this.livros,
            livro_id: this.livro_id,
            total_livros: this.total_livros,
            usuario_detalhes: this.usuario_detalhes 
        };
    }
}

module.exports = Reserva;