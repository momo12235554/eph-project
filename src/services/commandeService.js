import { apiClient } from './apiClient';

export const commandeService = {
    // Commandes
    async getCommandes() {
        return apiClient.get('commandes');
    },

    async createCommande(commande) {
        return apiClient.post('commandes', commande);
    },

    async updateStatus(id, statut) {
        return apiClient.put(`commandes/${id}`, { statut });
    },

    async validateDelivery(id, commentaire = 'Réception validée') {
        // En vrai, on créerait une livraison, mais ici on update juste le statut pour le moment
        return apiClient.put(`commandes/${id}`, { statut: 'livree', commentaire });
    },

    // Fournisseurs
    async getFournisseurs() {
        return apiClient.get('fournisseurs');
    },

    async addFournisseur(fournisseur) {
        return apiClient.post('fournisseurs', fournisseur);
    }
};

