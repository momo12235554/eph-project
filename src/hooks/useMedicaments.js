import { useState, useCallback } from 'react';
import { medicamentService } from '@/src/services/medicamentService';

export const useMedicaments = () => {
    const [medicaments, setMedicaments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadMedicaments = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await medicamentService.getAll();
            // Laravel ApiResponse wrap data in 'data' field
            const items = response && response.data ? response.data : response;
            setMedicaments(Array.isArray(items) ? items : []);
        } catch (err) {
            setError(err.message || 'Erreur lors du chargement des médicaments');
            setMedicaments([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addMedicament = async (medData) => {
        try {
            await medicamentService.add(medData);
            await loadMedicaments(); // Rafraîchir
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        }
    };

    const updateMedicament = async (id, medData) => {
        try {
            await medicamentService.update(id, medData);
            await loadMedicaments();
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        }
    };

    const updateQuantity = async (id, newQuantity) => {
        try {
            await medicamentService.updateQuantity(id, newQuantity);
            setMedicaments(prev =>
                prev.map(m => m.id === id ? { ...m, quantite: newQuantity } : m)
            );
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        }
    };

    const deleteMedicament = async (id) => {
        try {
            await medicamentService.delete(id);
            await loadMedicaments();
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        }
    };

    return {
        medicaments,
        isLoading,
        error,
        loadMedicaments,
        addMedicament,
        updateMedicament,
        updateQuantity,
        deleteMedicament
    };
};
