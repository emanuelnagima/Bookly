const alunosRepository = require('../repository/alunosRepository');
const Aluno = require('../models/aluno');

// FUNÇÃO PARA GERAR MATRÍCULA (MOVE PARA AQUI)
function gerarNovaMatricula(ultimaMatricula) {
    const anoAtual = new Date().getFullYear();
    
    // Se não houver matrícula anterior, começa com 001
    if (!ultimaMatricula) {
        return `${anoAtual}-001`;
    }
    
    // Extrai número sequencial da última matrícula
    // Formato esperado: "2025-001"
    const partes = ultimaMatricula.split('-');
    
    if (partes.length !== 2) {
        // Se formato estiver errado, reinicia sequência
        return `${anoAtual}-001`;
    }
    
    const ultimoAno = parseInt(partes[0]);
    const ultimoNumero = parseInt(partes[1]);
    
    // Se mudou o ano, reinicia a contagem
    if (ultimoAno !== anoAtual) {
        return `${anoAtual}-001`;
    }
    
    // Incrementa o número sequencial
    const novoNumero = ultimoNumero + 1;
    
    // Formata com 3 dígitos (001, 002, etc.)
    return `${anoAtual}-${novoNumero.toString().padStart(3, '0')}`;
}

class AlunosController {
    async getAll(req, res) {
        try {
            const alunos = await alunosRepository.findAll();
            res.json({ success: true, data: alunos, total: alunos.length });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getById(req, res) {
        try {
            const aluno = await alunosRepository.findById(req.params.id);
            aluno
                ? res.json({ success: true, data: aluno })
                : res.status(404).json({ success: false, message: 'Aluno não encontrado' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async create(req, res) {
        try {
            const aluno = new Aluno(req.body);
            const erros = aluno.validar();
            
            if (erros !== true) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Dados inválidos', 
                    errors: erros 
                });
            }
            
            // GERAR MATRÍCULA AUTOMÁTICA
            const ultimaMatricula = await alunosRepository.getUltimaMatricula();
            aluno.matricula = gerarNovaMatricula(ultimaMatricula);
            
            // Validar se matrícula já existe (segurança adicional)
            const matriculaExistente = await alunosRepository.findByMatricula(aluno.matricula);
            if (matriculaExistente) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Erro ao gerar matrícula. Tente novamente.' 
                });
            }
            
            const novoAluno = await alunosRepository.create(aluno);
            res.status(201).json({ 
                success: true, 
                data: novoAluno, 
                message: 'Aluno criado com matrícula ' + novoAluno.matricula 
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async update(req, res) {
        try {
            const alunoExistente = await alunosRepository.findById(req.params.id);
            if (!alunoExistente) {
                return res.status(404).json({ success: false, message: 'Aluno não encontrado' });
            }

            // Manter a matrícula original na edição
            const aluno = new Aluno({ 
                ...req.body, 
                id: req.params.id,
                matricula: alunoExistente.matricula 
            });
            
            const erros = aluno.validar();

            if (erros !== true) {
                return res.status(400).json({ success: false, message: 'Dados inválidos', errors: erros });
            }

            const alunoAtualizado = await alunosRepository.update(req.params.id, aluno);
            res.json({ success: true, data: alunoAtualizado, message: 'Aluno atualizado!' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async delete(req, res) {
        try {
            const deleted = await alunosRepository.delete(req.params.id);
            deleted
                ? res.json({ success: true, message: 'Aluno deletado!' })
                : res.status(404).json({ success: false, message: 'Aluno não encontrado' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new AlunosController();