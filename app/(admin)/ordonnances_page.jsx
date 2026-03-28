import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Modal,
    Alert,
    ActivityIndicator,
} from 'react-native';
import {
    Search,
    Plus,
    CheckCircle,
    XCircle,
    Clock,
    User,
    Calendar,
    FileText,
    Package,
    ChevronRight,
    Filter,
} from 'lucide-react-native';
import { MotiView } from 'moti';
import { apiClient } from '../../src/services/apiClient';



const OrdonnancesPage = () => {
    const [ordonnances, setOrdonnances] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [medicamentsList, setMedicamentsList] = useState([]);
    const [newOrdonnance, setNewOrdonnance] = useState({
        numero_ordonnance: '',
        patient_nom: '',
        medecin_nom: '',
        lignes: []
    });
    const [tempLigne, setTempLigne] = useState({
        medicament_id: '',
        quantite: '1',
        posologie: ''
    });

    const loadData = async () => {
        setLoading(true);
        try {
            // Utilisation du nouvel apiClient RESTful
            const response = await apiClient.get('/ordonnances');
            const data = response.data.data || response.data;

            // Adaptation aux noms de champs Laravel
            const adaptedData = data.map(ord => ({
                id: ord.id,
                numero: ord.numero_ordonnance,
                patient: ord.patient_nom,
                medecin: ord.medecin_nom,
                date: ord.date_prescription || ord.created_at,
                statut: ord.statut,
                medicaments: (ord.medicaments || ord.lignes || ord.ligne_commandes || []).map(l => ({
                    nom: l.medicament?.nom || l.medicament_nom || l.nom,
                    quantite: l.quantite,
                    posologie: l.posologie
                }))
            }));
            setOrdonnances(adaptedData);

            const medsResponse = await apiClient.get('/medicaments');
            setMedicamentsList(medsResponse.data.data || medsResponse.data);
            
        } catch (error) {
            console.error("Erreur chargement ordonnances:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAddLigne = () => {
        if (!tempLigne.medicament_id || !tempLigne.quantite) {
            Alert.alert('Erreur', 'Sélectionnez un médicament et une quantité');
            return;
        }
        const med = medicamentsList.find(m => m.id == tempLigne.medicament_id);
        setNewOrdonnance({
            ...newOrdonnance,
            lignes: [...newOrdonnance.lignes, { ...tempLigne, medicament_nom: med.nom }]
        });
        setTempLigne({ medicament_id: '', quantite: '1', posologie: '' });
    };

    const handleRemoveLigne = (index) => {
        const updated = [...newOrdonnance.lignes];
        updated.splice(index, 1);
        setNewOrdonnance({ ...newOrdonnance, lignes: updated });
    };

    const handleSubmitOrdonnance = async () => {
        if (!newOrdonnance.numero_ordonnance || !newOrdonnance.patient_nom || !newOrdonnance.medecin_nom || newOrdonnance.lignes.length === 0) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs et ajouter au moins un médicament');
            return;
        }

        try {
            const payload = {
                ...newOrdonnance,
                date_prescription: new Date().toISOString().split('T')[0],
                patient_prenom: "-"
            };
            await apiClient.post('/ordonnances', payload);
            Alert.alert('Succès', 'Ordonnance ajoutée');
            setShowAddModal(false);
            setNewOrdonnance({ numero_ordonnance: '', patient_nom: '', medecin_nom: '', lignes: [] });
            loadData();
        } catch (error) {
            console.error("Échec côté serveur pour l'ordonnance :", error.message);
            Alert.alert('Erreur', 'Échec de l\'ajout de l\'ordonnance');
        }
    };


    const getStatusConfig = (statut) => {
        const configs = {
            en_attente: { color: '#D97706', bgColor: '#FFFBEB', label: 'En Attente', icon: <Clock size={14} color="#D97706" /> },
            validee: { color: '#2563EB', bgColor: '#EFF6FF', label: 'Validée', icon: <CheckCircle size={14} color="#2563EB" /> },
            delivree: { color: '#059669', bgColor: '#ECFDF5', label: 'Délivrée', icon: <Package size={14} color="#059669" /> },
            annulee: { color: '#DC2626', bgColor: '#FEF2F2', label: 'Annulée', icon: <XCircle size={14} color="#DC2626" /> },
        };
        return configs[statut] || configs.en_attente;
    };

    const handleValider = (id) => {
        setOrdonnances(ordonnances.map(ord =>
            ord.id === id ? { ...ord, statut: 'validee' } : ord
        ));
        Alert.alert('Succès', 'Ordonnance validée avec succès');
    };

    const handleDelivrer = (id) => {
        setOrdonnances(ordonnances.map(ord =>
            ord.id === id ? { ...ord, statut: 'delivree' } : ord
        ));
        Alert.alert('Succès', 'Ordonnance marquée comme délivrée');
    };

    const handleAnnuler = (id) => {
        Alert.alert(
            'Confirmation',
            'Voulez-vous vraiment annuler cette ordonnance ?',
            [
                { text: 'Non', style: 'cancel' },
                {
                    text: 'Oui',
                    style: 'destructive',
                    onPress: () => {
                        setOrdonnances(ordonnances.map(ord =>
                            ord.id === id ? { ...ord, statut: 'annulee' } : ord
                        ));
                    },
                },
            ]
        );
    };

    const filteredOrdonnances = ordonnances.filter(ord => {
        const matchesSearch = ord.numero.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ord.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ord.medecin.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === 'all' || ord.statut === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const stats = {
        total: ordonnances.length,
        en_attente: ordonnances.filter(o => o.statut === 'en_attente').length,
        validee: ordonnances.filter(o => o.statut === 'validee').length,
        delivree: ordonnances.filter(o => o.statut === 'delivree').length,
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchWrapper}>
                <View style={styles.searchBox}>
                    <Search color="#94A3B8" size={18} />
                    <TextInput
                        placeholder="Patient, prescripteur, numéro..."
                        placeholderTextColor="#94A3B8"
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            <View style={styles.filterBar}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
                    {['all', 'en_attente', 'validee', 'delivree'].map((f) => (
                        <TouchableOpacity 
                            key={f} 
                            style={[styles.filterBtn, filterStatus === f && styles.filterBtnActive]}
                            onPress={() => setFilterStatus(f)}
                        >
                            <Text style={[styles.filterText, filterStatus === f && styles.filterTextActive]}>
                                {f === 'all' ? 'Toutes' : f.charAt(0).toUpperCase() + f.slice(1).replace('_', ' ')}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {loading ? (
                <ActivityIndicator color="#2563EB" style={{ marginTop: 40 }} />
            ) : (
                <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 100 }}>
                    {filteredOrdonnances.length === 0 ? (
                        <View style={styles.empty}>
                            <FileText size={48} color="#E2E8F0" />
                            <Text style={styles.emptyText}>Aucune ordonnance</Text>
                        </View>
                    ) : (
                        filteredOrdonnances.map((ord, idx) => {
                            const config = getStatusConfig(ord.statut);
                            return (
                                <MotiView 
                                    key={ord.id}
                                    from={{ opacity: 0, translateY: 10 }}
                                    animate={{ opacity: 1, translateY: 0 }}
                                    transition={{ delay: idx * 50 }}
                                    style={styles.card}
                                >
                                    <View style={styles.cardHeader}>
                                        <View>
                                            <Text style={styles.ordNum}>PRESCRIPTION #{ord.numero}</Text>
                                            <View style={styles.metaRow}>
                                                <Calendar size={12} color="#94A3B8" />
                                                <Text style={styles.metaText}>{ord.date}</Text>
                                            </View>
                                        </View>
                                        <View style={[styles.badge, { backgroundColor: config.bgColor }]}>
                                            <Text style={[styles.badgeText, { color: config.color }]}>{config.label}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.divider} />

                                    <View style={styles.peopleGrid}>
                                        <View style={styles.person}>
                                            <User size={14} color="#6366F1" />
                                            <View style={{ marginLeft: 8 }}>
                                                <Text style={styles.pLabel}>PATIENT</Text>
                                                <Text style={styles.pName}>{ord.patient}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.person}>
                                            <User size={14} color="#64748B" />
                                            <View style={{ marginLeft: 8 }}>
                                                <Text style={styles.pLabel}>MÉDECIN</Text>
                                                <Text style={styles.pName}>{ord.medecin}</Text>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={styles.medBox}>
                                        <Text style={styles.medCount}>{ord.medicaments.length} MÉDICAMENTS</Text>
                                        {ord.medicaments.slice(0, 2).map((m, i) => (
                                            <Text key={i} style={styles.medLine}>• {m.nom} ({m.quantite}u)</Text>
                                        ))}
                                        {ord.medicaments.length > 2 && <Text style={styles.moreText}>+ {ord.medicaments.length - 2} autres...</Text>}
                                    </View>

                                    <TouchableOpacity style={styles.detailBtn}>
                                        <Text style={styles.detailBtnText}>Voir le dossier complet</Text>
                                        <ChevronRight size={16} color="#2563EB" />
                                    </TouchableOpacity>
                                </MotiView>
                            );
                        })
                    )}
                </ScrollView>
            )}

            {/* Add Button */}
            <TouchableOpacity style={styles.fab} onPress={() => setShowAddModal(true)}>
                <Plus size={24} color="#fff" />
            </TouchableOpacity>

            {/* Modal Ajouter Ordonnance */}
            <Modal
                visible={showAddModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowAddModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Nouvelle Ordonnance</Text>
                            <TouchableOpacity onPress={() => setShowAddModal(false)}>
                                <XCircle size={24} color="#374151" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalForm}>
                            <Text style={styles.inputLabel}>Numéro d'Ordonnance *</Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="Ex: ORD-2024-001"
                                value={newOrdonnance.numero_ordonnance}
                                onChangeText={(val) => setNewOrdonnance({ ...newOrdonnance, numero_ordonnance: val })}
                            />

                            <Text style={styles.inputLabel}>Patient *</Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="Nom du patient"
                                value={newOrdonnance.patient_nom}
                                onChangeText={(val) => setNewOrdonnance({ ...newOrdonnance, patient_nom: val })}
                            />

                            <Text style={styles.inputLabel}>Médecin prescripteur *</Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="Nom du médecin"
                                value={newOrdonnance.medecin_nom}
                                onChangeText={(val) => setNewOrdonnance({ ...newOrdonnance, medecin_nom: val })}
                            />

                            <View style={styles.separator} />
                            <Text style={styles.medicamentsTitle}>Médicaments prescrits *</Text>

                            {newOrdonnance.lignes.map((l, idx) => (
                                <View key={idx} style={styles.ligneItem}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.ligneMed}>{l.medicament_nom}</Text>
                                        <Text style={styles.ligneDetails}>Qte: {l.quantite} | {l.posologie}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => handleRemoveLigne(idx)}>
                                        <XCircle size={20} color="#EF4444" />
                                    </TouchableOpacity>
                                </View>
                            ))}

                            <View style={styles.addLigneForm}>
                                <Text style={styles.inputLabel}>Ajouter un médicament</Text>
                                <ScrollView horizontal style={{ marginBottom: 10 }} showsHorizontalScrollIndicator={false}>
                                    {medicamentsList.slice(0, 10).map(m => (
                                        <TouchableOpacity
                                            key={m.id}
                                            style={[styles.miniMedBadge, tempLigne.medicament_id == m.id && styles.activeMiniMedBadge]}
                                            onPress={() => setTempLigne({ ...tempLigne, medicament_id: m.id })}
                                        >
                                            <Text style={[styles.miniMedText, tempLigne.medicament_id == m.id && styles.activeMiniMedText]}>{m.nom}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>

                                <View style={styles.inputRow}>
                                    <TextInput
                                        style={[styles.modalInput, { flex: 1, marginRight: 10 }]}
                                        placeholder="Qte"
                                        keyboardType="numeric"
                                        value={tempLigne.quantite}
                                        onChangeText={(val) => setTempLigne({ ...tempLigne, quantite: val })}
                                    />
                                    <TextInput
                                        style={[styles.modalInput, { flex: 3 }]}
                                        placeholder="Posologie (ex: 1/jour)"
                                        value={tempLigne.posologie}
                                        onChangeText={(val) => setTempLigne({ ...tempLigne, posologie: val })}
                                    />
                                </View>
                                <TouchableOpacity style={styles.addLigneButton} onPress={handleAddLigne}>
                                    <Plus size={16} color="#10B981" />
                                    <Text style={styles.addLigneButtonText}>Ajouter la ligne</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={handleSubmitOrdonnance}
                            >
                                <Text style={styles.submitButtonText}>Enregistrer l'Ordonnance</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 24,
        width: 60,
        height: 60,
        borderRadius: 20,
        backgroundColor: '#2563EB',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#2563EB',
        shadowOpacity: 0.4,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
    },
    searchWrapper: { padding: 20 },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 54,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
    },
    searchInput: { flex: 1, marginLeft: 12, fontSize: 15, fontWeight: '600', color: '#1E2937' },
    filterBar: { marginBottom: 15 },
    filterBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, marginRight: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#F1F5F9' },
    filterBtnActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
    filterText: { fontSize: 13, color: '#64748B', fontWeight: '700' },
    filterTextActive: { color: '#fff' },
    scroll: { flex: 1, paddingHorizontal: 20 },
    card: { backgroundColor: '#fff', borderRadius: 24, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#F1F5F9', elevation: 2, shadowColor: '#000', shadowOpacity: 0.02 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    ordNum: { fontSize: 15, fontWeight: '900', color: '#1E2937', letterSpacing: -0.5 },
    metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 6 },
    metaText: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    badgeText: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
    divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 15 },
    peopleGrid: { flexDirection: 'row', gap: 20, marginBottom: 15 },
    person: { flex: 1, flexDirection: 'row', alignItems: 'center' },
    pLabel: { fontSize: 9, color: '#94A3B8', fontWeight: '800' },
    pName: { fontSize: 14, fontWeight: '700', color: '#334155' },
    medBox: { backgroundColor: '#F8FAFC', borderRadius: 16, padding: 12 },
    medCount: { fontSize: 10, color: '#64748B', fontWeight: '900', marginBottom: 6 },
    medLine: { fontSize: 13, color: '#475569', fontWeight: '600', marginBottom: 2 },
    moreText: { fontSize: 11, color: '#94A3B8', fontWeight: '600', marginTop: 4 },
    detailBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 15, gap: 5 },
    detailBtnText: { fontSize: 13, color: '#2563EB', fontWeight: '800' },
    empty: { padding: 40, alignItems: 'center' },
    emptyText: { marginTop: 12, color: '#94A3B8', fontWeight: '700' },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#10B981',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        maxHeight: '90%',
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        paddingBottom: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    modalForm: {
        flex: 0,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
        marginTop: 10,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        color: '#1F2937',
        backgroundColor: '#F9FAFB',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    ligneItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        padding: 10,
        borderRadius: 8,
        marginBottom: 5,
    },
    ligneMed: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#1F2937',
    },
    ligneDetails: {
        fontSize: 12,
        color: '#6B7280',
    },
    addLigneForm: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 12,
        marginTop: 15,
        backgroundColor: '#FCFCFC',
    },
    addLigneButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        borderWidth: 1,
        borderColor: '#10B981',
        borderRadius: 8,
        marginTop: 10,
    },
    addLigneButtonText: {
        color: '#10B981',
        fontWeight: 'bold',
        marginLeft: 5,
    },
    miniMedBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        backgroundColor: '#E5E7EB',
        marginRight: 8,
    },
    activeMiniMedBadge: {
        backgroundColor: '#10B981',
    },
    miniMedText: {
        fontSize: 12,
        color: '#4B5563',
    },
    activeMiniMedText: {
        color: 'white',
        fontWeight: 'bold',
    },
    submitButton: {
        backgroundColor: '#10B981',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 10,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default OrdonnancesPage;
