import { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";

const CadastroLivro = () => {
  const [livro, setLivro] = useState({
    titulo: "",
    autorId: "",
    editoraId: "",
    ano: "",
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
        setLivro({ titulo: "", autorId: "", editoraId: "", ano: "" });
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
            name="autorId"
            value={livro.autorId}
            onChange={handleChange}
            required
          >
            <option value="">Selecione o autor...</option>
            {autores.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nome}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Editora</Form.Label>
          <Form.Select
            name="editoraId"
            value={livro.editoraId}
            onChange={handleChange}
            required
          >
            <option value="">Selecione a editora...</option>
            {editoras.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nome}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Ano</Form.Label>
          <Form.Control
            type="number"
            name="ano"
            value={livro.ano}
            onChange={handleChange}
            required
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
