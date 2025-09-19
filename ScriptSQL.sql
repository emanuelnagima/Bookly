-- ####################################################
-- # Script de Criação de Tabelas e Inserts de Exemplo
-- ####################################################

-- Antes de criar, limpar tabelas antigas
DROP TABLE IF EXISTS livros;
DROP TABLE IF EXISTS autores;
DROP TABLE IF EXISTS editoras;
DROP TABLE IF EXISTS alunos;
DROP TABLE IF EXISTS professores;
DROP TABLE IF EXISTS usuarios_especiais;

-- ####################################################
-- # Tabela: autores
-- ####################################################
CREATE TABLE IF NOT EXISTS autores (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    nacionalidade ENUM(
        'Estados Unidos','China','Japão','Alemanha','Reino Unido','França','Índia',
        'Brasil','Itália','Canadá','Rússia','Austrália','Coreia do Sul','México','Espanha',
        'Indonésia','Turquia','Arábia Saudita','Suíça','Holanda','Suécia','Noruega',
        'Bélgica','Argentina','Egito','África do Sul','Nigéria','Polônia','Tailândia',
        'Singapura','Malásia','Vietnã','Israel','Grécia','Portugal','Irlanda','Finlândia',
        'Dinamarca','Nova Zelândia','Filipinas','Chile','Colômbia','Peru','Hungria',
        'República Tcheca','Qatar','Emirados Árabes Unidos','Kuwait','Bangladesh',
        'Paquistão','Outra'
    ) NOT NULL,
    data_nascimento DATE NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert de exemplo
INSERT INTO autores (nome, nacionalidade, data_nascimento)
VALUES ('Emanuel Nepomuceno', 'Brasil', '1990-01-01');

-- ####################################################
-- # Tabela: editoras
-- ####################################################
CREATE TABLE IF NOT EXISTS editoras (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    cnpj VARCHAR(18) DEFAULT NULL,
    endereco VARCHAR(200) DEFAULT NULL,
    telefone VARCHAR(20) DEFAULT NULL,
    email VARCHAR(100) DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY idx_nome (nome),
    UNIQUE KEY idx_email (email),
    UNIQUE KEY idx_cnpj (cnpj),
    UNIQUE KEY idx_telefone (telefone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert de exemplo
INSERT INTO editoras (nome, cnpj, endereco, telefone, email)
VALUES ('Editora Exemplo', '12.345.678/0001-99', 'Rua Central, 100', '19991112233', 'contato@editora.com');

-- ####################################################
-- # Tabela: livros
-- ####################################################
CREATE TABLE IF NOT EXISTS livros (
    id INT(11) NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(255) NOT NULL,
    autor_id INT(11) NOT NULL,
    editora_id INT(11) NOT NULL,
    isbn VARCHAR(20) NOT NULL UNIQUE,
    genero ENUM('Romance','Ficção','Drama','Suspense','Fantasia','Biografia','Terror','Educação','Outro') NOT NULL,
    ano_publicacao INT(11) NOT NULL,
    imagem VARCHAR(255) DEFAULT NULL,
    data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estoque INT(11) NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    KEY fk_autor (autor_id),
    KEY fk_editora (editora_id),
    CONSTRAINT fk_autor FOREIGN KEY (autor_id) REFERENCES autores(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_editora FOREIGN KEY (editora_id) REFERENCES editoras(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ####################################################
-- # Tabela: alunos
-- ####################################################
CREATE TABLE IF NOT EXISTS alunos (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    matricula VARCHAR(20) NOT NULL,
    cpf VARCHAR(14) NOT NULL,
    data_nascimento DATE NOT NULL,
    email VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) DEFAULT NULL,
    turma ENUM(
        '6º Ano','7º Ano','8º Ano','9º Ano',
        '1º Colegial','2º Colegial','3º Colegial'
    ) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY matricula (matricula),
    UNIQUE KEY cpf (cpf),
    UNIQUE KEY email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert de exemplo
INSERT INTO alunos (nome, matricula, cpf, data_nascimento, email, telefone, turma)
VALUES ('João Pereira', 'ALU456', '123.456.789-00', '2008-05-10', 'joao@email.com', '19997776655', '9º Ano');

-- ####################################################
-- # Tabela: professores
-- ####################################################
CREATE TABLE IF NOT EXISTS professores (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    matricula VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) DEFAULT NULL,
    departamento VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY matricula (matricula),
    UNIQUE KEY email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert de exemplo
INSERT INTO professores (nome, matricula, email, telefone, departamento)
VALUES ('Maria Silva', 'MAT123', 'maria@email.com', '19998887766', 'Matemática');

-- ####################################################
-- # Tabela: usuarios_especiais
-- ####################################################
CREATE TABLE IF NOT EXISTS usuarios_especiais (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nome_completo VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefone VARCHAR(20) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    tipo_usuario ENUM(
        'Diretor','Coordenador','Secretário','Bibliotecário','Orientador',
        'Funcionário','Assistente Administrativo','Ex-aluno','Pais ou Responsável','Outro'
    ) NOT NULL,
    data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ####################################################
-- # Tabela: entradas
-- ####################################################
CREATE TABLE IF NOT EXISTS entradas (
    id INT(11) NOT NULL AUTO_INCREMENT,
    livro_id INT(11) NOT NULL,
    origem ENUM('Compra','Doação','PNLD/PMD','Ajuste de Inventário','Outro') NOT NULL,
    observacoes TEXT DEFAULT NULL,
    quantidade INT(11) NOT NULL DEFAULT 1,
    data_aquisicao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY fk_livro_entrada (livro_id),
    CONSTRAINT fk_livro_entrada FOREIGN KEY (livro_id) REFERENCES livros(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ####################################################
-- # Tabela: saidas
-- ####################################################
CREATE TABLE IF NOT EXISTS saidas (
    id INT(11) NOT NULL AUTO_INCREMENT,
    livro_id INT(11) NOT NULL,
    origem ENUM(
        'Livro danificado','Livro perdido ou extraviado',
        'Doação para terceiros','Baixa administrativa / descarte',
        'Ajuste de Inventário','Outro'
    ) NOT NULL,
    observacoes TEXT DEFAULT NULL,
    quantidade INT(11) NOT NULL DEFAULT 1,
    data_saida TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY fk_livro_saida (livro_id),
    CONSTRAINT fk_livro_saida FOREIGN KEY (livro_id) REFERENCES livros(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
