class UsuarioEspecial {
    constructor(data) {
        this.id = data.id || null;
        this.nome_completo = data.nome_completo || '';
        this.email = data.email || '';
        this.telefone = data.telefone || '';
        this.cpf = data.cpf || '';
        this.tipo_usuario = data.tipo_usuario || '';
        this.data_cadastro = data.data_cadastro || null;

        this.tiposValidos = [
            'Diretor','Coordenador','Secretário','Bibliotecário','Orientador',
            'Funcionário','Assistente Administrativo','Ex-aluno','Pais ou Responsável','Outro'
        ];
    }

    validar() {
        const erros = [];
        if (!this.nome_completo || this.nome_completo.trim() === '') erros.push('Nome completo é obrigatório');
        if (!this.email || this.email.trim() === '') erros.push('Email é obrigatório');
        if (!this.telefone || this.telefone.trim() === '') erros.push('Telefone é obrigatório');
        if (!this.cpf || this.cpf.trim() === '') erros.push('CPF é obrigatório');
        if (!this.tipo_usuario || this.tipo_usuario.trim() === '') erros.push('Tipo de usuário é obrigatório');

        if (this.email && !this.email.includes('@')) erros.push('Email inválido');
        if (this.tipo_usuario && !this.tiposValidos.includes(this.tipo_usuario)) erros.push(`Tipo de usuário inválido. Use: ${this.tiposValidos.join(', ')}`);

        return erros.length === 0 ? true : erros;
    }

    toJSON() {
        return {
            id: this.id,
            nome_completo: this.nome_completo,
            email: this.email,
            telefone: this.telefone,
            cpf: this.cpf,
            tipo_usuario: this.tipo_usuario,
            data_cadastro: this.data_cadastro
        };
    }
}

module.exports = UsuarioEspecial;
