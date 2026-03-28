import { apiClient } from './apiClient';

export const medicamentService = {
    async getAll() {
        return apiClient.get('medicaments');
    },

    async add(medicament) {
        return apiClient.post('medicaments', medicament);
    },

    async update(id, medicament) {
        return apiClient.put(`medicaments/${id}`, medicament);
    },

    async updateQuantity(id, quantite) {
        return apiClient.put(`medicaments/${id}`, { quantite });
    },

    async delete(id) {
        return apiClient.delete(`medicaments/${id}`);
    },

    async getLowStock() {
        return apiClient.get('medicaments-stock-faible');
    }
};

