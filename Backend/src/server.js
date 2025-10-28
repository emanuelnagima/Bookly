const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');

// Carregar variáveis de ambiente
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Importar as rotas
const livrosRoutes = require('./routes/livrosRoutes');
const professoresRoutes = require('./routes/professoresRoutes');
const alunosRoutes = require('./routes/alunosRoutes');
const autoresRoutes = require('./routes/autoresRoutes');
const editorasRoutes = require('./routes/editorasRoutes');
const usuariosEspeciaisRoutes = require('./routes/usuariosEspeciaisRoutes');
const entradaSaidaRoutes = require('./routes/entradaSaidaRoutes');
const authRoutes = require('./routes/authRoutes');
const emprestimosRoutes = require('./routes/emprestimosRoutes');
const reservasRoutes = require('./routes/reservasRoutes');
const app = express();
const PORT = process.env.PORT || 3000;

// Configurar CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

// Garantir que a pasta uploads existe
const uploadsPath = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log('📁 Pasta uploads criada em:', uploadsPath);
}

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(uploadsPath));
console.log('📁 Arquivos estáticos:', uploadsPath);

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/livros', livrosRoutes);
app.use('/api/professores', professoresRoutes);
app.use('/api/alunos', alunosRoutes);
app.use('/api/autores', autoresRoutes);
app.use('/api/editoras', editorasRoutes);
app.use('/api/usuarios-especiais', usuariosEspeciaisRoutes);
app.use('/api/entrada-saida', entradaSaidaRoutes);
app.use('/api/emprestimos', emprestimosRoutes);
app.use('/api/reservas', reservasRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'API funcionando!',
    endpoints: {
      auth: '/api/auth',
      livros: '/api/livros',
      professores: '/api/professores',
      alunos: '/api/alunos',
      autores: '/api/autores',
      editoras: '/api/editoras',
      usuariosEspeciais: '/api/usuarios-especiais',
      entradaSaida: '/api/entrada-saida',
      emprestimos: '/api/emprestimos',
      reservas: '/api/reservas',
      uploads: '/uploads'
    }
  });
});

app.listen(PORT, () => {
  console.log('🚀 Servidor rodando na porta:', PORT);
  console.log('📁 Pasta uploads:', uploadsPath);
  console.log('🌐 Uploads disponíveis em: http://localhost:' + PORT + '/uploads/');
});