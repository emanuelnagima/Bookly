
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

module.exports = { gerarNovaMatricula };