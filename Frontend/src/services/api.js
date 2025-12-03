const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Para cookies
            ...options
        }

        try {
            const response = await fetch(url, config)
            if (!response.ok) {
                throw new Error(`HTTP error! Status ${response.status}`);
            }

            return await response.json();

        } catch (error) {
            console.error('Erro na requisição', error)
            throw error;
        }
    }

    // Autenticação
    async login(email, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        })
    }

    async logout() {
        return this.request('/auth/logout', {
            method: 'POST'
        })
    }

    async checkAuth() {
        return this.request('/auth/me')
    }

}

export default new ApiService();