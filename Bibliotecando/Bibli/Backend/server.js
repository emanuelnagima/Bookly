const express = require('express');
const cors = require('cors');
const livrosRoutes = require('./routes/livrosRoutes');
const professoresRoutes = require('./routes/professoresRoutes');
const alunosRoutes = require('./routes/alunosRoutes'); // Nova linha

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/livros', livrosRoutes);
app.use('/api/professores', professoresRoutes);
app.use('/api/alunos', alunosRoutes); // Nova linha

app.get('/', (req, res) => {
    res.json({
        message: 'API funcionando!',
        endpoints: {
            livros: '/api/livros',
            professores: '/api/professores',
            alunos: '/api/alunos' // Nova linha
        }
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});