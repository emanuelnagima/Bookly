-- ####################################################
-- # SCRIPT DE CRIAÇÃO DO BANCO DE DADOS - BOOKLY
-- ####################################################

-- Cria o database (se não existir) e seleciona ele
CREATE DATABASE IF NOT EXISTS `biblioteca`
  DEFAULT CHARACTER SET = utf8mb4
  DEFAULT COLLATE = utf8mb4_general_ci;
USE `biblioteca`;

-- Desabilitar verificações de chave estrangeira temporariamente
SET FOREIGN_KEY_CHECKS = 0;

-- ====================================================
-- LIMPAR TABELAS EXISTENTES 
-- ====================================================

-- Tabelas filhas 
TRUNCATE TABLE IF EXISTS emprestimo_livros;
TRUNCATE TABLE IF EXISTS reserva_livros;

-- Tabelas principais
TRUNCATE TABLE IF EXISTS emprestimos;
TRUNCATE TABLE IF EXISTS reservas;

-- Excluir tabelas antigas 
DROP TABLE IF EXISTS 
  saidas,
  entradas,
  reserva_livros,
  reservas,
  emprestimo_livros,
  emprestimos,
  livros,
  autores,
  editoras,
  alunos,
  professores,
  usuarios_especiais;

-- Reativar verificações
SET FOREIGN_KEY_CHECKS = 1;

-- ====================================================
-- CRIAÇÃO DAS TABELAS PRINCIPAIS
-- ====================================================

