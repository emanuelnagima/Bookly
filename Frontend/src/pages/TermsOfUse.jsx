import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from "react";

const TermsOfUse = () => {
  useEffect(() => {
    document.title = "Termos de Uso - Bookly";
  }, []);
  
  return (
    <>
    <div className="page-container">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-9 col-md-11">

            {/* Cabeçalho */}
            <div className="text-center mb-5">
              <h1 className="display-5 fw-bold mb-3 gradient-text">Termos de Uso </h1>
              <p className="lead text-muted mb-2">
                Bookly - Sistema de Gestão Bibliotecária
              </p>
            </div>

            {/* Conteúdo Principal */}
            <div className="page-content">

              {/* Seção 1 */}
              <div className="content-item mb-4">
                <div className="item-header">
                  <h3 className="h4 mb-0">
                    <span className="item-number">01</span>
                    Introdução
                  </h3>
                </div>
                <div className="item-body">
                  <div className="body-content">
                    <p className="mb-0">Bem-vindo ao Bookly. Ao utilizar este sistema, você concorda com os termos e condições descritos aqui.</p>
                  </div>
                </div>
              </div>

              {/* Seção 2 */}
              <div className="content-item mb-4">
                <div className="item-header">
                  <h3 className="h4 mb-0">
                    <span className="item-number">02</span>
                    Quem pode usar o sistema
                  </h3>
                </div>
                <div className="item-body">
                  <div className="body-content">
                    <p className="mb-0">O acesso é restrito a bibliotecários, administradores e usuários autorizados. Menores de idade devem ter consentimento de um responsável.</p>
                  </div>
                </div>
              </div>

              {/* Seção 3 */}
              <div className="content-item mb-4">
                <div className="item-header">
                  <h3 className="h4 mb-0">
                    <span className="item-number">03</span>
                    Regras de uso
                  </h3>
                </div>
                <div className="item-body">
                  <div className="body-content">
                    <ul className="mb-0">
                      <li>Mantenha seu login e senha seguros e não os compartilhe</li>
                      <li>Use o sistema apenas para fins bibliotecários autorizados</li>
                      <li>Não tente acessar ou alterar dados de outros usuários sem permissão</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Seção 4 */}
              <div className="content-item mb-4">
                <div className="item-header">
                  <h3 className="h4 mb-0">
                    <span className="item-number">04</span>
                    Responsabilidades do usuário
                  </h3>
                </div>
                <div className="item-body">
                  <div className="body-content">
                    <ul className="mb-0">
                      <li>Manter informações corretas e atualizadas</li>
                      <li>Comunicar problemas ou irregularidades</li>
                      <li>Seguir regras da plataforma e da biblioteca</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Seção 5 */}
              <div className="content-item mb-4">
                <div className="item-header">
                  <h3 className="h4 mb-0">
                    <span className="item-number">05</span>
                    Responsabilidades da plataforma
                  </h3>
                </div>
                <div className="item-body">
                  <div className="body-content">
                    <ul className="mb-0">
                      <li>Garantir acesso seguro ao sistema</li>
                      <li>Manutenção preventiva</li>
                      <li>Notificar alterações importantes aos usuários</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Seção 6 */}
              <div className="content-item mb-4">
                <div className="item-header">
                  <h3 className="h4 mb-0">
                    <span className="item-number">06</span>
                    Limitação de responsabilidade
                  </h3>
                </div>
                <div className="item-body">
                  <div className="body-content">
                    <p className="mb-0">A plataforma não se responsabiliza por perdas de dados causadas por mau uso, falhas externas ou ações não autorizadas.</p>
                  </div>
                </div>
              </div>

              {/* Seção 7 */}
              <div className="content-item mb-4">
                <div className="item-header">
                  <h3 className="h4 mb-0">
                    <span className="item-number">07</span>
                    Alterações nos termos
                  </h3>
                </div>
                <div className="item-body">
                  <div className="body-content">
                    <p className="mb-0">Os termos podem ser atualizados a qualquer momento, e a versão vigente será publicada com a data da última modificação.</p>
                  </div>
                </div>
              </div>

              {/* Seção 8 */}
              <div className="content-item">
                <div className="item-header">
                  <h3 className="h4 mb-0">
                    <span className="item-number">08</span>
                    Contato
                  </h3>
                </div>
                <div className="item-body">
                  <div className="body-content">
                    <p className="mb-3">Para dúvidas, entre em contato com nosso suporte:</p>
                    <div className="contact-box">
                      <div className="d-flex align-items-center">
                        <strong>booklysuporte@gmail.com</strong>
                      </div>
                    </div>
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

        .last-update-badge {
          display: inline-block;
          background: linear-gradient(135deg, #6F00FF 0%, #8A2BE2 100%);
          color: white;
          padding: 0.5rem 1.5rem;
          border-radius: 25px;
          font-size: 0.9rem;
          font-weight: 500;
          margin-top: 1rem;
        }

        .content-item {
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
    </>
  );
};

export default TermsOfUse;