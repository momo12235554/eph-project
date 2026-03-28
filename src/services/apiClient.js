import { API_URL } from '@/src/constants/config';

// Persistance simple pour la démo web
let authToken = typeof window !== 'undefined' ? localStorage.getItem('eph_token') : null;

export const apiClient = {
    setToken(token) {
        authToken = token;
        if (typeof window !== 'undefined') {
            if (token) localStorage.setItem('eph_token', token);
            else localStorage.removeItem('eph_token');
        }
    },


    async call(endpoint, options = {}) {
        const url = `${API_URL}/${endpoint.startsWith('/') ? endpoint.slice(1) : endpoint}`;
        
        const defaultHeaders = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };

        if (authToken && authToken !== 'null' && authToken !== '') {
            defaultHeaders['Authorization'] = `Bearer ${authToken}`;
            console.log("📡 [apiClient] TOKEN ENVOYÉ:", authToken.substring(0, 15) + "..."); 
        } else {
            console.warn("📡 [apiClient] ATTENTION: Aucun badge (Token) envoyé !");
        }

        const response = await fetch(url, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                console.warn("🔒 [apiClient] 401 Unauthorized: Badge invalide ou expiré. Nettoyage...");
                this.setToken(null); // Nettoyage interne
                
                if (typeof window !== 'undefined') {
                    // Nettoyage complet
                    localStorage.removeItem('eph_token');
                    localStorage.removeItem('eph_user');
                    
                    // Si on n'est pas déjà sur l'accueil, on y va en silence
                    if (window.location.pathname !== "/") {
                        window.location.href = "/";
                        // On retourne un objet vide pour ne pas faire crasher les .catch()
                        return {}; 
                    }
                }
                throw new Error('Votre session a expiré. Veuillez vous reconnecter.');
            }
            const errorData = await response.json().catch(() => ({}));
            console.error("❌ [apiClient] ERREUR SERVEUR DÉTECTÉE :", response.status, errorData);
            throw new Error(errorData.message || `Erreur serveur (${response.status})`);
        }

        return response.json();
    },

    async get(endpoint, options = {}) {
        return this.call(endpoint, { ...options, method: 'GET' });
    },

    async post(endpoint, data, options = {}) {
        return this.call(endpoint, { 
            ...options, 
            method: 'POST', 
            body: JSON.stringify(data) 
        });
    },

    async put(endpoint, data, options = {}) {
        return this.call(endpoint, { 
            ...options, 
            method: 'PUT', 
            body: JSON.stringify(data) 
        });
    },

    async delete(endpoint, options = {}) {
        return this.call(endpoint, { ...options, method: 'DELETE' });
    }
};

