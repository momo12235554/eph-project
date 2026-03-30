import { useState, useCallback } from 'react';
import { commandeService } from '@/src/services/commandeService';

export const useCommandes = () => {
    const [commandes, setCommandes] = useState([]);
    const [fournisseurs, setFournisseurs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [cmdData, fournData] = await Promise.allSettled([
                commandeService.getCommandes(),
                commandeService.getFournisseurs()
            ]);
            if (cmdData.status === 'fulfilled') {
                const c = cmdData.value;
                setCommandes(Array.isArray(c?.data) ? c.data : (Array.isArray(c) ? c : []));
            }
            if (fournData.status === 'fulfilled') {
                const f = fournData.value;
                setFournisseurs(Array.isArray(f?.data) ? f.data : (Array.isArray(f) ? f : []));
            }
        } catch (err) {
            setError(err.message || 'Erreur lors du chargement des données');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createCommande = async (commandeData) => {
        try {
            await commandeService.createCommande(commandeData);
            await loadData();
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        }
    };

    const updateStatut = async (id, statut) => {
        try {
            if (statut === 'livree') {
                await commandeService.validateDelivery(id);
            } else {
                await commandeService.updateStatus(id, statut);
            }
            setCommandes(prev =>
                prev.map(c => c.id === id ? { ...c, statut } : c)
            );
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        }
    };

    const addFournisseur = async (fournisseurData) => {
        try {
            await commandeService.addFournisseur(fournisseurData);
            await loadData();
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        }
    };

    return {
        commandes,
        fournisseurs,
        isLoading,
        error,
        loadData,
        createCommande,
        updateStatut,
        addFournisseur
    };
};
