import { useState, useCallback } from 'react';
import { dashboardService } from '@/src/services/dashboardService';

export const useDashboard = () => {
    const [stats, setStats] = useState({});
    const [alertes, setAlertes] = useState([]);
    const [historique, setHistorique] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadDashboard = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [statsData, alertesData, histoData] = await Promise.all([
                dashboardService.getStats(),
                dashboardService.getAlertes(),
                dashboardService.getHistory()
            ]);

            setStats(statsData?.data || statsData || {});
            setAlertes(Array.isArray(alertesData?.data) ? alertesData.data : (Array.isArray(alertesData) ? alertesData : []));
            setHistorique(Array.isArray(histoData?.data) ? histoData.data : (Array.isArray(histoData) ? histoData : []));
        } catch (err) {
            setError(err.message || 'Erreur dashboard');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const resolveAlert = async (id) => {
        try {
            await dashboardService.resolveAlert(id);
            setAlertes(prev => prev.filter(a => a.id !== id));
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        }
    };

    return {
        stats,
        alertes,
        historique,
        isLoading,
        error,
        loadDashboard,
        resolveAlert
    };
};
