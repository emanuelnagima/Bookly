# Bibliotecando (Bibli)

O **Bibliotecando** é um sistema completo para gerenciamento do acervo da biblioteca da Escola Prof. Oswaldo Ranazzi, desenvolvido para uso interno. Ele permite o cadastro de alunos, professores, livros, autores e editoras, e gerencia todo o ciclo de empréstimos, incluindo reservas, saídas, devoluções e renovação de livros. O sistema garante que apenas exemplares disponíveis possam ser emprestados e registra automaticamente a entrada de novos livros e a baixa de exemplares descartados, mantendo o acervo sempre atualizado.

## Funcionalidades principais

- **Cadastro completo:** alunos, professores, livros, autores e editoras, com informações detalhadas como título, editora, ano de publicação e autor.
- **Gestão de empréstimos:** registro de saídas, devoluções e renovação de livros, com controle de disponibilidade de exemplares.
- **Reservas de livros:** permite que alunos e professores reservem livros para períodos específicos.
- **Controle de acervo:** registro automático de novas entradas e baixa de livros descartados.
- **Consultas e filtros:** acesso rápido a informações sobre reservas, empréstimos, devoluções e acervo disponível.
- **Relatórios detalhados:** emissão de relatórios sobre estoque, reservas pendentes, empréstimos realizados e livros disponíveis.
- **Segurança e privacidade:** proteção de dados sensíveis dos usuários e do acervo, garantindo administração eficiente e organizada.

O **Bibliotecando** oferece uma solução completa e segura para o gerenciamento da biblioteca, facilitando o controle do acervo e tornando o processo de empréstimo mais eficiente.

*Tabela Script Banco*

 Tabela de Autores
CREATE TABLE IF NOT EXISTS autores (
    id int(11) NOT NULL AUTO_INCREMENT,
    nome varchar(100) NOT NULL,
    nacionalidade enum(
        'Estados Unidos','China','Japão','Alemanha','Reino Unido','França','Índia',
        'Brasil','Itália','Canadá','Rússia','Austrália','Coreia do Sul','México','Espanha',
        'Indonésia','Turquia','Arábia Saudita','Suíça','Holanda','Suécia','Noruega',
        'Bélgica','Argentina','Egito','África do Sul','Nigéria','Polônia','Tailândia',
        'Singapura','Malásia','Vietnã','Israel','Grécia','Portugal','Irlanda','Finlândia',
        'Dinamarca','Nova Zelândia','Filipinas','Chile','Colômbia','Peru','Hungria',
        'República Tcheca','Qatar','Emirados Árabes Unidos','Kuwait','Bangladesh',
        'Paquistão','Outra'
    ) NOT NULL,
    data_nascimento date NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabela de Professores
CREATE TABLE IF NOT EXISTS professores (
    id int(11) NOT NULL AUTO_INCREMENT,
    nome varchar(100) NOT NULL,
    matricula varchar(20) NOT NULL,
    email varchar(100) NOT NULL,
    telefone varchar(20) DEFAULT NULL,
    departamento varchar(50) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY matricula (matricula),
    UNIQUE KEY email (email)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabela de Alunos
CREATE TABLE IF NOT EXISTS alunos (
    id int(11) NOT NULL AUTO_INCREMENT,
    nome varchar(100) NOT NULL,
    matricula varchar(20) NOT NULL,
    cpf varchar(14) NOT NULL,
    data_nascimento date NOT NULL,
    email varchar(100) NOT NULL,
    telefone varchar(20) DEFAULT NULL,
    turma enum(
        '6º Ano','7º Ano','8º Ano','9º Ano',
        '1º Colegial','2º Colegial','3º Colegial'
    ) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY matricula (matricula),
    UNIQUE KEY cpf (cpf),
    UNIQUE KEY email (email)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- Tabela de Editoras
CREATE TABLE IF NOT EXISTS editoras (
    id int(11) NOT NULL AUTO_INCREMENT,
    nome varchar(100) NOT NULL,
    cnpj varchar(18) DEFAULT NULL,
    endereco varchar(200) DEFAULT NULL,
    telefone varchar(20) DEFAULT NULL,
    email varchar(100) DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY nome (nome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
