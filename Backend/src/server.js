const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const livrosRoutes = require('./routes/livrosRoutes');
const professoresRoutes = require('./routes/professoresRoutes');
const alunosRoutes = require('./routes/alunosRoutes');
const autoresRoutes = require('./routes/autoresRoutes');
const editorasRoutes = require('./routes/editorasRoutes');
const usuariosEspeciaisRoutes = require('./routes/usuariosEspeciaisRoutes');
const entradaSaidaRoutes = require('./routes/entradaSaidaRoutes'); // NOVA IMPORTÇÃO

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Garantir que a pasta uploads existe
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log('📁 Pasta uploads criada com sucesso');
}

// Servir arquivos estáticos
app.use('/uploads', express.static(uploadsPath));

// Rotas da API
app.use('/api/livros', livrosRoutes);
app.use('/api/professores', professoresRoutes);
app.use('/api/alunos', alunosRoutes);
app.use('/api/autores', autoresRoutes);
app.use('/api/editoras', editorasRoutes);
app.use('/api/usuarios-especiais', usuariosEspeciaisRoutes);
app.use('/api/entrada-saida', entradaSaidaRoutes); 

app.get('/', (req, res) => {
  res.json({
    message: 'API funcionando!',
    endpoints: {
      livros: '/api/livros',
      professores: '/api/professores',
      alunos: '/api/alunos',
      autores: '/api/autores',
      editoras: '/api/editoras',
      usuariosEspeciais: '/api/usuarios-especiais',
      entradaSaida: '/api/entrada-saida' 
    }
  });
});

app.listen(PORT, () => {
  console.log('🚀 Servidor iniciado com sucesso!');
  console.log(`📍 Rodando em: http://localhost:${PORT}`);
  console.log(`📁 Uploads disponíveis em: http://localhost:${PORT}/uploads/`);
  
  // Verificar arquivos na pasta uploads
  if (fs.existsSync(uploadsPath)) {
    const files = fs.readdirSync(uploadsPath);
    console.log(`📊 Total de imagens salvas: ${files.length}`);
  }
});