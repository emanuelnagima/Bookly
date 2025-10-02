import 'bootstrap/dist/css/bootstrap.min.css';

const FAQ = () => {
  return (
    <div className="faq-page">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-9 col-md-11">

            {/* Cabeçalho */}
            <div className="text-center mb-5">
              <div className="faq-icon mb-4">
                <span className="icon-wrapper">?</span>
              </div>
              <h1 className="display-5 fw-bold mb-3 gradient-text">FAQ - Bookly</h1>
              <p className="lead text-muted">
                Perguntas frequentes para bibliotecários(as) e administradores(as)
              </p>
            </div>

            {/* Conteúdo Principal */}
            <div className="faq-content">
              
              {/* Pergunta 1 */}
              <div className="faq-item mb-4">
                <div className="faq-question">
                  <h3 className="h4 mb-0">
                    <span className="question-number">01</span>
                    Como cadastrar um novo livro?
                  </h3>
                </div>
                <div className="faq-answer">
                  <div className="answer-content">
                    <p className="mb-2"><strong>Vá até:</strong> Cadastros › Livros › Adicionar Livro</p>
                    <p className="mb-2"><strong>Preencha as informações:</strong> Título, autor, ISBN, editora e ano de publicação.</p>
                    <p className="mb-0"><strong>Clique em:</strong> Cadastrar livro.</p>
                  </div>
                </div>
              </div>

              {/* Pergunta 2 */}
              <div className="faq-item mb-4">
                <div className="faq-question">
                  <h3 className="h4 mb-0">
                    <span className="question-number">02</span>
                    Como cadastrar autores ou editoras?
                  </h3>
                </div>
                <div className="faq-answer">
                  <div className="answer-content">
                    <p className="mb-2"><strong>Autores:</strong> Vá até Cadastros › Autores › Adicionar Autor → Preencha nome, data de nascimento e nacionalidade.</p>
                    <p className="mb-2"><strong>Clique em:</strong> Cadastrar autor.</p>
                    <p className="mb-2"><strong>Editoras:</strong> Vá até Cadastros › Editoras › Adicionar Editora → Preencha nome, endereço e contato.</p>
                    <p className="mb-0"><strong>Clique em:</strong> Cadastrar editora.</p>
                  </div>
                </div>
              </div>

              {/* Pergunta 3 */}
              <div className="faq-item mb-4">
                <div className="faq-question">
                  <h3 className="h4 mb-0">
                    <span className="question-number">03</span>
                    Como cadastrar usuários (alunos, professores ou outros)?
                  </h3>
                </div>
                <div className="faq-answer">
                  <div className="answer-content">
                    <p className="mb-2"><strong>Vá até:</strong> Cadastros › Usuários › Adicionar Usuário</p>
                    <p className="mb-2"><strong>Preencha:</strong> Nome, tipo, dados de matrícula/ID, e-mail e demais informações.</p>
                    <p className="mb-0"><strong>Clique em:</strong> Cadastrar usuário/aluno/professor.</p>
                  </div>
                </div>
              </div>

              {/* Pergunta 4 */}
              <div className="faq-item mb-4">
                <div className="faq-question">
                  <h3 className="h4 mb-0">
                    <span className="question-number">04</span>
                    Como registrar entrada ou saída de livros?
                  </h3>
                </div>
                <div className="faq-answer">
                  <div className="answer-content">
                    <p className="mb-2"><strong>Vá até:</strong> Movimentações › Entradas ou Saídas</p>
                    <p className="mb-2"><strong>Procedimento:</strong> Pesquise e selecione o livro › escolha o tipo de entrada/saída. Dependendo do tipo, o sistema irá solicitar que seja preenchido o motivo, depois informe a quantidade.</p>
                    <p className="mb-0"><strong>Clique em:</strong> Registrar entrada/saída.</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      <style>{`
        .faq-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          line-height: 1.6;
        }

        .faq-icon .icon-wrapper {
          display: inline-block;
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #6F00FF 0%, #8A2BE2 100%);
          color: white;
          border-radius: 50%;
          font-size: 2.5rem;
          font-weight: bold;
          line-height: 80px;
          text-align: center;
        }

        .gradient-text {
          background: linear-gradient(135deg, #6F00FF 0%, #8A2BE2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .faq-item {
          border-left: 4px solid #6F00FF;
          padding-left: 1.5rem;
          margin-bottom: 2rem;
        }

        .faq-item:hover {
          border-left-color: #8A2BE2;
        }

        .faq-question {
          margin-bottom: 1rem;
        }

        .question-number {
          display: inline-block;
          background: linear-gradient(135deg, #6F00FF 0%, #8A2BE2 100%);
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          text-align: center;
          line-height: 40px;
          font-weight: bold;
          margin-right: 1rem;
          font-size: 0.9rem;
        }

        .faq-answer {
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid #e9ecef;
          margin-left: 3rem;
        }

        .answer-content p {
          margin-bottom: 0.75rem;
          color: #555;
          line-height: 1.7;
        }

        .answer-content strong {
          color: #6F00FF;
        }

        @media (max-width: 768px) {
          .faq-item {
            padding-left: 1rem;
            margin-left: 0.5rem;
          }
          
          .faq-answer {
            margin-left: 1rem;
            padding: 1.25rem;
          }
          
          .question-number {
            width: 35px;
            height: 35px;
            line-height: 35px;
            margin-right: 0.75rem;
          }
        }

        @media (max-width: 576px) {
          .faq-answer {
            margin-left: 0;
            padding: 1rem;
          }
          
          .faq-icon .icon-wrapper {
            width: 60px;
            height: 60px;
            line-height: 60px;
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default FAQ;