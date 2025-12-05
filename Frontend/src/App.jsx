import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Novos imports do sistema de autenticação
import AuthProvider from './components/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';


// Layout
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

// Páginas principais
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login'; 
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import Estatisticas from './pages/Estatisticas';

// Listagens
import Livros from './pages/Livros';
import Professores from './pages/Professores';
import Alunos from './pages/Alunos';
import Autores from './pages/Autores';
import Editoras from './pages/Editoras';
import UsuariosEspeciais from './pages/UsuariosEspeciais';
import Entrada from './pages/Entrada';
import Saida from './pages/Saida';
import RelatoriosGerais from './pages/RelatoriosGerais';
import Emprestimos from './pages/Emprestimos';
import Reservas from './pages/Reservas';

// Cadastros
import CadastroLivros from './pages/cadastros/CadastroLivros.jsx';
import CadastroProfessores from './pages/cadastros/CadastroProfessores';
import CadastroAlunos from './pages/cadastros/CadastroAlunos';
import CadastroEditoras from './pages/cadastros/CadastroEditoras';
import CadastroAutores from './pages/cadastros/CadastroAutores';
import CadastroUsuariosEspeciais from './pages/cadastros/CadastroUsuariosEspeciais';



function App() {
  return (
    <AuthProvider> {/* ENVOLVE TUDO COM AUTH PROVIDER */}
      <Router>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />

          {/* Rotas protegidas - ESTRUTURA COMPLETAMENTE MODIFICADA */}
          <Route
            path="/*"
            element={
              <ProtectedRoute> {/* SEM ROLES - APENAS VERIFICA SE ESTÁ LOGADO */}
                <div className="app-container">
                  <Sidebar />
                  <div className="content">
                    <Routes>
                      {/* Páginas principais - acesso livre para todos logados */}
                      <Route path="/" element={<Home />} />
                      <Route path="/sobre" element={<About />} />

                      {/* Listagens - Acesso admin e bibliotecario */}
                      <Route path="/livros" element={
                        <ProtectedRoute roles={['admin', 'bibliotecario']}>
                          <Livros />
                        </ProtectedRoute>
                      } />
                      <Route path="/professores" element={
                        <ProtectedRoute roles={['admin', 'bibliotecario']}>
                          <Professores />
                        </ProtectedRoute>
                      } />
                      <Route path="/alunos" element={
                        <ProtectedRoute roles={['admin', 'bibliotecario']}>
                          <Alunos />
                        </ProtectedRoute>
                      } />
                      <Route path="/autores" element={
                        <ProtectedRoute roles={['admin', 'bibliotecario']}>
                          <Autores />
                        </ProtectedRoute>
                      } />
                      <Route path="/editoras" element={
                        <ProtectedRoute roles={['admin', 'bibliotecario']}>
                          <Editoras />
                        </ProtectedRoute>
                      } />
                      <Route path="/usuarios-especiais" element={
                        <ProtectedRoute roles={['admin', 'bibliotecario']}>
                          <UsuariosEspeciais />
                        </ProtectedRoute>
                      } />

                      {/* Movimentações - Acesso admin e bibliotecario */}
                      <Route path="/entrada" element={
                        <ProtectedRoute roles={['admin', 'bibliotecario']}>
                          <Entrada />
                        </ProtectedRoute>
                      } />
                      <Route path="/saida" element={
                        <ProtectedRoute roles={['admin', 'bibliotecario']}>
                          <Saida />
                        </ProtectedRoute>
                      } />
                      <Route path="/emprestimos" element={
                        <ProtectedRoute roles={['admin', 'bibliotecario']}>
                          <Emprestimos />
                        </ProtectedRoute>
                      } />
                      <Route path="/reservas" element={
                        <ProtectedRoute roles={['admin', 'bibliotecario']}>
                          <Reservas />
                        </ProtectedRoute>
                      } />
                      <Route path="/relatorios" element={
                        <ProtectedRoute roles={['admin', 'bibliotecario']}>
                          <RelatoriosGerais />
                        </ProtectedRoute>
                      } />
                      {/* Cadastros - Apenas admin */}
                      <Route path="/cadastros/livros" element={
                        <ProtectedRoute roles={['admin']}>
                          <CadastroLivros />
                        </ProtectedRoute>
                      } />
                      <Route path="/cadastros/livros/:id" element={
                        <ProtectedRoute roles={['admin']}>
                          <CadastroLivros />
                        </ProtectedRoute>
                      } />
                      <Route path="/cadastros/professores" element={
                        <ProtectedRoute roles={['admin']}>
                          <CadastroProfessores />
                        </ProtectedRoute>
                      } />
                      <Route path="/cadastros/professores/:id" element={
                        <ProtectedRoute roles={['admin']}>
                          <CadastroProfessores />
                        </ProtectedRoute>
                      } />
                      <Route path="/cadastros/alunos" element={
                        <ProtectedRoute roles={['admin']}>
                          <CadastroAlunos />
                        </ProtectedRoute>
                      } />
                      <Route path="/cadastros/alunos/:id" element={
                        <ProtectedRoute roles={['admin']}>
                          <CadastroAlunos />
                        </ProtectedRoute>
                      } />
                      <Route path="/cadastros/editoras" element={
                        <ProtectedRoute roles={['admin']}>
                          <CadastroEditoras />
                        </ProtectedRoute>
                      } />
                      <Route path="/cadastros/editoras/:id" element={
                        <ProtectedRoute roles={['admin']}>
                          <CadastroEditoras />
                        </ProtectedRoute>
                      } />
                      <Route path="/cadastros/autores" element={
                        <ProtectedRoute roles={['admin']}>
                          <CadastroAutores />
                        </ProtectedRoute>
                      } />
                      <Route path="/cadastros/autores/:id" element={
                        <ProtectedRoute roles={['admin']}>
                          <CadastroAutores />
                        </ProtectedRoute>
                      } />
                      <Route path="/cadastros/usuarios-especiais" element={
                        <ProtectedRoute roles={['admin']}>
                          <CadastroUsuariosEspeciais />
                        </ProtectedRoute>
                      } />
                      <Route path="/cadastros/usuarios-especiais/:id" element={
                        <ProtectedRoute roles={['admin', 'bibliotecario']}>
                          <CadastroUsuariosEspeciais />
                        </ProtectedRoute>
                      } />
                      <Route path="/estatisticas" element={
                        <ProtectedRoute roles={['admin', 'bibliotecario']}>
                          <Estatisticas />
                        </ProtectedRoute>
                      } />

                      
                      {/* Redireciona rotas desconhecidas para home */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>

                    <Footer />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;