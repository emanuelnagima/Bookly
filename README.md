# Bibliotecando (Bibli)

O **Bibliotecando** é um sistema completo para gerenciamento do acervo da biblioteca da **Escola Prof. Oswaldo Ranazzi**, desenvolvido para uso interno. Ele foi criado para tornar o controle de empréstimos, reservas e consultas de livros mais **eficiente, seguro e organizado**, garantindo que o acervo da biblioteca esteja sempre atualizado.

O sistema permite o cadastro de **alunos, professores, livros, autores e editoras**, além de gerenciar todo o ciclo de empréstimos, incluindo:

- Saídas de livros  
- Devoluções  
- Renovação de empréstimos  
- Reservas de livros  

O **Bibliotecando** também garante que apenas **exemplares disponíveis possam ser emprestados**, registra automaticamente a entrada de novos livros e realiza a baixa de exemplares descartados.

---

## Funcionalidades principais

- **Cadastro completo:**  
  Permite registrar detalhes de alunos, professores, livros, autores e editoras, incluindo informações como título, autor, editora, ano de publicação, matrícula e CPF.  

- **Gestão de empréstimos:**  
  Controle rigoroso de saídas, devoluções e renovações, com verificação de disponibilidade de exemplares e histórico completo de cada usuário.  

- **Reservas de livros:**  
  Usuários podem reservar livros para datas específicas, evitando conflitos e melhorando a organização do acervo.  

- **Controle de acervo:**  
  Entrada automática de novos exemplares e baixa de livros descartados, mantendo o inventário atualizado.  

- **Consultas e filtros:**  
  Permite localizar rapidamente livros por título, autor, gênero, disponibilidade ou categoria, além de acompanhar reservas, empréstimos e devoluções.  

- **Relatórios detalhados:**  
  Emissão de relatórios sobre estoque, reservas pendentes, empréstimos realizados, livros disponíveis e histórico de usuários, auxiliando na tomada de decisões.  

- **Segurança e privacidade:**  
  Proteção de dados sensíveis de usuários e informações do acervo, com controle de acesso interno e registro de operações.  

- **Interface amigável e intuitiva:**  
  Projeto pensado para facilitar o uso por funcionários da biblioteca, mesmo sem conhecimento técnico avançado.  

- **Eficiência e organização:**  
  Reduz erros manuais, agiliza o atendimento a alunos e professores, e fornece dados confiáveis sobre o acervo e uso da biblioteca.  

---

## Benefícios do sistema

- Automatiza processos que antes eram manuais, economizando tempo da equipe da biblioteca.  
- Melhora o controle sobre empréstimos e devoluções, evitando perdas e atrasos.  
- Facilita o planejamento de aquisições de livros, identificando os mais utilizados e os menos procurados.  
- Proporciona uma experiência organizada para alunos e professores, incentivando o uso do acervo.  

O **Bibliotecando** é, portanto, uma **solução completa, confiável e moderna** para gerenciamento de bibliotecas escolares, que alia tecnologia, segurança e praticidade para melhorar a gestão do acervo e o atendimento aos usuários.

---

## Observações adicionais

- O sistema foi desenvolvido pensando na **rotina de bibliotecas escolares**, mas pode ser adaptado para uso em bibliotecas comunitárias ou pequenas instituições.  
- A documentação inclui scripts de criação de tabelas, inserts de exemplo e consultas, facilitando a instalação inicial e testes do sistema.  
- É compatível com bancos de dados **MySQL/MariaDB**, mas pode ser adaptado para outros sistemas relacionais com pequenas alterações.  



---

## SCRIPT TABELA BANCO DE DADOS


> **Observação:** Antes de executar, remova as tabelas antigas para evitar conflitos se ja existir:
>
> ```sql
> DROP TABLE IF EXISTS livros;
> DROP TABLE IF EXISTS editoras;
> DROP TABLE IF EXISTS alunos;
> DROP TABLE IF EXISTS professores;
> DROP TABLE IF EXISTS autores;
> ```


```sql
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

-- INSERT de exemplo
INSERT INTO autores (nome, nacionalidade, data_nascimento)
VALUES ('Emanuel Nepomuceno', 'Brasil', '1990-01-01');

-- SELECT de exemplo
SELECT * FROM autores;


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

-- INSERT de exemplo
INSERT INTO professores (nome, matricula, email, telefone, departamento)
VALUES ('Maria Silva', 'MAT123', 'maria@email.com', '19998887766', 'Matemática');

-- SELECT de exemplo
SELECT * FROM professores;

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

-- INSERT de exemplo
INSERT INTO alunos (nome, matricula, cpf, data_nascimento, email, telefone, turma)
VALUES ('João Pereira', 'ALU456', '123.456.789-00', '2008-05-10', 'joao@email.com', '19997776655', '9º Ano');

-- SELECT de exemplo
SELECT * FROM alunos;

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

-- INSERT de exemplo
INSERT INTO editoras (nome, cnpj, endereco, telefone, email)
VALUES ('Editora Exemplo', '12.345.678/0001-99', 'Rua Central, 100', '19991112233', 'contato@editora.com');

-- SELECT de exemplo
SELECT * FROM editoras;

CREATE TABLE IF NOT EXISTS livros (
    id int(11) NOT NULL AUTO_INCREMENT,
    titulo varchar(255) NOT NULL,
    autor varchar(255) NOT NULL,
    editora varchar(255) NOT NULL,
    isbn varchar(20) NOT NULL,
    genero enum('Romance','Ficção','Drama','Suspense','Fantasia','Biografia','Terror','Educação','Outro') NOT NULL,
    ano_publicacao int(11) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- INSERT de exemplo
INSERT INTO livros (titulo, autor, editora, isbn, genero, ano_publicacao)
VALUES ('Aprendendo SQL', 'Emanuel Nepomuceno', 'Editora Exemplo', '1234567890123', 'Educação', 2024);

-- SELECT de exemplo
SELECT * FROM livros;
