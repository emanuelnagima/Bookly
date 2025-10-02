import 'bootstrap/dist/css/bootstrap.min.css';

const PrivacyPolicy = () => {
  return (
    <div className="page-container">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-9 col-md-11">

            {/* Cabeçalho */}
            <div className="text-center mb-5">
              <div className="page-icon mb-4">
                <span className="icon-wrapper">🔒</span>
              </div>
              <h1 className="display-5 fw-bold mb-3 gradient-text">Política de Privacidade</h1>
              <p className="lead text-muted mb-2">
                Bookly - Sistema de Gestão Bibliotecária
              </p>
              <div className="last-update-badge">
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </div>
            </div>

            {/* Introdução */}
            <div className="intro-section mb-5">
              <div className="item-body">
                <div className="body-content">
                  <p className="fw-bold mb-3">
                    Esta plataforma é mantida e operada por Bookly.
                  </p>
                  <p className="mb-3">
                    Nós coletamos e utilizamos dados pessoais de usuários da nossa plataforma de 
                    gestão bibliotecária. Agimos na qualidade de controlador desses dados, em conformidade 
                    com a Lei Federal n. 13.709/2018 (Lei Geral de Proteção de Dados Pessoais - LGPD).
                  </p>
                  <p className="mb-3">
                    Nossa política de privacidade contém informações importantes sobre:
                  </p>
                  <div className="feature-list">
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
              </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="page-content">
              
              {/* Seção 1 */}
              <div className="content-item mb-4">
                <div className="item-header">
                  <h3 className="h4 mb-0">
                    <span className="item-number">01</span>
                    Quem deve utilizar nossa plataforma
                  </h3>
                </div>
                <div className="item-body">
                  <div className="body-content">
                    <p className="mb-0">
                      Nossa plataforma é destinada exclusivamente a bibliotecários, administradores e 
                      usuários autorizados pelas instituições. O acesso é restrito mediante credenciais específicas.
                    </p>
                  </div>
                </div>
              </div>

              {/* Seção 2 */}
              <div className="content-item mb-4">
                <div className="item-header">
                  <h3 className="h4 mb-0">
                    <span className="item-number">02</span>
                    Dados que coletamos e motivos da coleta
                  </h3>
                </div>
                <div className="item-body">
                  <div className="body-content">
                    <p className="mb-3">
                      Coletamos dados pessoais para permitir a gestão adequada do acervo, o controle de 
                      empréstimos, devoluções, reservas e relatórios estatísticos.
                    </p>

                    <h4 className="mt-4 mb-3">Dados pessoais fornecidos expressamente pelo usuário</h4>
                    <p className="mb-3">Os seguintes dados são coletados diretamente do usuário ou de seus representantes legais:</p>
                    
                    <div className="data-categories">
                      <div className="mb-4">
                        <h5 className="category-title">Cadastro de Usuários</h5>
                        <ul className="mb-0">
                          <li>Nome completo</li>
                          <li>CPF, CNPJ ou matrícula</li>
                          <li>Endereço completo</li>
                          <li>Telefone e e-mail para contato</li>
                        </ul>
                      </div>

                      <div className="mb-4">
                        <h5 className="category-title">Gestão do Acervo</h5>
                        <ul className="mb-0">
                          <li>Cadastro de autores e editoras</li>
                          <li>Registro de livros e exemplares</li>
                          <li>Informações bibliográficas para controle do acervo</li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="category-title">Operações do Sistema</h5>
                        <ul className="mb-0">
                          <li>Histórico de empréstimos e devoluções</li>
                          <li>Controle de reservas</li>
                          <li>Relatórios internos para gestão da biblioteca</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção 3 */}
              <div className="content-item mb-4">
                <div className="item-header">
                  <h3 className="h4 mb-0">
                    <span className="item-number">03</span>
                    Finalidade do tratamento dos dados pessoais
                  </h3>
                </div>
                <div className="item-body">
                  <div className="body-content">
                    <p className="mb-3">
                      Os dados pessoais coletados são utilizados para:
                    </p>
                    <div className="purpose-list">
                      <div className="row">
                        <div className="col-md-6">
                          <ul className="mb-0">
                            <li>Garantir acesso justo ao acervo bibliográfico</li>
                            <li>Gerenciar empréstimos, devoluções e reservas</li>
                          </ul>
                        </div>
                        <div className="col-md-6">
                          <ul className="mb-0">
                            <li>Emitir relatórios internos para melhoria do serviço</li>
                            <li>Proteger dados e usuários vulneráveis</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção 4 */}
              <div className="content-item mb-4">
                <div className="item-header">
                  <h3 className="h4 mb-0">
                    <span className="item-number">04</span>
                    Compartilhamento de dados pessoais
                  </h3>
                </div>
                <div className="item-body">
                  <div className="body-content">
                    <div className="no-sharing-alert">
                      <p className="mb-0">
                        <strong>Não compartilhamos dados com terceiros.</strong> Todas as informações permanecem no ambiente institucional, acessível apenas a bibliotecários e administradores autorizados.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção 5 */}
              <div className="content-item mb-4">
                <div className="item-header">
                  <h3 className="h4 mb-0">
                    <span className="item-number">05</span>
                    Direitos do usuário
                  </h3>
                </div>
                <div className="item-body">
                  <div className="body-content">
                    <p className="mb-3">
                      O usuário possui os direitos previstos pela LGPD, incluindo:
                    </p>
                    <div className="rights-list">
                      <div className="row">
                        <div className="col-md-6">
                          <ul className="mb-0">
                            <li>Confirmação da existência de tratamento</li>
                            <li>Acesso e correção de dados pessoais</li>
                            <li>Anonimização, bloqueio ou eliminação de dados desnecessários</li>
                          </ul>
                        </div>
                        <div className="col-md-6">
                          <ul className="mb-0">
                            <li>Portabilidade dos dados</li>
                            <li>Eliminação dos dados tratados com consentimento</li>
                            <li>Informação sobre compartilhamentos com entidades públicas</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção 6 */}
              <div className="content-item mb-4">
                <div className="item-header">
                  <h3 className="h4 mb-0">
                    <span className="item-number">06</span>
                    Medidas de segurança
                  </h3>
                </div>
                <div className="item-body">
                  <div className="body-content">
                    <p className="mb-0">
                      Adotamos medidas básicas e organizacionais para proteger os dados pessoais contra acessos não autorizados.
                    </p>
                  </div>
                </div>
              </div>

              {/* Seção 7 */}
              <div className="content-item mb-4">
                <div className="item-header">
                  <h3 className="h4 mb-0">
                    <span className="item-number">07</span>
                    Como entrar em contato conosco
                  </h3>
                </div>
                <div className="item-body">
                  <div className="body-content">
                    <p className="mb-3">
                      Para dúvidas sobre esta política ou sobre seus dados pessoais, entre em contato com nosso e-mail:
                    </p>
                    <div className="contact-box">
                      <div className="d-flex align-items-center">
                        <strong>booklysuporte@gmail.com</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção 8 */}
              <div className="content-item">
                <div className="item-header">
                  <h3 className="h4 mb-0">
                    <span className="item-number">08</span>
                    Alterações nesta política
                  </h3>
                </div>
                <div className="item-body">
                  <div className="body-content">
                    <p className="mb-0">
                      Podemos alterar esta Política de Privacidade a qualquer momento. A versão atualizada será sempre publicada com a data da última modificação.
                    </p>
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

        .last-update-badge {
          display: inline-block;
          background: linear-gradient(135deg, #6F00FF 0%, #8A2BE2 100%);
          color: white;
          padding: 0.5rem 1.5rem;
          border-radius: 25px;
          font-size: 0.9rem;
          font-weight: 500;
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

        .data-categories {
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }

        .category-title {
          color: #6F00FF;
          font-weight: 600;
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e9ecef;
        }

        .no-sharing-alert {
          background: linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%);
          padding: 1rem;
          border-radius: 8px;
          border-left: 4px solid #2196F3;
        }

        .contact-box {
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          padding: 1rem;
          border-radius: 8px;
          border-left: 4px solid #6F00FF;
          display: inline-block;
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

export default PrivacyPolicy;