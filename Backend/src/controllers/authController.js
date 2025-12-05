    const jwt = require('jsonwebtoken');
    const pool = require('../../config/database'); 

    async function login(req, res) {
        try {
            const { email, password } = req.body;
            
            if (!email || !password) {
                return res.status(400).json({ error: 'Email e senha são obrigatórios' });
            }

            // BUSCA usuario NO BANCO 
            const [users] = await pool.execute(
                'SELECT * FROM usuarios_sistema WHERE email = ?',
                [email]
            );
            
            if (users.length === 0) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }

            const user = users[0];
            
            // Verifica senha
            if (user.password !== password) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }

            // Gera token
            const token = jwt.sign(
                { 
                    sub: user.id, 
                    role: user.role,
                    nome: user.nome
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h', issuer: 'myapp' }
            );

            // Cookie
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
                    role: user.role,
                    nome: user.nome
                }
            });

        } catch (error) {
            console.error('Erro no login:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
        }
    async function getMe(req, res) {
        // Busca no banco
        const [users] = await pool.execute(
            'SELECT id, email, role, nome FROM usuarios_sistema WHERE id = ?',
            [req.user.sub]
        );
        
        if (users.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        
        const user = users[0];
        
        return res.json({
            id: user.id,
            email: user.email,
            role: user.role,
            nome: user.nome
        });
    }
    async function logout(req, res) {
        res.clearCookie('auth_token');
        return res.json({ message: 'Logout realizado com sucesso' });
    }

    module.exports = { login, getMe, logout };