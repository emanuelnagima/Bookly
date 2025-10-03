import 'bootstrap/dist/css/bootstrap.min.css';

const FAQ = () => {
  return (
    <div className="page-container">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-9 col-md-11">

            {/* Cabeçalho */}
            <div className="text-center mb-5">
              <div className="page-icon mb-4">
                <span 
                  className="icon-wrapper"
                  style={{
                    background: 'linear-gradient(135deg, #6F00FF 0%, #8A2BE2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  ?
                </span>
              </div>
              <h1 className="display-5 fw-bold mb-3 gradient-text">FAQ - Bookly</h1>
              <p className="lead text-muted mb-2">
                Manual e funcionamento para bibliotecários(as) e administradores(as)
              </p>
              <p className="text-muted">
                Perguntas frequentes
              </p>
            </div>

            {/* Conteúdo Principal */}
            <div className="page-content">
              
              {/* Pergunta 1 */}
              <div className="content-item mb-4">
                <div className="item-header">
                  <h3 className="h4 mb-0">
                    <span className="item-number">01</span>
                    Como cadastrar um novo livro?
                  </h3>
                </div>
                <div className="item-body">
                  <div className="body-content">
                    <p className="mb-3">
                      <strong>Vá até:</strong> 
                    </p>
                    <div className="action-links">
                      <a href="/livros" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                        Acessar Livros
                      </a>
                    </div>
                    <p className="mb-2 mt-3"><strong>Clique em:</strong> "Adicionar Livro" no canto superior direito</p>
                    <p className="mb-2"><strong>Preencha as informações:</strong> Título, autor, ISBN, editora e ano de publicação.</p>
                    <p className="mb-0"><strong>Clique em:</strong> Cadastrar livro.</p>
                  </div>
                </div>
              </div>

              {/* Pergunta 2 */}
              <div className="content-item mb-4">
                <div className="item-header">
                  <h3 className="h4 mb-0">
                    <span className="item-number">02</span>
                    Como cadastrar autores e editoras?
                  </h3>
                </div>
                <div className="item-body">
                  <div className="body-content">
                    <p className="mb-3">
                      <strong>Autores:</strong>
                    </p>
                    <div className="action-links">
                      <a href="/autores" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                        Acessar Autores
                      </a>
                    </div>
                    <p className="mb-2 mt-3">Clique em "Adicionar Autor" › Preencha nome, data de nascimento e nacionalidade.</p>
                    <p className="mb-3"><strong>Clique em:</strong> Cadastrar autor.</p>
                    
                    <p className="mb-3">
                      <strong>Editoras:</strong>
                    </p>
                    <div className="action-links">
                      <a href="/editoras" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                        Acessar Editoras
                      </a>
                    </div>
                    <p className="mb-2 mt-3">Clique em "Adicionar Editora" › Preencha nome, CNJP, endereço e contato.</p>
                    <p className="mb-0"><strong>Clique em:</strong> Cadastrar editora.</p>
                  </div>
                </div>
              </div>

              {/* Pergunta 3 */}
              <div className="content-item mb-4">
                <div className="item-header">
                  <h3 className="h4 mb-0">
                    <span className="item-number">03</span>
                    Como cadastrar usuários (alunos, professores ou outros)?
                  </h3>
                </div>
                <div className="item-body">
                  <div className="body-content">
                    <p className="mb-3"><strong>Acesse as páginas:</strong></p>
                    <div className="action-links">
                      <a href="/alunos" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                        Acessar Alunos
                      </a>
                      <a href="/professores" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                        Acessar Professores
                      </a>
                      <a href="/usuarios-especiais" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                        Acessar Usuários 
                      </a>
                    </div>
                    <p className="mb-2 mt-3"><strong>Em cada página:</strong> Clique em "Adicionar" no canto superior direito</p>
                    <p className="mb-2"><strong>Preencha:</strong> Nome, tipo, dados de matrícula/ID, e-mail e demais informações.</p>
                    <p className="mb-0"><strong>Clique em:</strong> Cadastrar usuário/aluno/professor.</p>
                  </div>
                </div>
              </div>

              {/* Pergunta 4 */}
              <div className="content-item mb-4">
                <div className="item-header">
                  <h3 className="h4 mb-0">
                    <span className="item-number">04</span>
                    Como registrar entrada ou saída de livros?
                  </h3>
                </div>
                <div className="item-body">
                  <div className="body-content">
                    <p className="mb-3"><strong>Acesse as páginas de movimentação:</strong></p>
                    <div className="action-links">
                      <a href="/entrada" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                        Acessar Entrada
                      </a>
                      <a href="/saida" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                        Acessar Saída
                      </a>
                    </div>
                    <p className="mb-2 mt-3"><strong>Procedimento:</strong> Pesquise e selecione o livro › escolha o tipo de entrada/saída. Dependendo do tipo, o sistema irá solicitar que seja preenchido o motivo, depois informe a quantidade.</p>
                    <p className="mb-0"><strong>Clique em:</strong> Registrar entrada/saída.</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      <style>{`
        .page-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          line-height: 1.6;
        }

        .page-icon .icon-wrapper {
          display: inline-block;
          width: 80px;
          height: 80px;
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

        .content-item {
          border-left: 4px solid #6F00FF;
          padding-left: 1.5rem;
          margin-bottom: 2rem;
        }

        .content-item:hover {
          border-left-color: #8A2BE2;
        }

        .item-header {
          margin-bottom: 1rem;
        }

        .item-number {
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

        .item-body {
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid #e9ecef;
          margin-left: 3rem;
        }

        .body-content p {
          margin-bottom: 0.75rem;
          color: #555;
          line-height: 1.7;
        }

        .body-content strong {
          color: #6F00FF;
        }

        .action-links {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin: 1rem 0;
        }

        @media (max-width: 768px) {
          .content-item {
            padding-left: 1rem;
            margin-left: 0.5rem;
          }
          
          .item-body {
            margin-left: 1rem;
            padding: 1.25rem;
          }
          
          .item-number {
            width: 35px;
            height: 35px;
            line-height: 35px;
            margin-right: 0.75rem;
          }
        }

        @media (max-width: 576px) {
          .item-body {
            margin-left: 0;
            padding: 1rem;
          }
          
          .page-icon .icon-wrapper {
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