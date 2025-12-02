const jwt = require('jsonwebtoken');

const USERS = [
    { id: 1, email: 'admin@bookly.com', password: 'aDmin@&909086', role: 'admin' },
    { id: 2, email: 'operador@bookly.com', password: 'oPerador@98!o7', role: 'operador' },
];

async function login(req, res) {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        const user = USERS.find(u => u.email === email && u.password === password);
        
        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const token = jwt.sign(
            { sub: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h', issuer: 'myapp' }
        );

        // Setar cookie httpOnly
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.json({
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Erro no login:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

async function getMe(req, res) {
    const user = USERS.find(u => u.id === req.user.sub);
    
    if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    return res.json({
        id: user.id,
        email: user.email,
        role: user.role
    });
}

async function logout(req, res) {
    res.clearCookie('auth_token');
    return res.json({ message: 'Logout realizado com sucesso' });
}

module.exports = { login, getMe, logout };