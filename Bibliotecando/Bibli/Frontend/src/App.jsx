import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// Layout
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'

// Páginas principais
import Home from './pages/Home'
import About from './pages/About'

// Listagens
import Livros from './pages/Livros'
import Professores from './pages/Professores'
import Alunos from './pages/Alunos'
import Autores from './pages/Autores'
import Editoras from './pages/Editoras';

// Detalhes
import LivroDetalhe from './pages/LivroDetalhe'
import ProfessorDetalhe from './pages/ProfessorDetalhe'
import AlunoDetalhe from './pages/AlunoDetalhe'
import AutorDetalhe from './pages/AutorDetalhe'
import EditoraDetalhe from './pages/EditoraDetalhe';

// Cadastros
import Cadastros from './pages/cadastros/Cadastros.jsx'
import CadastroLivros from './pages/cadastros/CadastroLivros.jsx'
import CadastroProfessores from './pages/cadastros/CadastroProfessores'
import CadastroAlunos from './pages/cadastros/CadastroAlunos'
import CadastroEditoras from './pages/cadastros/CadastroEditoras';

function App() {
  return (
    <Router>
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
<Route path="/editoras" element={<Editoras />} />  {/* Rota principal */}

            {/* Detalhes */}
            <Route path="/livro/:id" element={<LivroDetalhe />} />
            <Route path="/professor/:id" element={<ProfessorDetalhe />} />
            <Route path="/aluno/:id" element={<AlunoDetalhe />} />
            <Route path="/autor/:id" element={<AutorDetalhe />} />
            <Route path="/editora/:id" element={<EditoraDetalhe />} /> {/* Adicionado */}

            {/* Cadastros */}
            <Route path="/cadastros" element={<Cadastros />} />
            <Route path="/cadastros/livros" element={<CadastroLivros />} />
            <Route path="/cadastros/professores" element={<CadastroProfessores />} />
            <Route path="/cadastros/alunos" element={<CadastroAlunos />} />
<Route path="/cadastros/editoras" element={<CadastroEditoras />} />  {/* Rota de cadastro específica */}
          </Routes>

          <Footer />
        </div>
      </div>
    </Router>
  )
}

export default App