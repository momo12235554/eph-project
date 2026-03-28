import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert,
    ActivityIndicator,
} from 'react-native';
import {
    Search,
    AlertTriangle,
    Clock,
    XCircle,
    CheckCircle,
    AlertCircle,
    TrendingDown,
    Calendar,
    Package,
    Bell,
    ChevronRight,
} from 'lucide-react-native';
import { MotiView } from 'moti';
import { BlurView } from 'expo-blur';
import { apiClient } from '../../src/services/apiClient';

const AlertesPage = () => {
    const [alertes, setAlertes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPriorite, setFilterPriorite] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAlertes();
    }, []);

    const fetchAlertes = async () => {
        try {
            const response = await apiClient.get('/medicaments');
            const data = response.data.data || response.data;

            if (Array.isArray(data)) {
                const alertesGenerees = [];
                let idCounter = 1;

                data.forEach(med => {
                    const quantite = parseInt(med.quantite);
                    if (quantite === 0) {
                        alertesGenerees.push({
                            id: idCounter++,
                            type: 'rupture',
                            titre: 'Rupture de stock',
                            message: `${med.nom} - Stock épuisé`,
                            medicament: med.nom,
                            priorite: 'critique',
                            statut: 'active',
                            date: new Date().toLocaleString('fr-FR'),
                            medicament_id: med.id,
                        });
                    } else if (quantite < 10) {
                        alertesGenerees.push({
                            id: idCounter++,
                            type: 'stock_bas',
                            titre: 'Stock très critique',
                            message: `${med.nom} - Stock restant: ${quantite}`,
                            medicament: med.nom,
                            priorite: 'haute',
                            statut: 'active',
                            date: new Date().toLocaleString('fr-FR'),
                            medicament_id: med.id,
                        });
                    } else if (quantite < 20) {
                        alertesGenerees.push({
                            id: idCounter++,
                            type: 'stock_bas',
                            titre: 'Stock critique',
                            message: `${med.nom} - Stock restant: ${quantite}`,
                            medicament: med.nom,
                            priorite: 'moyenne',
                            statut: 'active',
                            date: new Date().toLocaleString('fr-FR'),
                            medicament_id: med.id,
                        });
                    }

                    if (med.date_expiration) {
                        const dateExp = new Date(med.date_expiration);
                        const aujourdhui = new Date();
                        const diffMois = (dateExp - aujourdhui) / (1000 * 60 * 60 * 24 * 30);
                        if (diffMois > 0 && diffMois < 3) {
                            alertesGenerees.push({
                                id: idCounter++,
                                type: 'expiration_proche',
                                titre: 'Expiration imminente',
                                message: `${med.nom} expire (dans ${Math.round(diffMois)} mois)`,
                                medicament: med.nom,
                                priorite: diffMois < 1 ? 'haute' : 'moyenne',
                                statut: 'active',
                                date: new Date().toLocaleString('fr-FR'),
                                medicament_id: med.id,
                            });
                        }
                    }
                });
                setAlertes(alertesGenerees);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    const getPrioriteConfig = (priorite) => {
        const configs = {
            critique: { color: '#EF4444', bgColor: '#FEF2F2', label: 'Urgent' },
            haute: { color: '#F59E0B', bgColor: '#FFFBEB', label: 'Important' },
            moyenne: { color: '#3B82F6', bgColor: '#EFF6FF', label: 'Info' },
        };
        return configs[priorite] || configs.moyenne;
    };

    const filteredAlertes = alertes.filter(alerte => {
        const matchesSearch = alerte.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            alerte.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (alerte.medicament && alerte.medicament.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesFilter = filterPriorite === 'all' || alerte.priorite === filterPriorite;
        return matchesSearch && matchesFilter && alerte.statut === 'active';
    });

    const stats = {
        total: alertes.filter(a => a.statut === 'active').length,
        critique: alertes.filter(a => a.statut === 'active' && a.priorite === 'critique').length,
        haute: alertes.filter(a => a.statut === 'active' && a.priorite === 'haute').length,
    };

    return (
        <View style={styles.container}>
            {/* Header Stats */}
            <View style={styles.header}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
                    <StatCard label="Alertes" value={stats.total} color="#475569" icon={<AlertCircle size={18} color="#475569" />} />
                    <StatCard label="Critiques" value={stats.critique} color="#EF4444" icon={<AlertTriangle size={18} color="#EF4444" />} pulse />
                    <StatCard label="Importantes" value={stats.haute} color="#F59E0B" icon={<Bell size={18} color="#F59E0B" />} />
                </ScrollView>
            </View>

            {/* Search */}
            <View style={styles.searchSection}>
                <View style={styles.searchBox}>
                    <Search color="#94A3B8" size={18} />
                    <TextInput
                        placeholder="Filtrer les notifications..."
                        placeholderTextColor="#94A3B8"
                        style={styles.input}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {loading ? (
                <ActivityIndicator color="#6366F1" style={{ marginTop: 40 }} />
            ) : (
                <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 100 }}>
                    {filteredAlertes.length === 0 ? (
                        <View style={styles.empty}>
                            <CheckCircle size={48} color="#10B981" />
                            <Text style={styles.emptyText}>Tout est en ordre !</Text>
                        </View>
                    ) : (
                        filteredAlertes.map((item, idx) => {
                            const config = getPrioriteConfig(item.priorite);
                            return (
                                <MotiView 
                                    key={item.id}
                                    from={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 80 }}
                                    style={[styles.card, { borderLeftColor: config.color }]}
                                >
                                    <View style={styles.cardHeader}>
                                        <View style={[styles.typeIcon, { backgroundColor: config.bgColor }]}>
                                            <AlertCircle size={20} color={config.color} />
                                        </View>
                                        <View style={{ flex: 1, marginLeft: 12 }}>
                                            <Text style={styles.cardTitle}>{item.titre}</Text>
                                            <Text style={styles.cardTime}>{item.date}</Text>
                                        </View>
                                        <View style={[styles.badge, { backgroundColor: config.bgColor }]}>
                                            <Text style={[styles.badgeText, { color: config.color }]}>{config.label}</Text>
                                        </View>
                                    </View>

                                    <Text style={styles.cardMsg}>{item.message}</Text>

                                    <View style={styles.actions}>
                                        <TouchableOpacity style={styles.btnAction}>
                                            <Bell size={14} color="#6366F1" />
                                            <Text style={styles.btnText}>Signaler</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.btnActionSecondary}>
                                            <Text style={styles.btnTextSecondary}>Ignorer</Text>
                                        </TouchableOpacity>
                                    </View>
                                </MotiView>
                            );
                        })
                    )}
                </ScrollView>
            )}
        </View>
    );
};

