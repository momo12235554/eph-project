import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
  Alert,
  ActivityIndicator
} from "react-native";
import { Plus, Search, FileText, User, Calendar, Edit2, Trash2, X, ChevronRight, Hash } from 'lucide-react-native';
import { MotiView, MotiText } from 'moti';
import { apiClient } from '../../src/services/apiClient';

const { width } = Dimensions.get("window");

const GestionDesOrdonnances = () => {
  const [ordonnances, setOrdonnances] = useState([]);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newOrdonnance, setNewOrdonnance] = useState({
    numero_ordonnance: "",
    patient_nom: "",
    patient_prenom: "",
    medecin_nom: "",
    date_prescription: new Date().toISOString().split('T')[0],
    statut: "en_attente"
  });
  const [errorMessage, setErrorMessage] = useState("");

  const fetchOrdonnances = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/ordonnances');
      setOrdonnances(response.data.data || response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdonnances();
  }, []);

  const saveOrdonnance = async () => {
    if (!newOrdonnance.numero_ordonnance || !newOrdonnance.patient_nom || !newOrdonnance.medecin_nom) {
      setErrorMessage("Champs obligatoires manquants !");
      return;
    }

    try {
      if (editIndex !== null) {
        const id = ordonnances[editIndex].id;
        await apiClient.put(`/ordonnances/${id}`, newOrdonnance);
      } else {
        await apiClient.post('/ordonnances', newOrdonnance);
      }
      fetchOrdonnances();
      setModalVisible(false);
      resetForm();
    } catch (error) {
      setErrorMessage("Erreur de sauvegarde.");
    }
  };

  const deleteOrdonnance = async (index) => {
    Alert.alert("Suppression", "Voulez-vous supprimer cette ordonnance ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          const id = ordonnances[index].id;
          try {
            await apiClient.delete(`/ordonnances/${id}`);
            fetchOrdonnances();
          } catch (error) {
            console.error(error);
          }
        }
      }
    ]);
  };

  const startEditOrdonnance = (index) => {
    setNewOrdonnance(ordonnances[index]);
    setEditIndex(index);
    setModalVisible(true);
  };

  const resetForm = () => {
    setNewOrdonnance({
      numero_ordonnance: "",
      patient_nom: "",
      patient_prenom: "",
      medecin_nom: "",
      date_prescription: new Date().toISOString().split('T')[0],
      statut: "en_attente"
    });
    setEditIndex(null);
    setErrorMessage("");
  };

  const filteredOrdonnances = Array.isArray(ordonnances) ? ordonnances.filter((ord) =>
    (ord.patient_nom && ord.patient_nom.toLowerCase().includes(search.toLowerCase())) ||
    (ord.numero_ordonnance && ord.numero_ordonnance.includes(search))
  ) : [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MotiText 
          from={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={styles.headerTitle}
        >
          Régistre Ordonnances
        </MotiText>
        <TouchableOpacity 
          style={styles.headerAddBtn}
          onPress={() => {
            resetForm();
            setModalVisible(true);
          }}
        >
          <Plus color="#fff" size={20} />
          <Text style={styles.headerAddBtnText}>Nouvelle</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrapper}>
        <View style={styles.searchBox}>
          <Search color="#94A3B8" size={18} />
          <TextInput
            style={styles.searchInput}
            placeholder="Nom patient ou numéro..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#6366F1" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {filteredOrdonnances.length === 0 ? (
            <View style={styles.empty}>
              <FileText size={48} color="#E2E8F0" />
              <Text style={styles.emptyText}>Aucune ordonnance</Text>
            </View>
          ) : (
            filteredOrdonnances.map((ord, idx) => (
              <MotiView 
                key={ord.id || idx}
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 50 }}
                style={styles.card}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.iconBox}>
                    <FileText color="#6366F1" size={20} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.ordNum}>#{ord.numero_ordonnance}</Text>
                    <View style={styles.dateRow}>
                      <Calendar size={10} color="#94A3B8" />
                      <Text style={styles.dateText}>{ord.date_prescription}</Text>
                    </View>
                  </View>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{ord.statut?.replace('_', ' ')}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <View style={styles.personInfo}>
                    <User size={14} color="#64748B" />
                    <View style={{ marginLeft: 8 }}>
                      <Text style={styles.infoLabel}>PATIENT</Text>
                      <Text style={styles.infoValue}>{ord.patient_nom} {ord.patient_prenom}</Text>
                    </View>
                  </View>
                </View>

                <View style={[styles.infoRow, { marginTop: 12 }]}>
                  <View style={styles.personInfo}>
                    <User size={14} color="#94A3B8" />
                    <View style={{ marginLeft: 8 }}>
                      <Text style={styles.infoLabel}>MÉDECIN</Text>
                      <Text style={styles.infoValue}>{ord.medecin_nom}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.cardActions}>
                  <TouchableOpacity onPress={() => startEditOrdonnance(idx)} style={styles.actionBtn}>
                    <Edit2 size={16} color="#6366F1" />
                    <Text style={styles.actionBtnText}>Modifier</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteOrdonnance(idx)} style={[styles.actionBtn, { backgroundColor: '#FEF2F2' }]}>
                    <Trash2 size={16} color="#EF4444" />
                    <Text style={[styles.actionBtnText, { color: '#EF4444' }]}>Supprimer</Text>
                  </TouchableOpacity>
                </View>
              </MotiView>
            ))
          )}
        </ScrollView>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editIndex !== null ? "Édition Ordonnance" : "Saisie Ordonnance"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <X color="#64748B" size={20} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.form}>
                <FormInput label="Numéro Ordonnance" value={newOrdonnance.numero_ordonnance} onChange={(t) => setNewOrdonnance({...newOrdonnance, numero_ordonnance: t})} placeholder="ORD-2024-XXX" />
                <View style={styles.row}>
                  <FormInput label="Nom Patient" value={newOrdonnance.patient_nom} onChange={(t) => setNewOrdonnance({...newOrdonnance, patient_nom: t})} placeholder="Nom" flex={1} />
                  <FormInput label="Prénom Patient" value={newOrdonnance.patient_prenom} onChange={(t) => setNewOrdonnance({...newOrdonnance, patient_prenom: t})} placeholder="Prénom" flex={1} />
                </View>
                <FormInput label="Nom Médecin" value={newOrdonnance.medecin_nom} onChange={(t) => setNewOrdonnance({...newOrdonnance, medecin_nom: t})} placeholder="Dr. ..." />
                <FormInput label="Date Prescription" value={newOrdonnance.date_prescription} onChange={(t) => setNewOrdonnance({...newOrdonnance, date_prescription: t})} placeholder="YYYY-MM-DD" />
                
                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                <TouchableOpacity style={styles.saveBtn} onPress={saveOrdonnance}>
                  <Text style={styles.saveBtnText}>Enregistrer</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const FormInput = ({ label, value, onChange, placeholder, flex }) => (
  <View style={[styles.inputGroup, flex && { flex, marginHorizontal: 5 }]}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor="#94A3B8"
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, marginBottom: 15 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#1E2937', letterSpacing: -0.5 },
  headerAddBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#6366F1', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, gap: 6 },
  headerAddBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  searchWrapper: { paddingHorizontal: 20, marginBottom: 20 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 16, height: 50, borderWidth: 1, borderColor: '#F1F5F9' },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 15, fontWeight: '600', color: '#1E2937' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { marginTop: 12, color: '#94A3B8', fontWeight: '600' },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#F1F5F9', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05 },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },
  ordNum: { fontSize: 16, fontWeight: '800', color: '#1E2937' },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  dateText: { fontSize: 10, color: '#94A3B8', fontWeight: '700' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, backgroundColor: '#F8FAFC' },
  statusText: { fontSize: 10, fontWeight: '800', color: '#6366F1', textTransform: 'uppercase' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 15 },
  infoRow: { flexDirection: 'row' },
  personInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  infoLabel: { fontSize: 8, fontWeight: '800', color: '#94A3B8' },
  infoValue: { fontSize: 14, fontWeight: '700', color: '#334155', marginTop: 1 },
  cardActions: { flexDirection: 'row', marginTop: 20, gap: 10 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#F5F7FF', paddingVertical: 10, borderRadius: 12 },
  actionBtnText: { fontSize: 13, fontWeight: '700', color: '#6366F1' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '900', color: '#1E2937' },
  closeBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  form: { gap: 12 },
  row: { flexDirection: 'row', marginHorizontal: -5 },
  inputGroup: { marginBottom: 12 },
  label: { fontSize: 13, fontWeight: '700', color: '#475569', marginBottom: 8 },
  input: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 12, fontSize: 15, fontWeight: '600', color: '#1E2937', borderWidth: 1, borderColor: '#F1F5F9' },
  saveBtn: { backgroundColor: '#6366F1', padding: 16, borderRadius: 16, alignItems: 'center', marginTop: 10, marginBottom: 20 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  errorText: { color: '#EF4444', fontSize: 13, fontWeight: '600', textAlign: 'center' },
});

export default GestionDesOrdonnances;
