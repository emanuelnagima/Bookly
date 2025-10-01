import 'bootstrap/dist/css/bootstrap.min.css';

const FAQ = () => {
  return (
    <div className="faq-page">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">

            {/* Cabeçalho */}
            <div className="text-center mb-5">
              <h1 className="h2 mb-3">FAQ - Bookly</h1>
              <p className="text-muted">
                Perguntas frequentes para bibliotecários e administradores
              </p>
            </div>

            {/* Conteúdo Principal */}
            <div className="faq-content">
              
              {/* Pergunta 1 */}
              <section className="mb-5">
                <h2 className="h4 mb-3">1. Como cadastrar um novo livro?</h2>
                <div className="p-3 bg-light rounded">
                  <p className="mb-2"><strong>Vá até:</strong> Cadastros → Livros → Adicionar Livro</p>
                  <p className="mb-2"><strong>Preencha as informações:</strong> título, autor, ISBN, editora, ano de publicação.</p>
                  <p className="mb-0"><strong>Clique em:</strong> Cadastrar livro.</p>
                </div>
              </section>

              {/* Pergunta 2 */}
              <section className="mb-5">
                <h2 className="h4 mb-3">2. Como cadastrar autores ou editoras?</h2>
                <div className="p-3 bg-light rounded">
                  <p className="mb-2"><strong>Autores:</strong> Cadastros → Autores → Adicionar Autor → Preencha nome, data de nascimento e nacionalidade → Cadastrar autor.</p>
                  <p className="mb-0"><strong>Editoras:</strong> Cadastros → Editoras → Adicionar Editora → Preencha nome, endereço e contato → Cadastrar editora.</p>
                </div>
              </section>

              {/* Pergunta 3 */}
              <section className="mb-5">
                <h2 className="h4 mb-3">3. Como cadastrar usuários (alunos, professores ou outros)?</h2>
                <div className="p-3 bg-light rounded">
                  <p className="mb-2"><strong>Vá até:</strong> Cadastros → Usuários → Adicionar Usuário</p>
                  <p className="mb-2"><strong>Preencha:</strong> nome, tipo, dados matrícula/ID, e-mail e etc</p>
                  <p className="mb-0"><strong>Clique em:</strong> Cadastrar usuario/aluno/prof.</p>
                </div>
              </section>

              {/* Pergunta 4 */}
              <section className="mb-4">
                <h2 className="h4 mb-3">4. Como registrar entrada ou saída de livros?</h2>
                <div className="p-3 bg-light rounded">
                  <p className="mb-2"><strong>Vá até:</strong> Movimentações → Entradas ou Saídas</p>
                  <p className="mb-2"><strong>Procedimento:</strong> Pesquise, selecione o livro → selecione o tipo de entrada/saída e dependendo do tipo o sistema ira necessitar que preenchia o motivo e informe a quantidade</p>
                  <p className="mb-0"><strong>Clique em:</strong> Registrar Entrada/Saída.</p>
                </div>
              </section>

            </div>

          </div>
        </div>
      </div>

      <style>{`
        .faq-page {
          min-height: 100vh;
          background: #f8f9fa;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          line-height: 1.6;
        }

        .faq-content h2 {
          color: #2c3e50;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .faq-content p {
          margin-bottom: 0.5rem;
          color: #555;
        }

        @media (max-width: 768px) {
          .container {
            padding: 0 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default FAQ;