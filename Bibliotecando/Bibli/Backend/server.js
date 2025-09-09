const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const livrosRoutes = require('./routes/livrosRoutes');
const professoresRoutes = require('./routes/professoresRoutes');
const alunosRoutes = require('./routes/alunosRoutes');
const autoresRoutes = require('./routes/autoresRoutes');
const editorasRoutes = require('./routes/editorasRoutes');
const usuariosEspeciaisRoutes = require('./routes/usuariosEspeciaisRoutes');

const app = express();
const PORT = 3000;

// Configuração de sessão (igual do seu professor)
app.use(session({
    secret: "m123456789",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // true em produção com HTTPS
        maxAge: 60 * 60 * 1000 // 1 hora
    }
}));

app.use(cors({
    origin: 'http://localhost:3001', // URL do seu React
    credentials: true
}));
app.use(express.json());

// Garantir que a pasta uploads existe
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log('📁 Pasta uploads criada com sucesso');
}

// Servir arquivos estáticos
app.use('/uploads', express.static(uploadsPath));

// Middleware de autenticação (igual do seu professor)
function autenticar(requisicao, resposta, next) {
    if (requisicao.session.autenticado === true) {
        next();
    } else {
        resposta.status(401).json({ 
            erro: 'Não autenticado', 
            redirect: '/login' 
        });
    }
}

// Rotas públicas
app.post('/api/login', (requisicao, resposta) => {
    const { email, password } = requisicao.body;
    
    // Suas credenciais atuais
    if (email === 'adm@gmail.com' && password === 'L!vr0$V00@2025') {
        requisicao.session.autenticado = true;
        requisicao.session.usuario = email;
        resposta.json({ sucesso: true });
    } else {
        resposta.status(401).json({ sucesso: false, mensagem: 'Credenciais inválidas' });
    }
});

app.post('/api/logout', (requisicao, resposta) => {
    requisicao.session.destroy((erro) => {
        if (erro) {
            return resposta.status(500).json({ erro: 'Erro ao fazer logout' });
        }
        resposta.json({ sucesso: true });
    });
});

app.get('/api/verificar-sessao', (requisicao, resposta) => {
    resposta.json({ 
        autenticado: requisicao.session.autenticado || false,
        usuario: requisicao.session.usuario || null
    });
});

// Rotas da API protegidas (aplicando o middleware autenticar)
app.use('/api/livros', autenticar, livrosRoutes);
app.use('/api/professores', autenticar, professoresRoutes);
app.use('/api/alunos', autenticar, alunosRoutes);
app.use('/api/autores', autenticar, autoresRoutes);
app.use('/api/editoras', autenticar, editorasRoutes);
app.use('/api/usuarios-especiais', autenticar, usuariosEspeciaisRoutes);

// Rota pública para verificar se API está funcionando
app.get('/', (req, res) => {
  res.json({
    message: 'API funcionando!',
    endpoints: {
      login: '/api/login',
      logout: '/api/logout',
      verificar: '/api/verificar-sessao',
      livros: '/api/livros',
      professores: '/api/professores',
      alunos: '/api/alunos',
      autores: '/api/autores',
      editoras: '/api/editoras',
      usuariosEspeciais: '/api/usuarios-especiais'
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