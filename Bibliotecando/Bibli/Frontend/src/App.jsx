import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Layout
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

// Páginas principais
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';

// Listagens
import Livros from './pages/Livros';
import Professores from './pages/Professores';
import Alunos from './pages/Alunos';
import Autores from './pages/Autores';
import Editoras from './pages/Editoras';
import UsuariosEspeciais from './pages/UsuariosEspeciais';

// Cadastros
import CadastroLivros from './pages/cadastros/CadastroLivros.jsx';
import CadastroProfessores from './pages/cadastros/CadastroProfessores';
import CadastroAlunos from './pages/cadastros/CadastroAlunos';
import CadastroEditoras from './pages/cadastros/CadastroEditoras';
import CadastroAutores from './pages/cadastros/CadastroAutores';
import CadastroUsuariosEspeciais from './pages/cadastros/CadastroUsuariosEspeciais';

// Componente de proteção de rotas
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota pública de login */}
        <Route path="/login" element={<Login />} />

        {/* Rotas protegidas */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="app-container">
                <Sidebar />
                <div className="content">
                  <Routes>
                    {/* Páginas principais */}
                    <Route path="/" element={<Home />} />
                    <Route path="/sobre" element={<About />} />

                    {/* Listagens */}
                    <Route path="/livros" element={<Livros />} />
                    <Route path="/professores" element={<Professores />} />
                    <Route path="/alunos" element={<Alunos />} />
                    <Route path="/autores" element={<Autores />} />
                    <Route path="/editoras" element={<Editoras />} />
                    <Route path="/usuarios-especiais" element={<UsuariosEspeciais />} />

                    {/* Formulários de cadastro */}
                    <Route path="/cadastros/livros" element={<CadastroLivros />} />
                    <Route path="/cadastros/livros/:id" element={<CadastroLivros />} />
                    <Route path="/cadastros/professores" element={<CadastroProfessores />} />
                    <Route path="/cadastros/professores/:id" element={<CadastroProfessores />} />
                    <Route path="/cadastros/alunos" element={<CadastroAlunos />} />
                    <Route path="/cadastros/alunos/:id" element={<CadastroAlunos />} />
                    <Route path="/cadastros/editoras" element={<CadastroEditoras />} />
                    <Route path="/cadastros/editoras/:id" element={<CadastroEditoras />} />
                    <Route path="/cadastros/autores" element={<CadastroAutores />} />
                    <Route path="/cadastros/autores/:id" element={<CadastroAutores />} />
                    <Route path="/cadastros/usuarios-especiais" element={<CadastroUsuariosEspeciais />} />
                    <Route path="/cadastros/usuarios-especiais/:id" element={<CadastroUsuariosEspeciais />} />

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
  );
}

export default App;
