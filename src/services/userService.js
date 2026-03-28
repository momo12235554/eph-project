import { apiClient } from './apiClient';

export const userService = {
    async getAllUsers() {
        return apiClient.get('users');
    },

    async getUsersByRole(role) {
        return apiClient.get(`users?role=${role}`);
    },

    async createUser(userData) {
        return apiClient.post('users', userData);
    },

    async updateUser(id, userData) {
        return apiClient.put(`users/${id}`, userData);
    },

    async deleteUser(id) {
        return apiClient.delete(`users/${id}`);
    }
};

