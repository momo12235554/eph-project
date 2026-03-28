import { apiClient } from './apiClient';

export const authService = {
    /**
     * Se connecte au backend Laravel sanctum
     */
    async login(username, password) {
        try {
            const response = await apiClient.post('login', {
                username,
                password
            });

            console.log("🔍 [authService] RÉPONSE BRUTE LOGIN:", response);

            // Laravel ApiResponse enveloppe tout dans une clé 'data'
            const payload = response.data || response;
            
            return {
                user: payload.user || payload,
                token: payload.token || payload.access_token
            };
        } catch (error) {
            throw error;
        }
    },

    async logout() {
        return apiClient.post('logout');
    }
};

