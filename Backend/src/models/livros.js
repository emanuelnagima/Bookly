class Livro {
    constructor(data) {
        this.id = data.id || null;
        this.titulo = data.titulo || '';
        this.autor_id = data.autor_id || '';
        this.editora_id = data.editora_id || '';
        this.autor_nome = data.autor_nome || ''; 
        this.editora_nome = data.editora_nome || ''; 
        this.isbn = data.isbn || '';
        this.genero = data.genero || '';
        this.ano_publicacao = data.ano_publicacao || null;
        this.imagem = data.imagem || null;
        this.status = data.status || 'Disponivel';

         this.generosValidos = [
            // Literatura & Ficção
            'Romance', 'Ficção', 'Ficção Científica', 'Fantasia', 
            'Distopia', 'Realismo Mágico', 'Épico',
            
            // Gêneros Populares
            'Suspense', 'Terror', 'Policial', 'Aventura', 
            'Drama', 'Humor',
            
            // Não-Ficção
            'Biografia', 'Autoajuda', 'História', 'Biologia',
            'Geografia', 'Filosofia', 'Psicologia', 'Sociologia',
            
            // Acadêmico & Educacional
            'Educação', 'Matemática', 'Física', 'Química',
            'Ciências', 'Medicina', 'Direito', 'Economia',
            
            // Artes & Cultura
            'Arte', 'Música', 'Teatro', 'Poesia',
            'Contos', 'Crônicas', 'Mitologia',
            
            // Formatos Especiais
            'Gráfico', 'HQ/Quadrinhos', 'Mangá',
            
            // Por Faixa Etária
            'Infantil', 'Juvenil',
            
            // Temáticas Diversas
            'Negócios', 'Tecnologia', 'Informática', 'Política',
            'Religião', 'Esportes', 'Saúde', 'Culinária', 'Viagem',
            
            'Outro'
        ];
        
        this.statusValidos = ['Disponivel', 'Reservado', 'Emprestado', 'Em manutenção', 'Indisponível'];
    }

    validar() {
        const erros = [];

        if (!this.titulo || this.titulo.trim() === '') erros.push('Título é obrigatório');
        if (!this.autor_id) erros.push('Autor é obrigatório');
        if (!this.editora_id) erros.push('Editora é obrigatória');
        if (!this.isbn || this.isbn.trim() === '') erros.push('ISBN é obrigatório');

        // Validação específica para gênero
        if (!this.genero) {
            erros.push('Gênero é obrigatório');
        } else if (!this.generosValidos.includes(this.genero)) {
            erros.push(`Gênero inválido. Use: ${this.generosValidos.join(', ')}`);
        }

        if (!this.ano_publicacao || isNaN(this.ano_publicacao)) {
            erros.push('Ano de publicação inválido');
        } else if (this.ano_publicacao < 0 || this.ano_publicacao > new Date().getFullYear()) {
            erros.push('Ano de publicação deve ser um valor válido');
        }

        return erros.length === 0 ? true : erros;
    }

    toJSON() {
        return {
            id: this.id,
            titulo: this.titulo,
            autor_id: this.autor_id,
            editora_id: this.editora_id,
            autor_nome: this.autor_nome,
            editora_nome: this.editora_nome,
            isbn: this.isbn,
            genero: this.genero,
            ano_publicacao: this.ano_publicacao,
            imagem: this.imagem,
            status: this.status
        };
    }
}

module.exports = Livro;