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
            const results = await Promise.allSettled([
                dashboardService.getStats(),
                dashboardService.getAlertes(),
                dashboardService.getHistory()
            ]);

            const [statsRes, alertesRes, histoRes] = results;

            if (statsRes.status === 'fulfilled') {
                const data = statsRes.value;
                setStats(data?.data || data || {});
            }

            if (alertesRes.status === 'fulfilled') {
                const data = alertesRes.value;
                setAlertes(Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []));
            }

            if (histoRes.status === 'fulfilled') {
                const data = histoRes.value;
                setHistorique(Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []));
            }
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
