import { apiClient } from './apiClient';

export const dashboardService = {
    async getStats() {
        // En attente d'un controller Stats sur Laravel
        return apiClient.get('stats');
    },

    async getAlertes() {
        return apiClient.get('alertes');
    },

    async resolveAlert(id) {
        return apiClient.patch(`alertes/${id}/resoudre`);
    },

    async getHistory() {
        return apiClient.get('historique');
    }
};

