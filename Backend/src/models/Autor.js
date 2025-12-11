class Autor {
    constructor(data) {
        this.id = data.id || null;
        this.nome = data.nome || '';
        this.nacionalidade = data.nacionalidade || '';
        this.data_nascimento = data.data_nascimento || null;
        this.data_cadastro = data.data_cadastro || null; 
    }

    static getNacionalidades() {
        return [
        "Afeganistão", "África do Sul", "Albânia", "Alemanha", "Andorra",
        "Angola", "Antígua e Barbuda", "Arábia Saudita", "Argélia", "Argentina",
        "Armênia", "Austrália", "Áustria", "Azerbaijão", "Bahamas", "Bangladesh",
        "Barbados", "Barém", "Bélgica", "Belize", "Benim", "Bielorrússia",
        "Bolívia", "Bósnia e Herzegovina", "Botsuana", "Brasil", "Brunei",
        "Bulgária", "Burquina Fasso", "Burundi", "Butão", "Cabo Verde",
        "Camarões", "Camboja", "Canadá", "Catar", "Cazaquistão", "Chade",
        "Chile", "China", "Chipre", "Colômbia", "Comores", "Congo",
        "Coreia do Norte", "Coreia do Sul", "Costa do Marfim", "Costa Rica",
        "Croácia", "Cuba", "Dinamarca", "Djibuti", "Dominica", "Egito",
        "El Salvador", "Emirados Árabes Unidos", "Equador", "Eritreia",
        "Eslováquia", "Eslovênia", "Espanha", "Estados Unidos", "Estônia",
        "Essuatíni", "Etiópia", "Fiji", "Filipinas", "Finlândia", "França",
        "Gabão", "Gâmbia", "Gana", "Geórgia", "Granada", "Grécia", "Guatemala",
        "Guiana", "Guiné", "Guiné Equatorial", "Guiné-Bissau", "Haiti",
        "Holanda", "Honduras", "Hungria", "Iêmen", "Índia", "Indonésia",
        "Irã", "Iraque", "Irlanda", "Islândia", "Israel", "Itália", "Jamaica",
        "Japão", "Jordânia", "Kuwait", "Laos", "Lesoto", "Letônia", "Líbano",
        "Libéria", "Líbia", "Liechtenstein", "Lituânia", "Luxemburgo",
        "Macedônia do Norte", "Madagascar", "Malásia", "Maláui", "Maldivas",
        "Mali", "Malta", "Marrocos", "Maurícia", "Mauritânia", "México",
        "Mianmar", "Micronésia", "Moçambique", "Moldávia", "Mônaco", "Mongólia",
        "Montenegro", "Namíbia", "Nauru", "Nepal", "Nicarágua", "Níger",
        "Nigéria", "Noruega", "Nova Zelândia", "Omã", "Outra",
        "Países Baixos", "Palau", "Panamá", "Papua-Nova Guiné", "Paquistão",
        "Paraguai", "Peru", "Polônia", "Portugal", "Quênia", "Quirguistão",
        "Reino Unido", "República Centro-Africana", "República Checa",
        "República Democrática do Congo", "República Dominicana", "Romênia",
        "Ruanda", "Rússia", "Salomão", "Samoa", "Santa Lúcia",
        "São Cristóvão e Nevis", "São Marinho", "São Tomé e Príncipe",
        "São Vicente e Granadinas", "Seicheles", "Senegal", "Serra Leoa",
        "Sérvia", "Singapura", "Síria", "Somália", "Sri Lanka", "Sudão",
        "Sudão do Sul", "Suécia", "Suíça", "Suriname", "Tailândia", "Taiwan",
        "Tajiquistão", "Tanzânia", "Timor-Leste", "Togo", "Tonga",
        "Trinidad e Tobago", "Tunísia", "Turcomenistão", "Turquia", "Tuvalu",
        "Ucrânia", "Uganda", "Uruguai", "Uzbequistão", "Vanuatu", "Vaticano",
        "Venezuela", "Vietnã", "Zâmbia", "Zimbábue"
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

    toJSON() {
        return {
            id: this.id,
            nome: this.nome,
            nacionalidade: this.nacionalidade,
            data_nascimento: this.data_nascimento,
            data_cadastro: this.data_cadastro, 
        };
    }
}

module.exports = Autor;