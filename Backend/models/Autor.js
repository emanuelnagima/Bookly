class Autor {
    constructor(data) {
        this.id = data.id || null;
        this.nome = data.nome || '';
        this.nacionalidade = data.nacionalidade || '';
        this.data_nascimento = data.data_nascimento || null;
    }

    static getNacionalidades() {
        return [
            "Estados Unidos", "China", "Japão", "Alemanha", "Reino Unido",
            "França", "Índia", "Brasil", "Itália", "Canadá",
            "Rússia", "Austrália", "Coreia do Sul", "México", "Espanha",
            "Indonésia", "Turquia", "Arábia Saudita", "Suíça", "Holanda",
            "Suécia", "Noruega", "Bélgica", "Argentina", "Egito",
            "África do Sul", "Nigéria", "Polônia", "Tailândia", "Singapura",
            "Malásia", "Vietnã", "Israel", "Grécia", "Portugal",
            "Irlanda", "Finlândia", "Dinamarca", "Nova Zelândia", "Filipinas",
            "Chile", "Colômbia", "Peru", "Hungria", "República Tcheca",
            "Qatar", "Emirados Árabes Unidos", "Kuwait", "Bangladesh", "Paquistão",
            "Outra"
        ];
    }

    validar() {
        const erros = [];
        
        if (!this.nome || this.nome.trim() === '') erros.push('Nome é obrigatório');
        if (!this.nacionalidade || this.nacionalidade.trim() === '') {
            erros.push('Nacionalidade é obrigatória');
        } else if (!Autor.getNacionalidades().includes(this.nacionalidade) && this.nacionalidade !== 'Outra') {
            erros.push('Nacionalidade inválida');
        }
        if (!this.data_nascimento) erros.push('Data de nascimento é obrigatória');
        
        return erros.length === 0 ? true : erros;
    }
}

module.exports = Autor;