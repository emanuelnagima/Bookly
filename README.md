# Bookly

O **Bookly** é um sistema completo para gerenciamento do acervo de biblioteca desenvolvido para uso interno administrativo. Ele foi criado para tornar o controle de empréstimos, reservas e consultas de livros mais **eficiente, seguro e organizado**, garantindo que o acervo da biblioteca esteja sempre atualizado.

O sistema permite o cadastro de **alunos, professores, usuários gerais, livros, autores e editoras**, além de gerenciar todo o ciclo de empréstimos, incluindo:

- Entradas de livros  
- Saídas de livros
- Reservas de livros
- Empréstimos
- Renovação de empréstimos  
- Devoluções


O **Bookly** também garante que apenas **exemplares disponíveis possam ser emprestados**, registra automaticamente a entrada de novos livros e realiza a baixa de exemplares descartados.

---


## Benefícios do sistema

- Automatiza processos que antes eram manuais, economizando tempo da equipe da biblioteca.  
- Melhora o controle sobre empréstimos e devoluções, evitando perdas e atrasos.  
- Facilita o planejamento de aquisições de livros, identificando os mais utilizados e os menos procurados.  
- Proporciona uma experiência organizada para alunos e professores, incentivando o uso do acervo.  

O **Bookly** é, portanto, uma **solução completa, confiável e moderna** para gerenciamento de bibliotecas escolares, que alia tecnologia, segurança e praticidade para melhorar a gestão do acervo e o atendimento aos usuários.

---


# 📚 Instalação

Projeto desenvolvido para gestão de uma biblioteca, dividido em **Frontend** e **Backend**.  
Este guia explica como instalar, configurar e executar o sistema localmente.  

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão LTS recomendada)  
- [npm](https://www.npmjs.com/)  
- Banco de dados (MySQL ou outro compatível, conforme scripts do projeto)  
- Ligue o MySQL no Xamp

## 🚀 Primeira instalação e execução

### 🔹 Frontend

1. Acesse a pasta do frontend:
   ```bash
   
   cd Frontend
   
   npm install

   npm install axios
   
   npm install react-bootstrap bootstrap
   
   npm install react-router-dom
   
   npm install react-icons
   
   chmod +x node_modules/.bin/vite (execute somente se precisar)

   npm run dev (rodar)

### 🔹 Banco de dados
 2. Crie um database com o nome de "biblioteca"
    
   2.1 Crie todas as tabelas e insira os dados (criação de tabelas na pasta de funcionamento do sistema)

### 🔹 Backend

3. Acesse a pasta do backend:
   ```bash
   
   cd Backend
   
   npm install

   npm start (rodar)

 ---
   
## 🚀 Execução normal 
1. Acesse a pasta do frontend:
   ```bash
   
   cd Frontend
   
   npm run dev (rodar)
   

2. Acesse a pasta do backend:
   ```bash
   
   cd Backend
   
   npm start (rodar)

## Imagem da Home inicial (nome e versão desatualizados, atualizar)
![WhatsApp Image 2025-08-30 at 18 11 43](https://github.com/user-attachments/assets/85a05843-d5aa-4875-81b4-8678c09527b4)