-- -----------------------------
-- Tabela: AUTORES
-- -----------------------------
CREATE TABLE `autores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `nacionalidade` enum(
    'Estados Unidos','China','Japão','Alemanha','Reino Unido','França','Índia','Brasil','Itália','Canadá',
    'Rússia','Austrália','Coreia do Sul','México','Espanha','Indonésia','Turquia','Arábia Saudita','Suíça',
    'Holanda','Suécia','Noruega','Bélgica','Argentina','Egito','África do Sul','Nigéria','Polônia','Tailândia',
    'Singapura','Malásia','Vietnã','Israel','Grécia','Portugal','Irlanda','Finlândia','Dinamarca','Nova Zelândia',
    'Filipinas','Chile','Colômbia','Peru','Hungria','República Tcheca','Qatar','Emirados Árabes Unidos','Kuwait',
    'Bangladesh','Paquistão','Outra'
  ) NOT NULL,
  `data_nascimento` date NOT NULL,
  `data_cadastro` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------
-- Tabela: EDITORAS
-- -----------------------------
CREATE TABLE `editoras` (
   `id` int NOT NULL AUTO_INCREMENT,
   `nome` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
   `cnpj` varchar(18) COLLATE utf8mb4_general_ci NOT NULL,
   `endereco` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
   `telefone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
   `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
   `data_cadastro` datetime DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (`id`),
   UNIQUE KEY `idx_cnpj` (`cnpj`),
   UNIQUE KEY `idx_email` (`email`),
   UNIQUE KEY `idx_telefone` (`telefone`)
 ) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci

-- -----------------------------
-- Tabela: ALUNOS
-- -----------------------------
	CREATE TABLE `alunos` (
   `id` int NOT NULL AUTO_INCREMENT,
   `nome` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
   `matricula` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
   `cpf` varchar(14) COLLATE utf8mb4_general_ci NOT NULL,
   `data_nascimento` date NOT NULL,
   `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
   `telefone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
   `turma` enum('1º Ano Fundamental','2º Ano Fundamental','3º Ano Fundamental','4º Ano Fundamental','5º Ano Fundamental','6º Ano Fundamental','7º Ano Fundamental','8º Ano Fundamental','9º Ano Fundamental','1º Ano Médio','2º Ano Médio','3º Ano Médio') COLLATE utf8mb4_general_ci NOT NULL,
   `data_cadastro` datetime DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (`id`),
   UNIQUE KEY `matricula` (`matricula`),
   UNIQUE KEY `cpf` (`cpf`),
   UNIQUE KEY `email` (`email`)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci

-- -----------------------------
-- Tabela: PROFESSORES
-- -----------------------------
	CREATE TABLE `professores` (
   `id` int NOT NULL AUTO_INCREMENT,
   `nome` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
   `cpf` varchar(14) COLLATE utf8mb4_general_ci NOT NULL,
   `data_nascimento` date NOT NULL,
   `matricula` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
   `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
   `telefone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
   `departamento` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
   `data_cadastro` datetime DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (`id`),
   UNIQUE KEY `matricula` (`matricula`),
   UNIQUE KEY `email` (`email`),
   UNIQUE KEY `cpf` (`cpf`)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
-- -----------------------------
-- Tabela: USUÁRIOS ESPECIAIS
-- -----------------------------
CREATE TABLE `usuarios_especiais` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome_completo` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `telefone` varchar(20) NOT NULL,
  `cpf` varchar(14) NOT NULL,
  `data_nascimento` date DEFAULT NULL,
  `tipo_usuario` enum(
    'Diretor','Coordenador','Secretário','Bibliotecário','Orientador','Funcionário',
    'Assistente Administrativo','Ex-aluno','Pais ou Responsável','Outro'
  ) NOT NULL,
  `data_cadastro` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `cpf` (`cpf`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------
-- Tabela: LIVROS
-- -----------------------------
livros	CREATE TABLE `livros` (
   `id` int(11) NOT NULL AUTO_INCREMENT,
   `titulo` varchar(255) NOT NULL,
   `autor_id` int(11) NOT NULL,
   `editora_id` int(11) NOT NULL,
   `isbn` varchar(20) NOT NULL,
   `genero` enum('Romance','Ficção','Drama','Suspense','Fantasia','Biografia','Terror','Educação','Ciências','História','Geografia','Matemática','Física','Química','Biologia','Autoajuda','Negócios','Poesia','Teatro','Arte','Música','Esportes','Saúde','Culinária','Viagem','Policial','Aventura','Infantil','Juvenil','Humor','Religião','Filosofia','Psicologia','Sociologia','Tecnologia','Informática','Medicina','Direito','Economia','Política','Mitologia','Contos','Crônicas','Gráfico','HQ/Quadrinhos','Mangá','Ficção Científica','Distopia','Histórico','Realismo Mágico','Épico','Outro') NOT NULL,
   `ano_publicacao` int(11) NOT NULL,
   `imagem` varchar(255) DEFAULT NULL,
   `data_cadastro` datetime NOT NULL DEFAULT current_timestamp(),
   `estoque` int(11) NOT NULL DEFAULT 0,
   PRIMARY KEY (`id`),
   UNIQUE KEY `isbn` (`isbn`),
   KEY `fk_autor` (`autor_id`),
   KEY `fk_editora` (`editora_id`),
   CONSTRAINT `fk_autor` FOREIGN KEY (`autor_id`) REFERENCES `autores` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
   CONSTRAINT `fk_editora` FOREIGN KEY (`editora_id`) REFERENCES `editoras` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
 ) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci

-- ====================================================
-- TABELAS RELACIONADAS A EMPRÉSTIMOS E RESERVAS
-- ====================================================

-- -----------------------------
-- Tabela: EMPRÉSTIMOS
-- -----------------------------
	CREATE TABLE `emprestimos` (
   `id` int(11) NOT NULL AUTO_INCREMENT,
   `usuario_id` int(11) NOT NULL,
   `usuario_tipo` enum('aluno','professor','usuario_especial') NOT NULL,
   `data_emprestimo` datetime NOT NULL DEFAULT current_timestamp(),
   `data_devolucao_prevista` date NOT NULL,
   `data_devolucao_real` datetime DEFAULT NULL,
   `status` enum('ativo','finalizado','atrasado','cancelado') NOT NULL DEFAULT 'ativo',
   `observacoes` text DEFAULT NULL,
   `data_cancelamento` datetime DEFAULT NULL,
   `motivo_cancelamento` text DEFAULT NULL,
   PRIMARY KEY (`id`),
   KEY `idx_usuario` (`usuario_id`,`usuario_tipo`),
   KEY `idx_status` (`status`),
   KEY `idx_data_devolucao` (`data_devolucao_prevista`)
 ) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci

-- -----------------------------
-- Tabela: EMPRÉSTIMO_LIVROS
-- -----------------------------
CREATE TABLE `emprestimo_livros` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `emprestimo_id` int(11) NOT NULL,
  `livro_id` int(11) NOT NULL,
  `quantidade` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `fk_emprestimo` (`emprestimo_id`),
  KEY `fk_livro_emprestimo` (`livro_id`),
  CONSTRAINT `fk_emprestimo` FOREIGN KEY (`emprestimo_id`) REFERENCES `emprestimos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_livro_emprestimo` FOREIGN KEY (`livro_id`) REFERENCES `livros` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------
-- Tabela: RESERVAS
-- -----------------------------
CREATE TABLE `reservas` (
   `id` int(11) NOT NULL AUTO_INCREMENT,
   `usuario_id` int(11) NOT NULL,
   `usuario_tipo` enum('aluno','professor','usuario_especial') NOT NULL,
   `livro_id` int(11) NOT NULL,
   `data_reserva` datetime NOT NULL DEFAULT current_timestamp(),
   `data_validade` date NOT NULL,
   `status` enum('ativa','cancelada','concluida','expirada') NOT NULL DEFAULT 'ativa',
   `data_cancelamento` datetime DEFAULT NULL,
   `motivo_cancelamento` text DEFAULT NULL,
   `observacoes` text DEFAULT NULL,
   PRIMARY KEY (`id`),
   KEY `idx_usuario_reserva` (`usuario_id`,`usuario_tipo`),
   KEY `idx_livro_reserva` (`livro_id`),
   KEY `idx_status_reserva` (`status`),
   CONSTRAINT `fk_livro_reserva` FOREIGN KEY (`livro_id`) REFERENCES `livros` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
 ) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci

-- -----------------------------
-- Tabela: RESERVA_LIVROS
-- -----------------------------
CREATE TABLE `reserva_livros` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reserva_id` int(11) NOT NULL,
  `livro_id` int(11) NOT NULL,
  `quantidade` int(11) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_reserva_livro` (`reserva_id`,`livro_id`),
  KEY `livro_id` (`livro_id`),
  CONSTRAINT `reserva_livros_ibfk_1` FOREIGN KEY (`reserva_id`) REFERENCES `reservas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reserva_livros_ibfk_2` FOREIGN KEY (`livro_id`) REFERENCES `livros` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ====================================================
-- CONTROLE DE ESTOQUE (ENTRADAS E SAÍDAS)
-- ====================================================

-- -----------------------------
-- Tabela: ENTRADAS
-- -----------------------------
CREATE TABLE `entradas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `livro_id` int(11) NOT NULL,
  `origem` enum('Compra','Doação','PNLD/PMD','Ajuste de Inventário','Outro') NOT NULL,
  `observacoes` text DEFAULT NULL,
  `quantidade` int(11) NOT NULL DEFAULT 1,
  `data_aquisicao` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_livro_entrada` (`livro_id`),
  CONSTRAINT `fk_livro_entrada` FOREIGN KEY (`livro_id`) REFERENCES `livros` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------
-- Tabela: SAÍDAS
-- -----------------------------
CREATE TABLE `saidas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `livro_id` int(11) NOT NULL,
  `origem` enum(
    'Livro danificado','Livro perdido ou extraviado','Doação para terceiros',
    'Baixa administrativa / descarte','Ajuste de Inventário','Outro'
  ) NOT NULL,
  `observacoes` text DEFAULT NULL,
  `quantidade` int(11) NOT NULL DEFAULT 1,
  `data_saida` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_livro_saida` (`livro_id`),
  CONSTRAINT `fk_livro_saida` FOREIGN KEY (`livro_id`) REFERENCES `livros` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ====================================================
-- TABELA: HISTÓRICO DE CANCELAMENTOS
-- ====================================================
CREATE TABLE `historico_cancelamentos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `emprestimo_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `usuario_tipo` enum('aluno','professor','usuario_especial') NOT NULL,
  `data_cancelamento` datetime NOT NULL DEFAULT current_timestamp(),
  `motivo_cancelamento` text DEFAULT NULL,
  `livros_cancelados` text NOT NULL COMMENT 'JSON com os livros cancelados',
  `cancelado_por` varchar(100) DEFAULT NULL COMMENT 'Usuário do sistema que realizou o cancelamento',
  PRIMARY KEY (`id`),
  KEY `fk_cancelamento_emprestimo` (`emprestimo_id`),
  KEY `idx_usuario_cancelamento` (`usuario_id`,`usuario_tipo`),
  CONSTRAINT `fk_cancelamento_emprestimo` FOREIGN KEY (`emprestimo_id`) REFERENCES `emprestimos` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE usuarios_sistema (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'bibliotecario') NOT NULL,
    nome VARCHAR(100) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--  usuários do sistema
INSERT INTO usuarios_sistema (email, password, role, nome) VALUES
('admin@bookly.com', 'aDmin@&909086', 'admin', 'Administrador'),
('bibli@bookly.com', 'bibli@98!o7', 'bibliotecario', 'Bibliotecário Principal');


-- REMOVER TRIGGERS ANTIGOS SE EXISTIREM
DROP TRIGGER IF EXISTS `atualizar_status_emprestimo`;
DROP TRIGGER IF EXISTS `atualizar_status_reserva`;

-- -----------------------------
-- TRIGGER 1: Atualizar status de empréstimos para ATRASADO
-- -----------------------------
DELIMITER $$
CREATE TRIGGER `atualizar_status_emprestimo`
BEFORE UPDATE ON `emprestimos`
FOR EACH ROW
BEGIN
    -- Se o empréstimo está ativo e a data já passou
    IF NEW.status = 'ativo' AND DATE(NEW.data_devolucao_prevista) < CURDATE() THEN
        SET NEW.status = 'atrasado';
    END IF;
END$$
DELIMITER ;

-- -----------------------------
-- TRIGGER 2: Atualizar status de reservas para EXPIRADA
-- -----------------------------
DELIMITER $$
CREATE TRIGGER `atualizar_status_reserva`
BEFORE UPDATE ON `reservas`
FOR EACH ROW
BEGIN
    -- Se a reserva está ativa e a data já passou
    IF NEW.status = 'ativa' AND DATE(NEW.data_validade) < CURDATE() THEN
        SET NEW.status = 'expirada';
    END IF;
END$$
DELIMITER ;

-- ====================================================
-- VERIFICAÇÃO
-- ====================================================

-- Verificar se os triggers foram criados
SHOW TRIGGERS;

-- Ver estrutura das tabelas
DESC emprestimos;
DESC reservas;
-- Primeiro: Autores
INSERT INTO `autores` (`id`, `nome`, `nacionalidade`, `data_nascimento`) VALUES
(1, 'George Orwell', 'Reino Unido', '1903-06-25'),
(2, 'J.K. Rowling', 'Reino Unido', '1965-07-31'),
(3, 'J.R.R. Tolkien', 'Reino Unido', '1892-01-03'),
(4, 'Machado de Assis', 'Brasil', '1839-06-21'),
(5, 'Stephen King', 'Estados Unidos', '1947-09-21');

-- Segundo: Editoras
INSERT INTO `editoras` (`id`, `nome`, `cnpj`, `endereco`, `telefone`, `email`) VALUES
(1, 'Companhia das Letras', '12.345.678/0001-90', 'Rua das Letras, 123 - São Paulo/SP', '(11) 3333-4444', 'contato@companhiadasletras.com'),
(2, 'Rocco', '23.456.789/0001-01', 'Av. das Editoras, 456 - Rio de Janeiro/RJ', '(21) 2222-3333', 'editora@rocco.com.br'),
(3, 'HarperCollins', '34.567.890/0001-12', 'Broadway, 789 - New York/USA', '+1-555-123-4567', 'contact@harpercollins.com'),
(4, 'Martins Fontes', '45.678.901/0001-23', 'Rua Martins, 321 - São Paulo/SP', '(11) 4444-5555', 'contato@martinsfontes.com.br'),
(5, 'Sextante', '56.789.012/0001-34', 'Rua Sextante, 654 - Rio de Janeiro/RJ', '(21) 3333-4444', 'info@sextante.com.br');

-- Terceiro: Livros (agora com referências válidas)
INSERT INTO `livros` (`id`, `titulo`, `autor_id`, `editora_id`, `isbn`, `genero`, `ano_publicacao`, `imagem`, `estoque`) VALUES
(1, '1984', 1, 1, '978-85-359-0277-9', 'Ficção', 1949, '1984.jpg', 10),
(2, 'Harry Potter e a Pedra Filosofal', 2, 2, '978-85-325-1112-9', 'Fantasia', 1997, 'harry_potter.jpg', 8),
(3, 'O Senhor dos Anéis: A Sociedade do Anel', 3, 3, '978-85-359-0918-1', 'Fantasia', 1954, 'senhor_aneis.jpg', 6),
(4, 'Dom Casmurro', 4, 4, '978-85-336-0122-2', 'Romance', 1899, 'dom_casmurro.jpg', 12),
(5, 'It: A Coisa', 5, 5, '978-85-7542-624-1', 'Terror', 1986, 'it_a_coisa.jpg', 7);

-- Quarto: Alunos
INSERT INTO `alunos` (`id`, `nome`, `matricula`, `cpf`, `data_nascimento`, `email`, `telefone`, `turma`) VALUES
(1, 'João Silva', '20240001', '111.222.333-44', '2008-05-15', 'joao.silva@escola.edu', '(11) 99999-8888', '9º Ano Fundamental'),
(2, 'Maria Santos', '20240002', '222.333.444-55', '2009-08-22', 'maria.santos@escola.edu', '(11) 98888-7777', '8º Ano Fundamental'),
(3, 'Pedro Oliveira', '20240003', '333.444.555-66', '2007-03-10', 'pedro.oliveira@escola.edu', '(11) 97777-6666', '1º Ano Médio'),
(4, 'Ana Costa', '20240004', '444.555.666-77', '2006-11-30', 'ana.costa@escola.edu', '(11) 96666-5555', '2º Ano Médio'),
(5, 'Carlos Souza', '20240005', '555.666.777-88', '2005-02-14', 'carlos.souza@escola.edu', '(11) 95555-4444', '3º Ano Médio');

-- Quinto: Professores
INSERT INTO `professores` (`id`, `nome`, `cpf`, `data_nascimento`, `matricula`, `email`, `telefone`, `departamento`) VALUES
(1, 'Prof. Roberto Almeida', '666.777.888-99', '1980-04-12', 'PROF001', 'roberto.almeida@escola.edu', '(11) 94444-3333', 'Língua Portuguesa'),
(2, 'Prof. Sandra Lima', '777.888.999-00', '1975-09-25', 'PROF002', 'sandra.lima@escola.edu', '(11) 93333-2222', 'Literatura'),
(3, 'Prof. Marcos Ribeiro', '888.999.000-11', '1982-12-05', 'PROF003', 'marcos.ribeiro@escola.edu', '(11) 92222-1111', 'História'),
(4, 'Prof. Juliana Ferreira', '999.000.111-22', '1978-07-18', 'PROF004', 'juliana.ferreira@escola.edu', '(11) 91111-0000', 'Artes'),
(5, 'Prof. Fernando Costa', '000.111.222-33', '1985-01-30', 'PROF005', 'fernando.costa@escola.edu', '(11) 90000-9999', 'Filosofia');

-- Sexto: Usuários Especiais
INSERT INTO `usuarios_especiais` (`id`, `nome_completo`, `email`, `telefone`, `cpf`, `data_nascimento`, `tipo_usuario`) VALUES
(1, 'Diretor José Carlos', 'diretor@escola.edu', '(11) 88888-7777', '123.456.789-00', '1970-06-20', 'Diretor'),
(2, 'Bibliotecária Marta', 'biblioteca@escola.edu', '(11) 87777-6666', '234.567.890-11', '1985-03-15', 'Bibliotecário'),
(3, 'Coordenadora Teresa', 'coordenacao@escola.edu', '(11) 86666-5555', '345.678.901-22', '1978-11-08', 'Coordenador');

-- ====================================================
-- FIM DO SCRIPT
-- ====================================================
