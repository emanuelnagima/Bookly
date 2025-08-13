class Livros {
    constructor(data) {
        this.id = data.id || null;
        this.titulo = data.titulo || '';
        this.autor = data.autor || '';
        this.editora = data.editora || '';
        this.isbn = data.isbn || '';
        this.genero = data.genero || '';
        this.ano_publicacao = data.ano_publicacao || data.ano_publicacao || null;

        
        this.generosValidos = [
            'Romance',
            'Ficção',
            'Drama',
            'Suspense',
            'Fantasia',
            'Biografia',
            'Terror',
            'Educação',
            'Outro'
        ];
    }

    validar() {
        const erros = [];
        
        if (!this.titulo || this.titulo.trim() === '') erros.push('Título é obrigatório');
        if (!this.autor || this.autor.trim() === '') erros.push('Autor é obrigatório');
        if (!this.editora || this.editora.trim() === '') erros.push('Editora é obrigatória');
        if (!this.isbn || this.isbn.trim() === '') erros.push('ISBN é obrigatório');
        
        // Validação     específica p ara gênero
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
            autor: this.autor,
            editora: this.editora,
            isbn: this.isbn,
            genero: this.generosValidos.includes(this.genero) ? this.genero : 'Outro',
            ano_publicacao: this.ano_publicacao
        };
    }
}

module.exports = Livros;