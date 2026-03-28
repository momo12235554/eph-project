import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Plus, Search, Edit2, Trash2, Package, Hash, Tag, DollarSign, Calendar, ChevronRight, X } from 'lucide-react-native';
import { MotiView, MotiText } from 'moti';
import { useMedicaments } from '@/src/hooks/useMedicaments';

const { width } = Dimensions.get("window");

const GestionDesMedicaments = () => {
  const { medicaments, isLoading, error, loadMedicaments, addMedicament, updateMedicament, deleteMedicament: removeMedicament } = useMedicaments();
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [newMedicament, setNewMedicament] = useState({
    nom: "",
    code: "",
    codeBarre: "",
    lot: "",
    prix: "",
    quantite: "",
    categorie: "",
    dateExpiration: "",
  });

  useEffect(() => {
    loadMedicaments();
  }, []);

  const validateFields = () => {
    return Object.values(newMedicament).every((val) => val !== "");
  };

  const saveMedicament = async () => {
    if (!validateFields()) {
      setErrorMessage("Tous les champs sont requis !");
      return;
    }

    try {
      let success = false;
      if (editIndex !== null) {
        const medicamentToEdit = medicaments[editIndex];
        success = await updateMedicament({ id: medicamentToEdit.id, ...newMedicament });
      } else {
        success = await addMedicament(newMedicament);
      }

      if (success) {
        setModalVisible(false);
        setEditIndex(null);
        setErrorMessage("");
        loadMedicaments();
      } else {
        setErrorMessage(error || "Erreur lors de l'enregistrement");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMedicament = async (index) => {
    Alert.alert(
      "Confirmation",
      "Supprimer ce médicament de l'inventaire ?",
      [
        { text: "Non", style: "cancel" },
        {
          text: "Oui, supprimer",
          style: "destructive",
          onPress: async () => {
            const medicamentToDelete = medicaments[index];
            await removeMedicament(medicamentToDelete.id);
          },
        },
      ]
    );
  };

  const editMedicament = (index) => {
    setNewMedicament({ ...medicaments[index] });
    setEditIndex(index);
    setErrorMessage("");
    setModalVisible(true);
  };

  const filteredMedicaments = medicaments.filter((medicament) =>
    medicament.code?.toLowerCase().includes(search.toLowerCase()) ||
    medicament.nom?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MotiText 
          from={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={styles.headerTitle}
        >
          Inventaire Médical
        </MotiText>
        <TouchableOpacity 
          style={styles.headerAddBtn}
          onPress={() => {
            setNewMedicament({ nom: "", code: "", codeBarre: "", lot: "", prix: "", quantite: "", categorie: "", dateExpiration: "" });
            setEditIndex(null);
            setModalVisible(true);
          }}
        >
          <Plus color="#fff" size={20} />
          <Text style={styles.headerAddBtnText}>Ajouter</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrapper}>
        <View style={styles.searchBox}>
          <Search color="#94A3B8" size={18} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un produit..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#10B981" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {filteredMedicaments.length === 0 ? (
            <View style={styles.empty}>
              <Package size={48} color="#E2E8F0" />
              <Text style={styles.emptyText}>Aucun produit trouvé</Text>
            </View>
          ) : (
            filteredMedicaments.map((med, index) => (
              <MotiView 
                key={med.id}
                from={{ opacity: 0, translateY: 15 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: index * 50 }}
                style={styles.card}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.iconBox}>
                    <Package color="#10B981" size={20} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.medName}>{med.nom}</Text>
                    <Text style={styles.medCode}>REF: {med.code}</Text>
                  </View>
                  <View style={styles.priceBadge}>
                    <Text style={styles.priceText}>{med.prix} DA</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoGrid}>
                  <InfoItem icon={<Hash size={12} color="#64748B" />} label="LOT" value={med.lot} />
                  <InfoItem icon={<Tag size={12} color="#64748B" />} label="CAT" value={med.categorie} />
                  <InfoItem icon={<Calendar size={12} color="#64748B" />} label="EXP" value={med.dateExpiration} />
                </View>

                <View style={styles.cardFooter}>
                  <View style={styles.stockBox}>
                    <Text style={styles.stockLabel}>STOCK DISPONIBLE</Text>
                    <Text style={[styles.stockValue, parseInt(med.quantite) < 10 && { color: '#EF4444' }]}>
                      {med.quantite} unités
                    </Text>
                  </View>
                  <View style={styles.actions}>
                    <TouchableOpacity onPress={() => editMedicament(index)} style={styles.actionBtn}>
                      <Edit2 size={16} color="#6366F1" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteMedicament(index)} style={[styles.actionBtn, { backgroundColor: '#FEF2F2' }]}>
                      <Trash2 size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
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
                {editIndex !== null ? "Modifier Médicament" : "Nouveau Médicament"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <X color="#64748B" size={20} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.form}>
                <FormInput label="Nom du produit" value={newMedicament.nom} onChange={(t) => setNewMedicament({...newMedicament, nom: t})} placeholder="Paracétamol..." />
                <View style={styles.row}>
                  <FormInput label="Code" value={newMedicament.code} onChange={(t) => setNewMedicament({...newMedicament, code: t})} placeholder="PRC-01" flex={1} />
                  <FormInput label="Numéro de Lot" value={newMedicament.lot} onChange={(t) => setNewMedicament({...newMedicament, lot: t})} placeholder="L-2024" flex={1} />
                </View>
                <FormInput label="Code Barre" value={newMedicament.codeBarre} onChange={(t) => setNewMedicament({...newMedicament, codeBarre: t})} placeholder="613..." />
                <View style={styles.row}>
                  <FormInput label="Prix (DA)" value={newMedicament.prix} onChange={(t) => setNewMedicament({...newMedicament, prix: t})} placeholder="0.00" keyboard="numeric" flex={1} />
                  <FormInput label="Quantité" value={newMedicament.quantite} onChange={(t) => setNewMedicament({...newMedicament, quantite: t})} placeholder="0" keyboard="numeric" flex={1} />
                </View>
                <FormInput label="Catégorie" value={newMedicament.categorie} onChange={(t) => setNewMedicament({...newMedicament, categorie: t})} placeholder="Analgésique..." />
                <FormInput label="Expiration (YYYY-MM-DD)" value={newMedicament.dateExpiration} onChange={(t) => setNewMedicament({...newMedicament, dateExpiration: t})} placeholder="2026-12-31" />
                
                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                <TouchableOpacity style={styles.saveBtn} onPress={saveMedicament}>
                  <Text style={styles.saveBtnText}>
                    {editIndex !== null ? "Mettre à jour" : "Enregistrer le produit"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <View style={styles.infoItem}>
    <View style={styles.infoLabelRow}>
      {icon}
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
    <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
  </View>
);

const FormInput = ({ label, value, onChange, placeholder, keyboard = "default", flex }) => (
  <View style={[styles.inputGroup, flex && { flex, marginHorizontal: 5 }]}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor="#94A3B8"
      keyboardType={keyboard}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, marginBottom: 15 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#1E2937', letterSpacing: -0.5 },
  headerAddBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#10B981', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, gap: 6 },
  headerAddBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  searchWrapper: { paddingHorizontal: 20, marginBottom: 20 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 16, height: 50, borderWidth: 1, borderColor: '#F1F5F9' },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 15, fontWeight: '600', color: '#1E2937' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { marginTop: 12, color: '#94A3B8', fontWeight: '600' },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#F1F5F9', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05 },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#ECFDF5', justifyContent: 'center', alignItems: 'center' },
  medName: { fontSize: 16, fontWeight: '800', color: '#1E2937' },
  medCode: { fontSize: 11, color: '#94A3B8', fontWeight: '700', marginTop: 2 },
  priceBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: '#F8FAFC' },
  priceText: { fontSize: 14, fontWeight: '800', color: '#059669' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 15 },
  infoGrid: { flexDirection: 'row', gap: 15 },
  infoItem: { flex: 1 },
  infoLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  infoLabel: { fontSize: 9, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase' },
  infoValue: { fontSize: 12, fontWeight: '700', color: '#334155' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 16 },
  stockBox: { flex: 1 },
  stockLabel: { fontSize: 9, fontWeight: '800', color: '#94A3B8' },
  stockValue: { fontSize: 14, fontWeight: '800', color: '#1E2937' },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },
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
  saveBtn: { backgroundColor: '#10B981', padding: 16, borderRadius: 16, alignItems: 'center', marginTop: 10, marginBottom: 20 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  errorText: { color: '#EF4444', fontSize: 13, fontWeight: '600', textAlign: 'center' },
});

export default GestionDesMedicaments;
