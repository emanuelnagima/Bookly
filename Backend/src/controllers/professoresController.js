const professoresRepository = require('../repository/professoresRepository');
const Professor = require('../models/professor');

// FUNÇÃO PARA GERAR MATRÍCULA DE PROFESSOR
function gerarMatriculaProfessor(ultimaMatriculaProfessor) {
    const anoAtual = new Date().getFullYear();
    const prefixo = 'P'; // Prefixo único para professores
    
    if (!ultimaMatriculaProfessor) {
        return `${prefixo}${anoAtual}001`;
    }
    
    // Formato esperado: "P2025001"
    // Verificar se começa com "P" e tem pelo menos 8 caracteres
    if (!ultimaMatriculaProfessor.startsWith('P') || ultimaMatriculaProfessor.length < 8) {
        return `${prefixo}${anoAtual}001`;
    }
    
    // Extrair ano e número da última matrícula
    const ultimoAno = parseInt(ultimaMatriculaProfessor.substring(1, 5));
    const ultimoNumeroStr = ultimaMatriculaProfessor.substring(5);
    const ultimoNumero = parseInt(ultimoNumeroStr);
    
    if (isNaN(ultimoAno) || isNaN(ultimoNumero)) {
        return `${prefixo}${anoAtual}001`;
    }
    
    if (ultimoAno === anoAtual) {
        // Mesmo ano, incrementa número
        const novoNumero = ultimoNumero + 1;
        return `${prefixo}${anoAtual}${novoNumero.toString().padStart(3, '0')}`;
    } else {
        // Novo ano, reinicia contagem
        return `${prefixo}${anoAtual}001`;
    }
}
class ProfessoresController {
    async getAll(req, res) {
        try {
            const professores = await professoresRepository.findAll();        
            res.json({ success: true, data: professores, total: professores.length });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getById(req, res) {
        try {
            const professor = await professoresRepository.findById(req.params.id);
            professor
                ? res.json({ success: true, data: professor })
                : res.status(404).json({ success: false, message: 'Professor não encontrado' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

async create(req, res) {
    try {  
        const professor = new Professor(req.body);
        const erros = professor.validar();
        
        if (erros !== true) {
            return res.status(400).json({ 
                success: false, 
                message: 'Dados inválidos', 
                errors: erros 
            });
        }

        // GERAR MATRÍCULA AUTOMÁTICA
        const ultimaMatricula = await professoresRepository.getUltimaMatricula();
        
        professor.matricula = gerarMatriculaProfessor(ultimaMatricula);
        
        const novoProfessor = await professoresRepository.create(professor);
        
        res.status(201).json({ 
            success: true, 
            data: novoProfessor, 
            message: `Professor criado com matrícula ${novoProfessor.matricula}` 
        });
    } catch (error) {
        console.error(' Erro ao criar professor:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}
    async update(req, res) {
        try {
            const professorExistente = await professoresRepository.findById(req.params.id);
            if (!professorExistente) {
                return res.status(404).json({ success: false, message: 'Professor não encontrado' });
            }

            // Manter a matrícula original na edição
            const professor = new Professor({ 
                ...req.body, 
                id: req.params.id,
                matricula: professorExistente.matricula 
            });
            
            const erros = professor.validar();

            if (erros !== true) {
                return res.status(400).json({ success: false, message: 'Dados inválidos', errors: erros });
            }

            const professorAtualizado = await professoresRepository.update(req.params.id, professor);
            res.json({ 
                success: true, 
                data: professorAtualizado, 
                message: 'Professor atualizado!' 
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async delete(req, res) {
        try {
            const deleted = await professoresRepository.delete(req.params.id);
            deleted
                ? res.json({ success: true, message: 'Professor deletado!' })
                : res.status(404).json({ success: false, message: 'Professor não encontrado' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new ProfessoresController();