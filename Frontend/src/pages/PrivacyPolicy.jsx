import 'bootstrap/dist/css/bootstrap.min.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-page">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-9 col-md-11">

            {/* Cabeçalho */}
            <div className="text-center mb-5">
              <div className="privacy-icon mb-4">
                <svg width="70" height="70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="url(#gradient)" strokeWidth="2"/>
                  <path d="M16 8H8V16H16V8Z" stroke="url(#gradient)" strokeWidth="2"/>
                  <path d="M12 12V15" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6F00FF" />
                      <stop offset="100%" stopColor="#8A2BE2" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h1 className="display-5 fw-bold mb-3 gradient-text">Política de Privacidade</h1>
              <div className="last-update-badge">
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </div>
            </div>

            {/* Introdução */}
            <div className="intro-section mb-5">
              <p className="fw-bold mb-3">
                Esta plataforma é mantida e operada por Bookly.
              </p>
              <p className="mb-3">
                Nós coletamos e utilizamos dados pessoais de usuários da nossa plataforma de 
                gestão bibliotecária. Agimos na qualidade de controlador desses dados, em conformidade 
                com a Lei Federal n. 13.709/2018 (Lei Geral de Proteção de Dados Pessoais - LGPD).
              </p>
              <p className="mb-0">
                Nossa política de privacidade contém informações importantes sobre:
              </p>
              <div className="feature-list mt-3">
                <div className="row">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-2">
                      <span className="check-icon">✓</span>
                      <span>Quem deve utilizar a plataforma</span>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <span className="check-icon">✓</span>
                      <span>Quais dados coletamos e com qual finalidade</span>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <span className="check-icon">✓</span>
                      <span>Seus direitos em relação aos dados pessoais</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-2">
                      <span className="check-icon">✓</span>
                      <span>Como entrar em contato conosco</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <span className="check-icon">✓</span>
                      <span>Medidas especiais para proteção de dados de menores</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="privacy-content">
              
              {/* Seção 1 */}
              <section className="privacy-section mb-5">
                <div className="section-header">
                  <span className="section-number">01</span>
                  <h2>Quem deve utilizar nossa plataforma</h2>
                </div>
                <div className="section-content">
                  <p>
                    Nossa plataforma é destinada exclusivamente a bibliotecários, administradores e 
                    usuários autorizados pelas instituições. O acesso é restrito mediante credenciais específicas.
                  </p>
                </div>
              </section>

              {/* Seção 2 */}
              <section className="privacy-section mb-5">
                <div className="section-header">
                  <span className="section-number">02</span>
                  <h2>Dados que coletamos e motivos da coleta</h2>
                </div>
                <div className="section-content">
                  <p>
                    Coletamos dados pessoais para permitir a gestão adequada do acervo, o controle de 
                    empréstimos, devoluções, reservas e relatórios estatísticos.
                  </p>

                  <h3 className="mt-4 mb-3">Dados pessoais fornecidos expressamente pelo usuário</h3>
                  <p>Os seguintes dados são coletados diretamente do usuário ou de seus representantes legais:</p>
                  
                  <div className="data-categories">
                    <div className="data-category mb-4">
                      <h4 className="category-title">Cadastro de Usuários</h4>
                      <ul>
                        <li>Nome completo</li>
                        <li>CPF, CNPJ ou matrícula escolar</li>
                        <li>Endereço completo</li>
                        <li>Telefone e e-mail para contato</li>
                        <li>Dados de responsáveis, quando o usuário for menor de idade</li>
                      </ul>
                    </div>

                    <div className="data-category mb-4">
                      <h4 className="category-title">Gestão do Acervo</h4>
                      <ul>
                        <li>Cadastro de autores e editoras</li>
                        <li>Registro de livros e exemplares</li>
                        <li>Informações bibliográficas para controle do acervo</li>
                      </ul>
                    </div>

                    <div className="data-category">
                      <h4 className="category-title">Operações do Sistema</h4>
                      <ul>
                        <li>Histórico de empréstimos e devoluções</li>
                        <li>Controle de reservas</li>
                        <li>Relatórios internos para gestão da biblioteca</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Seção 3 */}
              <section className="privacy-section mb-5">
                <div className="section-header">
                  <span className="section-number">03</span>
                  <h2>Finalidade do tratamento dos dados pessoais</h2>
                </div>
                <div className="section-content">
                  <p>
                    Os dados pessoais coletados são utilizados para:
                  </p>
                  <div className="purpose-list">
                    <div className="row">
                      <div className="col-md-6">
                        <ul>
                          <li>Garantir acesso justo ao acervo bibliográfico</li>
                          <li>Gerenciar empréstimos, devoluções e reservas</li>
                        </ul>
                      </div>
                      <div className="col-md-6">
                        <ul>
                          <li>Emitir relatórios internos para melhoria do serviço</li>
                          <li>Proteger dados de menores e usuários vulneráveis</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Seção 4 */}
              <section className="privacy-section mb-5">
                <div className="section-header">
                  <span className="section-number">04</span>
                  <h2>Compartilhamento de dados pessoais</h2>
                </div>
                <div className="section-content">
                  <div className="no-sharing-alert">
                    <p className="mb-0">
                      <strong>Não compartilhamos dados com terceiros.</strong> Todas as informações permanecem no ambiente institucional, acessível apenas a bibliotecários e administradores autorizados.
                    </p>
                  </div>
                </div>
              </section>

              {/* Seção 5 */}
              <section className="privacy-section mb-5">
                <div className="section-header">
                  <span className="section-number">05</span>
                  <h2>Direitos do usuário</h2>
                </div>
                <div className="section-content">
                  <p>
                    O usuário possui os direitos previstos pela LGPD, incluindo:
                  </p>
                  <div className="rights-list">
                    <div className="row">
                      <div className="col-md-6">
                        <ul>
                          <li>Confirmação da existência de tratamento</li>
                          <li>Acesso e correção de dados pessoais</li>
                          <li>Anonimização, bloqueio ou eliminação de dados desnecessários</li>
                        </ul>
                      </div>
                      <div className="col-md-6">
                        <ul>
                          <li>Portabilidade dos dados</li>
                          <li>Eliminação dos dados tratados com consentimento</li>
                          <li>Informação sobre compartilhamentos com entidades públicas</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Seção 6 */}
              <section className="privacy-section mb-5">
                <div className="section-header">
                  <span className="section-number">06</span>
                  <h2>Medidas de segurança</h2>
                </div>
                <div className="section-content">
                  <p>
                    Adotamos medidas técnicas e organizacionais para proteger os dados pessoais contra acessos não autorizados, destruição, perda, alteração ou tratamento inadequado.
                  </p>
                </div>
              </section>

              {/* Seção 7 */}
              <section className="privacy-section mb-5">
                <div className="section-header">
                  <span className="section-number">07</span>
                  <h2>Como entrar em contato conosco</h2>
                </div>
                <div className="section-content">
                  <p>
                    Para dúvidas sobre esta política ou sobre seus dados pessoais, entre em contato com nosso e-mail:
                  </p>
                  <div className="contact-box">
                    <div className="d-flex align-items-center">
                      <span className="email-icon">✉️</span>
                      <strong>booklysuporte@gmail.com</strong>
                    </div>
                  </div>
                </div>
              </section>

              {/* Seção 8 */}
              <section className="privacy-section">
                <div className="section-header">
                  <span className="section-number">08</span>
                  <h2>Alterações nesta política</h2>
                </div>
                <div className="section-content">
                  <p>
                    Podemos alterar esta Política de Privacidade a qualquer momento. A versão atualizada será publicada na plataforma com a data da última modificação.
                  </p>
                </div>
              </section>

            </div>

          </div>
        </div>
      </div>

      <style>{`
        .privacy-policy-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          line-height: 1.6;
        }

        .gradient-text {
          background: linear-gradient(135deg, #6F00FF 0%, #8A2BE2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .last-update-badge {
          display: inline-block;
          background: linear-gradient(135deg, #6F00FF 0%, #8A2BE2 100%);
          color: white;
          padding: 0.5rem 1.5rem;
          border-radius: 25px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .intro-section {
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          padding: 2rem;
          border-radius: 12px;
          border-left: 4px solid #6F00FF;
        }

        .check-icon {
          display: inline-block;
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #6F00FF 0%, #8A2BE2 100%);
          color: white;
          border-radius: 50%;
          text-align: center;
          line-height: 24px;
          margin-right: 0.75rem;
          font-size: 0.8rem;
        }

        .privacy-section {
          border-bottom: 1px solid #e9ecef;
          padding-bottom: 2rem;
          margin-bottom: 2rem;
        }

        .privacy-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }

        .section-header {
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .section-number {
          display: inline-block;
          background: linear-gradient(135deg, #6F00FF 0%, #8A2BE2 100%);
          color: white;
          width: 50px;
          height: 50px;
          border-radius: 12px;
          text-align: center;
          line-height: 50px;
          font-weight: bold;
          margin-right: 1.5rem;
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        .section-header h2 {
          color: #2c3e50;
          font-weight: 600;
          margin: 0;
        }

        .section-content {
          margin-left: 4rem;
        }

        .data-categories {
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid #e9ecef;
        }

        .category-title {
          color: #6F00FF;
          font-weight: 600;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e9ecef;
        }

        .data-category ul {
          margin-bottom: 0;
        }

        

        .data-category li:before {
          content: "•";
          color: #6F00FF;
          font-weight: bold;
          position: absolute;
          left: 0;
        }

        .no-sharing-alert {
          background: linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%);
          padding: 1.5rem;
          border-radius: 8px;
          border-left: 4px solid #2196F3;
        }

        .contact-box {
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          padding: 1.5rem;
          border-radius: 8px;
          border-left: 4px solid #6F00FF;
          display: inline-block;
        }

        .email-icon {
          font-size: 1.5rem;
          margin-right: 1rem;
        }

        @media (max-width: 768px) {
          .section-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .section-number {
            margin-bottom: 1rem;
            margin-right: 0;
          }
          
          .section-content {
            margin-left: 0;
          }
          
          .intro-section {
            padding: 1.5rem;
          }
          
          .data-categories {
            padding: 1.5rem;
          }
        }

        @media (max-width: 576px) {
          .feature-list .col-md-6 {
            width: 100%;
          }
          
          .purpose-list .col-md-6,
          .rights-list .col-md-6 {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default PrivacyPolicy;