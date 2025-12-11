import { useState, useEffect } from 'react'
import { Card, Form, Col, Row, Button, Spinner } from 'react-bootstrap'
import { BsCheckCircle } from 'react-icons/bs';

const nacionalidades = [
  "Afeganistão", "África do Sul", "Albânia", "Alemanha", "Andorra", "Angola", "Antígua e Barbuda",
  "Arábia Saudita", "Argélia", "Argentina", "Armênia", "Austrália", "Áustria", "Azerbaijão",
  "Bahamas", "Bangladesh", "Barbados", "Barém", "Bélgica", "Belize", "Benim", "Bielorrússia",
  "Bolívia", "Bósnia e Herzegovina", "Botsuana", "Brasil", "Brunei", "Bulgária", "Burquina Fasso",
  "Burundi", "Butão", "Cabo Verde", "Camarões", "Camboja", "Canadá", "Catar", "Cazaquistão",
  "Chade", "Chile", "China", "Chipre", "Colômbia", "Comores", "Congo", "Coreia do Norte",
  "Coreia do Sul", "Costa do Marfim", "Costa Rica", "Croácia", "Cuba", "Dinamarca", "Djibuti",
  "Dominica", "Egito", "El Salvador", "Emirados Árabes Unidos", "Equador", "Eritreia", "Eslováquia",
  "Eslovênia", "Espanha", "Estados Unidos", "Estônia", "Essuatíni", "Etiópia", "Fiji", "Filipinas",
  "Finlândia", "França", "Gabão", "Gâmbia", "Gana", "Geórgia", "Granada", "Grécia", "Guatemala",
  "Guiana", "Guiné", "Guiné Equatorial", "Guiné-Bissau", "Haiti", "Holanda", "Honduras", "Hungria",
  "Iêmen", "Índia", "Indonésia", "Irã", "Iraque", "Irlanda", "Islândia", "Israel", "Itália",
  "Jamaica", "Japão", "Jordânia", "Kuwait", "Laos", "Lesoto", "Letônia", "Líbano", "Libéria",
  "Líbia", "Liechtenstein", "Lituânia", "Luxemburgo", "Macedônia do Norte", "Madagascar", "Malásia",
  "Maláui", "Maldivas", "Mali", "Malta", "Marrocos", "Maurícia", "Mauritânia", "México", "Mianmar",
  "Micronésia", "Moçambique", "Moldávia", "Mônaco", "Mongólia", "Montenegro", "Namíbia", "Nauru",
  "Nepal", "Nicarágua", "Níger", "Nigéria", "Noruega", "Nova Zelândia", "Omã", "Outra",
  "Países Baixos", "Palau", "Panamá", "Papua-Nova Guiné", "Paquistão", "Paraguai", "Peru", "Polônia",
  "Portugal", "Quênia", "Quirguistão", "Reino Unido", "República Centro-Africana", "República Checa",
  "República Democrática do Congo", "República Dominicana", "Romênia", "Ruanda", "Rússia",
  "Salomão", "Samoa", "Santa Lúcia", "São Cristóvão e Nevis", "São Marinho", "São Tomé e Príncipe",
  "São Vicente e Granadinas", "Seicheles", "Senegal", "Serra Leoa", "Sérvia", "Singapura", "Síria",
  "Somália", "Sri Lanka", "Sudão", "Sudão do Sul", "Suécia", "Suíça", "Suriname", "Tailândia",
  "Taiwan", "Tajiquistão", "Tanzânia", "Timor-Leste", "Togo", "Tonga", "Trinidad e Tobago", "Tunísia",
  "Turcomenistão", "Turquia", "Tuvalu", "Ucrânia", "Uganda", "Uruguai", "Uzbequistão", "Vanuatu",
  "Vaticano", "Venezuela", "Vietnã", "Zâmbia", "Zimbábue"
];

const CadAutor = ({ onSave, onCancel, autor, loading }) => {
  const [autorData, setAutorData] = useState({
    id: null,
    nome: '',
    nacionalidade: '',
    data_nascimento: ''
  })

  const [validated, setValidated] = useState(false)

  // Função para formatar data para input type="date"
  const formatarDataParaInput = (dataString) => {
    if (!dataString) return '';
    
    // Se já estiver no formato YYYY-MM-DD, retorna como está
    if (typeof dataString === 'string' && dataString.includes('T')) {
      // Se tiver 'T' (timestamp ISO), extrai apenas a parte da data
      return dataString.split('T')[0];
    }
    
    // Tenta converter de diferentes formatos
    try {
      const data = new Date(dataString);
      
      // Verifica se a data é válida
      if (isNaN(data.getTime())) {
        console.warn('Data inválida:', dataString);
        return '';
      }
      
      // Formata para YYYY-MM-DD
      const ano = data.getFullYear();
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const dia = String(data.getDate()).padStart(2, '0');
      
      return `${ano}-${mes}-${dia}`;
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return '';
    }
  };

  useEffect(() => {
    if (autor) {
      const dataFormatada = formatarDataParaInput(autor.data_nascimento);      
      setAutorData({
        id: autor.id,
        nome: autor.nome || '',
        nacionalidade: autor.nacionalidade || '',
        data_nascimento: dataFormatada
      });
    } else {
      setAutorData({
        id: null,
        nome: '',
        nacionalidade: '',
        data_nascimento: ''
      });
    }
  }, [autor])

  const handleChange = (e) => {
    const { name, value } = e.target
    setAutorData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = e.currentTarget

    if (form.checkValidity() === false) {
      e.stopPropagation()
      setValidated(true)
      return
    }

    onSave(autorData)
  }

  return (
    <Card>
      <Card.Header className='bg-primary text-white'>
        <h5 className='mb-0'>{autorData.id ? 'Editar Autor' : 'Cadastrar Autor'}</h5>
      </Card.Header>
      <Card.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='nome'>
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type='text'
                  name='nome'
                  placeholder='Digite o nome do autor'
                  value={autorData.nome}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <Form.Control.Feedback type='invalid'>
                  Informe o nome do autor
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='nacionalidade'>
                <Form.Label>Nacionalidade</Form.Label>
                <Form.Select
                  name='nacionalidade'
                  value={autorData.nacionalidade}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value=''>Selecione...</option>
                  {nacionalidades.map((nac) => (
                    <option key={nac} value={nac}>
                      {nac}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type='invalid'>
                  Informe a nacionalidade
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='data_nascimento'>
                <Form.Label>Data de Nascimento</Form.Label>
                <Form.Control
                  type='date'
                  name='data_nascimento'
                  value={autorData.data_nascimento}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <Form.Control.Feedback type='invalid'>
                  Informe a data de nascimento
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <div className='d-flex justify-content-end gap-2'>
            <Button
              variant='cancelar'
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  {autorData.id ? ' Atualizando...' : ' Salvando...'}
                </>
              ) : (
                <>
                  <BsCheckCircle style={{ marginRight: '8px', color: '#fff', fontSize: '18px' }} />
                  {autorData.id ? 'Atualizar Autor' : 'Cadastrar Autor'}
                </>
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default CadAutor;