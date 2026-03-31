import { useState, useCallback } from 'react';
import { userService } from '@/src/services/userService';

export const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadUsers = useCallback(async (role = null) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = role
                ? await userService.getUsersByRole(role)
                : await userService.getAllUsers();
            const items = response?.data || response;
            setUsers(Array.isArray(items) ? items : []);
        } catch (err) {
            setError(err.message || 'Erreur lors du chargement des utilisateurs');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addUser = useCallback(async (userData) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await userService.createUser(userData);
            return response;
        } catch (err) {
            setError(err.message || 'Erreur lors de la création de l\'utilisateur');
            throw err; // Propage l'erreur pour que admin.jsx puisse l'afficher
        } finally {
            setIsLoading(false);
        }
    }, [loadUsers]);

    return {
        users,
        isLoading,
        error,
        loadUsers,
        addUser
    };
};
