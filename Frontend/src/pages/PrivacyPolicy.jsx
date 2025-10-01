import 'bootstrap/dist/css/bootstrap.min.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-simple">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">

            {/* Cabeçalho Simples */}
            <div className="text-center mb-5">
              <h1 className="h2 mb-3">Política de Privacidade</h1>
              <p className="text-muted">
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>

            {/* Conteúdo Principal */}
            <div className="privacy-content">
              <div className="mb-4">
                <p className="fw-bold">
                  Esta plataforma é mantida e operada por Bookly.
                </p>
                <p>
                  Nós coletamos e utilizamos dados pessoais de usuários da nossa plataforma de 
                  gestão bibliotecária. Agimos na qualidade de controlador desses dados, em conformidade 
                  com a Lei Federal n. 13.709/2018 (Lei Geral de Proteção de Dados Pessoais - LGPD).
                </p>
                <p>
                  Nossa política de privacidade contém informações importantes sobre:
                </p>
                <ul>
                  <li>Quem deve utilizar a plataforma</li>
                  <li>Quais dados coletamos e com qual finalidade</li>
                  <li>Seus direitos em relação aos dados pessoais</li>
                  <li>Como entrar em contato conosco</li>
                  <li>Medidas especiais para proteção de dados de menores, quando aplicável</li>
                </ul>
              </div>

              {/* Quem deve usar */}
              <section className="mb-5">
                <h2 className="h4 mb-3">1. Quem deve utilizar nossa plataforma</h2>
                <p>
                  Nossa plataforma é destinada exclusivamente a bibliotecários, administradores e 
                  usuários autorizados pelas instituições. O acesso é restrito mediante credenciais específicas.
                </p>
              </section>

              {/* Dados coletados */}
              <section className="mb-5">
                <h2 className="h4 mb-3">2. Dados que coletamos e motivos da coleta</h2>
                <p>
                  Coletamos dados pessoais para permitir a gestão adequada do acervo, o controle de 
                  empréstimos, devoluções, reservas e relatórios estatísticos.
                </p>

                <h3 className="h5 mt-4 mb-3">Dados pessoais fornecidos expressamente pelo usuário</h3>
                <p>Os seguintes dados são coletados diretamente do usuário ou de seus representantes legais:</p>
                
                <div className="data-categories">
                  <div className="data-category mb-3">
                    <h4 className="h6 fw-bold">Cadastro de Usuários:</h4>
                    <ul>
                      <li>Nome completo</li>
                      <li>CPF, CNPJ ou matrícula escolar</li>
                      <li>Endereço completo</li>
                      <li>Telefone e e-mail para contato</li>
                      <li>Dados de responsáveis, quando o usuário for menor de idade</li>
                    </ul>
                  </div>

                  <div className="data-category mb-3">
                    <h4 className="h6 fw-bold">Gestão do Acervo:</h4>
                    <ul>
                      <li>Cadastro de autores e editoras</li>
                      <li>Registro de livros e exemplares</li>
                      <li>Informações bibliográficas para controle do acervo</li>
                    </ul>
                  </div>

                  <div className="data-category mb-3">
                    <h4 className="h6 fw-bold">Operações do Sistema:</h4>
                    <ul>
                      <li>Histórico de empréstimos e devoluções</li>
                      <li>Controle de reservas</li>
                      <li>Relatórios internos para gestão da biblioteca</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Finalidade */}
              <section className="mb-5">
                <h2 className="h4 mb-3">3. Finalidade do tratamento dos dados pessoais</h2>
                <p>
                  Os dados pessoais coletados são utilizados para:
                </p>
                <ul>
                  <li>Garantir acesso justo ao acervo bibliográfico</li>
                  <li>Gerenciar empréstimos, devoluções e reservas</li>
                  <li>Emitir relatórios internos para melhoria do serviço</li>
                  <li>Proteger dados de menores e usuários vulneráveis</li>
                </ul>
              </section>

              {/* Compartilhamento */}
              <section className="mb-5">
                <h2 className="h4 mb-3">4. Compartilhamento de dados pessoais</h2>
                <p>
                  <strong>Não compartilhamos dados com terceiros.</strong> Todas as informações permanecem no ambiente institucional, acessível apenas a bibliotecários e administradores autorizados.
                </p>
              </section>

              {/* Direitos */}
              <section className="mb-5">
                <h2 className="h4 mb-3">5. Direitos do usuário</h2>
                <p>
                  O usuário possui os direitos previstos pela LGPD, incluindo:
                </p>
                <ul>
                  <li>Confirmação da existência de tratamento</li>
                  <li>Acesso e correção de dados pessoais</li>
                  <li>Anonimização, bloqueio ou eliminação de dados desnecessários</li>
                  <li>Portabilidade dos dados</li>
                  <li>Eliminação dos dados tratados com consentimento</li>
                  <li>Informação sobre compartilhamentos com entidades públicas</li>
                </ul>
              </section>

              {/* Segurança */}
              <section className="mb-5">
                <h2 className="h4 mb-3">6. Medidas de segurança</h2>
                <p>
                  Adotamos medidas técnicas e organizacionais para proteger os dados pessoais contra acessos não autorizados, destruição, perda, alteração ou tratamento inadequado.
                </p>
              </section>

              {/* Contato */}
              <section className="mb-5">
                <h2 className="h4 mb-3">7. Como entrar em contato conosco</h2>
                <p>
                  Para dúvidas sobre esta política ou sobre seus dados pessoais, entre em contato com nosso Encarregado de Proteção de Dados:
                </p>
                <div className="contact-box p-3 bg-light rounded">
                  <strong>📧 booklysuporte@gmail.com</strong>
                </div>
              </section>

              {/* Alterações */}
              <section className="mb-4">
                <h2 className="h4 mb-3">8. Alterações nesta política</h2>
                <p>
                  Podemos alterar esta Política de Privacidade a qualquer momento. A versão atualizada será publicada na plataforma com a data da última modificação.
                </p>
              </section>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        .privacy-policy-simple {
          min-height: 100vh;
          background: #f8f9fa;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          line-height: 1.6;
        }


        .privacy-content h2 {
          color: #2c3e50;
          font-weight: 600;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e9ecef;
        }

        .privacy-content h3 {
          color: #495057;
          font-weight: 600;
          margin-top: 1.5rem;
        }

        .privacy-content h4 {
          color: #6c757d;
          font-weight: 600;
        }

        .privacy-content p {
          margin-bottom: 1rem;
          color: #555;
        }

        .privacy-content ul {
          padding-left: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .privacy-content li {
          margin-bottom: 0.5rem;
          color: #555;
        }

        .data-categories {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 6px;
          border-left: 4px solid #6F00FF;
        }

        .data-category ul {
          margin-bottom: 0;
        }

        .data-category li {
          color: #666;
        }

        .contact-box {
          border-left: 4px solid #6F00FF;
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          .privacy-content {
            padding: 1.5rem;
          }
          
          .container {
            padding: 0 15px;
          }
        }

        @media (max-width: 576px) {
          .privacy-content {
            padding: 1rem;
          }
          
          .data-categories {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PrivacyPolicy;
