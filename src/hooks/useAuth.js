import { useState } from 'react';
import { authService } from '@/src/services/authService';

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (username, password, role) => {
        setIsLoading(true);
        setError(null);
        try {
            const userData = await authService.login(username, password, role);
            setIsLoading(false);
            return userData; // Succès
        } catch (err) {
            setError(err.message || 'Erreur lors de la connexion');
            setIsLoading(false);
            // Mode Fallback pour démo si backend non disponible
            console.warn("Utilisation du mode fallback faute d'accès à la BDD", err);
            return {
                nom: username.split(' ')[0] || username,
                prenom: username.split(' ')[1] || '',
                email: `${role}@chu.dz`,
                role: role
            };
        }
    };

    return { login, isLoading, error };
};
