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
        this.livros = data.livros || [];
        this.usuario = data.usuario || null;
        
        this.usuario_detalhes = data.usuario_detalhes || {
            nome: data.usuario_nome || '',
            email: data.usuario_email || '',
            telefone: data.usuario_telefone || '',
            turma: data.usuario_turma || '',
            departamento: data.usuario_departamento || '',
            tipo_especial: data.usuario_tipo_especial || ''
        };
    }

    validar() {
        const erros = [];
        
        if (!this.usuario_id) erros.push('Usuário é obrigatório');
        if (!this.usuario_tipo) erros.push('Tipo de usuário é obrigatório');
        if (!this.data_devolucao_prevista) erros.push('Data de devolução prevista é obrigatória');
        
        //  Validação mais flexível para data
        if (this.data_devolucao_prevista) {
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0); // Zera horas para comparar apenas a data
            
            const dataDevolucao = new Date(this.data_devolucao_prevista);
            dataDevolucao.setHours(0, 0, 0, 0);
            
            if (dataDevolucao < hoje) {
                erros.push('Data de devolução não pode ser no passado');
            }
            
            // Verificar se é uma data válida
            if (isNaN(dataDevolucao.getTime())) {
                erros.push('Data de devolução inválida');
            }
        }

        // Validar livros
        if (!this.livros || this.livros.length === 0) {
            erros.push('Pelo menos um livro deve ser selecionado');
        } else {
            // Validar cada livro
            this.livros.forEach((livro, index) => {
                if (!livro.livro_id) {
                    erros.push(`Livro ${index + 1}: ID do livro é obrigatório`);
                }
                if (!livro.quantidade || livro.quantidade < 1) {
                    erros.push(`Livro ${index + 1}: Quantidade deve ser pelo menos 1`);
                }
            });
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
            usuario: this.usuario,
            usuario_detalhes: this.usuario_detalhes
        };
    }
}

module.exports = Emprestimo;