import { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";

const CadastroLivro = () => {
  const [livro, setLivro] = useState({
    titulo: "",
    autor_id: "",
    editora_id: "",
    ano_publicacao: "",
    isbn: "",
    genero: "",
    imagem: ""
  });

  const [autores, setAutores] = useState([]);
  const [editoras, setEditoras] = useState([]);

  // Buscar autores e editoras na API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resAutores, resEditoras] = await Promise.all([
          fetch("http://localhost:3000/api/autores"),
          fetch("http://localhost:3000/api/editoras"),
        ]);

        const dataAutores = await resAutores.json();
        const dataEditoras = await resEditoras.json();

        if (dataAutores.success) setAutores(dataAutores.data);
        if (dataEditoras.success) setEditoras(dataEditoras.data);
      } catch (err) {
        console.error("Erro ao carregar autores/editoras", err);
      }
    };

    fetchData();
  }, []);

  // Manipular inputs
  const handleChange = (e) => {
    setLivro({ ...livro, [e.target.name]: e.target.value });
  };

  // Enviar form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/livros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(livro),
      });

      const result = await response.json();
      if (result.success) {
        alert("Livro cadastrado com sucesso!");
        setLivro({
          titulo: "",
          autor_id: "",
          editora_id: "",
          ano_publicacao: "",
          isbn: "",
          genero: "",
          imagem: ""
        });
      } else {
        alert("Erro ao cadastrar livro!");
      }
    } catch (err) {
      console.error("Erro ao salvar livro", err);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Cadastro de Livro</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Título</Form.Label>
          <Form.Control
            type="text"
            name="titulo"
            value={livro.titulo}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Autor</Form.Label>
          <Form.Select
            name="autor_id"
            value={livro.autor_id}
            onChange={handleChange}
            required
          >
            <option value="">Selecione o autor...</option>
            {autores.map((a) => (
              <option key={a.id} value={a.id}>{a.nome}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Editora</Form.Label>
          <Form.Select
            name="editora_id"
            value={livro.editora_id}
            onChange={handleChange}
            required
          >
            <option value="">Selecione a editora...</option>
            {editoras.map((e) => (
              <option key={e.id} value={e.id}>{e.nome}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Ano de Publicação</Form.Label>
          <Form.Control
            type="number"
            name="ano_publicacao"
            value={livro.ano_publicacao}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>ISBN</Form.Label>
          <Form.Control
            type="text"
            name="isbn"
            value={livro.isbn}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Gênero</Form.Label>
          <Form.Select
            name="genero"
            value={livro.genero}
            onChange={handleChange}
            required
          >
            <option value="">Selecione o gênero...</option>
            <option value="Romance">Romance</option>
            <option value="Ficção">Ficção</option>
            <option value="Drama">Drama</option>
            <option value="Suspense">Suspense</option>
            <option value="Fantasia">Fantasia</option>
            <option value="Biografia">Biografia</option>
            <option value="Terror">Terror</option>
            <option value="Educação">Educação</option>
            <option value="Outro">Outro</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Imagem (URL)</Form.Label>
          <Form.Control
            type="text"
            name="imagem"
            value={livro.imagem}
            onChange={handleChange}
          />
        </Form.Group>

        <Button type="submit" variant="primary">
          Cadastrar
        </Button>
      </Form>
    </Container>
  );
};

export default CadastroLivro;