const StatCard = ({ label, value, color, icon, pulse }) => (
    <MotiView 
        animate={pulse ? { scale: [1, 1.05, 1] } : {}}
        transition={pulse ? { loop: true, duration: 1000 } : {}}
        style={styles.statCard}
    >
        <View style={[styles.statIcon, { backgroundColor: color + '15' }]}>{icon}</View>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </MotiView>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    header: { paddingVertical: 20 },
    statCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        marginRight: 12,
        width: 130,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
    },
    statIcon: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    statValue: { fontSize: 22, fontWeight: '900' },
    statLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase' },
    searchSection: { paddingHorizontal: 20, marginBottom: 20 },
    searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 16, height: 50, borderWidth: 1, borderColor: '#F1F5F9' },
    input: { flex: 1, marginLeft: 12, fontSize: 14, fontWeight: '600', color: '#1E2937' },
    scroll: { flex: 1, paddingHorizontal: 20 },
    card: { backgroundColor: '#fff', borderRadius: 24, padding: 20, marginBottom: 16, borderLeftWidth: 6, elevation: 3, shadowColor: '#000', shadowOpacity: 0.04 },
    cardHeader: { flexDirection: 'row', alignItems: 'center' },
    typeIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    cardTitle: { fontSize: 15, fontWeight: '800', color: '#1E2937' },
    cardTime: { fontSize: 11, color: '#94A3B8', fontWeight: '600', marginTop: 2 },
    badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    badgeText: { fontSize: 10, fontWeight: '800' },
    cardMsg: { fontSize: 14, color: '#475569', fontWeight: '500', marginTop: 15, lineHeight: 20 },
    actions: { flexDirection: 'row', marginTop: 15, gap: 12 },
    btnAction: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#EEF2FF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
    btnText: { fontSize: 13, color: '#6366F1', fontWeight: '700' },
    btnActionSecondary: { paddingHorizontal: 16, paddingVertical: 8 },
    btnTextSecondary: { fontSize: 13, color: '#94A3B8', fontWeight: '700' },
    empty: { padding: 50, alignItems: 'center' },
    emptyText: { marginTop: 12, color: '#94A3B8', fontWeight: '700' },
});

export default AlertesPage;
