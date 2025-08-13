import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Livros from './pages/Livros'
import Sidebar from './components/Sidebar'
import LivroDetalhe from './pages/LivroDetalhe'
import Professores from './pages/Professores'
import ProfessorDetalhe from './pages/ProfessorDetalhe'
import Alunos from './pages/Alunos'
import AlunoDetalhe from './pages/AlunoDetalhe'
import Cadastros from './pages/cadastros/Cadastro'
import CadastroLivros from './pages/cadastros/CadastroLivros'
import CadastroProfessores from './pages/cadastros/CadastroProfessores'
import CadastroAlunos from './pages/cadastros/CadastroAlunos'
import Footer from './components/Footer'
import About from './pages/About'  // IMPORTA AQUI

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/sobre' element={<About />} />  {/* ROTA DA PAGINA SOBRE */}
            <Route path='/livros' element={<Livros />} />
            <Route path='/livro/:id' element={<LivroDetalhe />} />
            <Route path='/professores' element={<Professores />} />
            <Route path='/professor/:id' element={<ProfessorDetalhe />} />
            <Route path='/alunos' element={<Alunos />} />
            <Route path='/aluno/:id' element={<AlunoDetalhe />} />
            <Route path='/cadastros' element={<Cadastros />} />
            <Route path='/cadastros/livros' element={<CadastroLivros />} />
            <Route path='/cadastros/professores' element={<CadastroProfessores />} />
            <Route path='/cadastros/alunos' element={<CadastroAlunos />} />
          </Routes>
          <Footer />
        </div>
      </div>
    </Router>
  )
}

export default App