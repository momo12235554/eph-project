import { apiClient } from './apiClient';

export const commandeService = {
    // Commandes
    async getCommandes() {
        return apiClient.get('commandes');
    },

    async createCommande(commande) {
        return apiClient.post('commandes', commande);
    },

    async updateStatus(id, statut, commentaire = null) {
        return apiClient.put(`commandes/${id}`, { statut, commentaire });
    },

    async validateDelivery(id, commentaire = 'Réception validée') {
        return apiClient.put(`commandes/${id}`, { statut: 'livree', commentaire });
    },

    async cancelCommande(id, motif) {
        return apiClient.put(`commandes/${id}`, { statut: 'annulee', commentaire: motif });
    },

    // Fournisseurs
    async getFournisseurs() {
        return apiClient.get('fournisseurs');
    },

    async addFournisseur(fournisseur) {
        return apiClient.post('fournisseurs', fournisseur);
    }
};

