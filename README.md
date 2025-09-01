# Bibliotecando (Bibli)

O **Bibliotecando** é um sistema completo para gerenciamento do acervo da biblioteca da **Escola Prof. Oswaldo Ranazzi**, desenvolvido para uso interno. Ele foi criado para tornar o controle de empréstimos, reservas e consultas de livros mais **eficiente, seguro e organizado**, garantindo que o acervo da biblioteca esteja sempre atualizado.

O sistema permite o cadastro de **alunos, professores, usuários gerais, livros, autores e editoras**, além de gerenciar todo o ciclo de empréstimos, incluindo:

- Saídas de livros  
- Devoluções  
- Renovação de empréstimos  
- Reservas de livros  

O **Bibliotecando** também garante que apenas **exemplares disponíveis possam ser emprestados**, registra automaticamente a entrada de novos livros e realiza a baixa de exemplares descartados.

---

## Funcionalidades principais

- **Cadastro completo:**  
  Permite registrar detalhes de alunos, professores, usuarios diversos, livros, autores e editoras, incluindo informações como título, autor, editora, ano de publicação, matrícula, e-mail, CPF etc.  

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


# 📚 Sistema Biblioteca

Projeto desenvolvido para gestão de uma biblioteca, dividido em **Frontend** e **Backend**.  
Este guia explica como instalar, configurar e executar o sistema localmente.  

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão LTS recomendada)  
- [npm](https://www.npmjs.com/)  
- Banco de dados (MySQL ou outro compatível, conforme scripts do projeto)  

---

## 🚀 Instalação e Execução

### 🔹 Frontend

1. Acesse a pasta do frontend:
   ```bash
   
   cd Bibliotecando/Bibli/Frontend
   
npm install

npm install react-bootstrap bootstrap

npm install react-router-dom

npm install react-icons

chmod +x node_modules/.bin/vite

npm run dev



