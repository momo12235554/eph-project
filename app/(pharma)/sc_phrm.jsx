import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal,
  Dimensions,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {
  Bell,
  Menu,
  User,
  Search,
  AlertTriangle,
  Plus,
  Box,
  ClipboardList,
  LogOut,
  Save,
  X,
  Stethoscope,
  ChevronRight,
  TrendingDown,
  Info,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MotiView, MotiText } from 'moti';
import { useRouter } from 'expo-router';
import OrdonnancesPage from '../(admin)/ordonnances_page';
import AlertesPage from '../(admin)/alertes_page';
import { useMedicaments } from '@/src/hooks/useMedicaments';
import { useAuthContext } from '@/src/hooks/AuthContext';
import { useDashboard } from '@/src/hooks/useDashboard';

const { width } = Dimensions.get('window');

const PharmacienDashboard = () => {
  const router = useRouter();
  const { user, logout } = useAuthContext();
  const [activeTab, setActiveTab] = useState('Stock');
  const [showMenuModal, setShowMenuModal] = useState(false);
  const { medicaments, isLoading: loading, loadMedicaments, updateQuantity, addMedicament } = useMedicaments();
  const { stats, alertes, loadDashboard } = useDashboard();
  const [searchQuery, setSearchQuery] = useState('');
  
  const [editingItem, setEditingItem] = useState(null);
  const [editQuantity, setEditQuantity] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [newMed, setNewMed] = useState({
    nom: '',
    lot: '',
    quantite: '',
    date_expiration: '',
    categorie: ''
  });

  const pharmacien = user || {
    nom: 'BENAMEUR',
    prenom: 'Iness',
    email: 'iness.benameur@chu.dz'
  };

  const handleEditQuantity = (item) => {
    setEditingItem(item);
    setEditQuantity(item.qty.toString());
  };

  const handleSaveQuantity = async () => {
    if (!editingItem) return;

    const newQuantity = parseInt(editQuantity);
    if (isNaN(newQuantity) || newQuantity < 0) {
      Alert.alert('Erreur', 'Veuillez entrer une quantité valide');
      return;
    }

    const success = await updateQuantity(editingItem.id, newQuantity);
    if (success) {
      setEditingItem(null);
      setEditQuantity('');
      loadMedicaments();
    } else {
      Alert.alert('Erreur', 'Impossible de mettre à jour la quantité');
    }
  };

  const handleAddMedicament = async () => {
    if (!newMed.nom || !newMed.lot || !newMed.quantite || !newMed.date_expiration) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    const success = await addMedicament({
      ...newMed,
      quantite: parseInt(newMed.quantite)
    });

    if (success) {
      setShowAddModal(false);
      setNewMed({ nom: '', lot: '', quantite: '', date_expiration: '', categorie: '' });
      Alert.alert('Succès', 'Médicament ajouté au stock');
      loadMedicaments();
    } else {
      Alert.alert('Erreur', "Échec de l'ajout du médicament.");
    }
  };

  useEffect(() => {
    loadMedicaments();
    loadDashboard();
  }, []);

  const stockItems = medicaments.map(med => ({
    id: med.id,
    name: med.nom,
    lot: med.lot || 'N/A',
    qty: parseInt(med.quantite || 0),
    expire: med.date_expiration,
    status: parseInt(med.quantite || 0) < 10 ? 'Bas' : 'Normal',
    categorie: med.categorie
  }));

  const filteredStockItems = stockItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.lot.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockCount = stats.stock_faible || 0;

  const renderStockPage = () => (
    <ScrollView style={styles.contentScroll} contentContainerStyle={{ paddingBottom: 120, paddingTop: 60 }} showsVerticalScrollIndicator={false}>
      {/* Stats Cards Row */}
      <View style={styles.statsGrid}>
        <StatCard label="Alertes" value={stats.alertes_active || 0} color="#FEF2F2" icon={<AlertTriangle size={16} color="#EF4444" />} />
        <StatCard label="Stock Bas" value={stats.stock_faible || 0} color="#FFFBEB" icon={<TrendingDown size={16} color="#F59E0B" />} />
        <StatCard label="Commandes" value={stats.commandes_en_attente || 0} color="#F0FDF4" icon={<ClipboardList size={16} color="#10B981" />} />
      </View>

      {/* Alert Banner Premium */}
      {lowStockCount > 0 && (
        <MotiView 
          from={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          style={styles.alertBannerWrapper}
        >
          <TouchableOpacity style={styles.alertBanner} onPress={() => setActiveTab('Alertes')}>
            <LinearGradient colors={['#FEF2F2', '#FFF5F5']} style={styles.alertGradient}>
              <View style={styles.alertIconCircle}>
                <AlertTriangle color="#EF4444" size={20} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.alertTitle}>Appel à Vigilance</Text>
                <Text style={styles.alertMsg}>{lowStockCount} produits en rupture imminente</Text>
              </View>
              <ChevronRight size={18} color="#EF4444" />
            </LinearGradient>
          </TouchableOpacity>
        </MotiView>
      )}

      {/* Role Indicator Segment */}
      <View style={styles.roleTabsContainer}>
        <View style={styles.roleTabs}>
          {['Admin', 'Pharmacien', 'Fournisseur'].map((tab) => (
            <View key={tab} style={[styles.roleTab, tab === 'Pharmacien' && styles.roleTabActive]}>
              <Text style={[styles.roleTabText, tab === 'Pharmacien' && styles.roleTabTextActive]}>{tab}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Inventaire Actuel</Text>
        <TouchableOpacity style={styles.addCircleBtn} onPress={() => setShowAddModal(true)}>
          <Plus size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Stock List */}
      {loading ? (
        <ActivityIndicator color="#10B981" size="large" style={{ marginTop: 40 }} />
      ) : filteredStockItems.length === 0 ? (
        <View style={styles.emptyCard}>
          <Box size={40} color="#E2E8F0" />
          <Text style={styles.emptyText}>Stock Vide</Text>
        </View>
      ) : (
        filteredStockItems.map((item, index) => (
          <MotiView 
            key={item.id} 
            from={{ opacity: 0, translateY: 20 }} 
            animate={{ opacity: 1, translateY: 0 }} 
            transition={{ delay: index * 50 }}
            style={styles.stockCard}
          >
            <View style={styles.cardHeader}>
              <View style={styles.nameBlock}>
                <Text style={styles.stockName}>{item.name}</Text>
                <Text style={styles.lotCode}>LOT: {item.lot}</Text>
              </View>
              {item.status === 'Bas' && (
                <View style={styles.criticalBadge}>
                  <Text style={styles.criticalText}>Critique</Text>
                </View>
              )}
            </View>

            <View style={styles.cardDivider} />

            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>QUANTITÉ</Text>
                {editingItem?.id === item.id ? (
                  <View style={styles.editRow}>
                    <TextInput
                      style={styles.inlineInput}
                      value={editQuantity}
                      onChangeText={setEditQuantity}
                      keyboardType="numeric"
                      autoFocus
                    />
                    <TouchableOpacity onPress={handleSaveQuantity} style={styles.smallActionBtn}>
                      <Save size={16} color="#10B981" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text style={[styles.qtyValue, item.qty < 10 && { color: '#EF4444' }]}>{item.qty} unités</Text>
                )}
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>EXPIRATION</Text>
                <Text style={styles.dateValue}>{item.expire}</Text>
              </View>
              {editingItem?.id !== item.id && (
                <TouchableOpacity onPress={() => handleEditQuantity(item)} style={styles.editLink}>
                  <Text style={styles.editLinkText}>AJUSTER</Text>
                </TouchableOpacity>
              )}
            </View>
          </MotiView>
        ))
      )}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Premium Emerald Header */}
      <LinearGradient colors={['#065F46', '#059669', '#10B981']} style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerNav}>
            <TouchableOpacity style={styles.headerBtn} onPress={() => setShowMenuModal(true)}>
              <Menu color="#fff" size={22} />
            </TouchableOpacity>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.headerBtn} onPress={() => setActiveTab('Alertes')}>
                <Bell color="#fff" size={22} />
                {lowStockCount > 0 && <View style={styles.notificationDot} />}
              </TouchableOpacity>
              <TouchableOpacity style={[styles.headerBtn, { marginLeft: 12 }]} onPress={logout}>
                <LogOut color="#fff" size={20} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.profileBox}>
            <View style={styles.avatarCircle}>
              <LinearGradient colors={['#fff', '#ECFDF5']} style={styles.avatarGrad}>
                <Stethoscope color="#059669" size={28} />
              </LinearGradient>
            </View>
            <View>
              <Text style={styles.roleLabel}>Pharmacien Responsable</Text>
              <Text style={styles.doctorName}>Dr. {pharmacien.prenom} {pharmacien.nom}</Text>
            </View>
          </View>

          {/* Glass Search Bar */}
          <BlurView intensity={20} tint="light" style={styles.searchBlur}>
            <Search color="#fff" size={18} />
            <TextInput
              placeholder="Rechercher une référence..."
              placeholderTextColor="rgba(255,255,255,0.7)"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </BlurView>
        </SafeAreaView>
      </LinearGradient>

      {/* Main Content Area */}
      <View style={{ flex: 1 }}>
        {activeTab === 'Stock' && renderStockPage()}
        {activeTab === 'Ordonnances' && <OrdonnancesPage />}
        {activeTab === 'Alertes' && <AlertesPage />}
      </View>

      {/* Bottom Navigation High-End */}
      <View style={styles.bottomNav}>
        <NavItem tab="Stock" icon={<Box size={22} />} active={activeTab === 'Stock'} onPress={() => setActiveTab('Stock')} />
        <NavItem tab="Ordonnances" icon={<ClipboardList size={22} />} active={activeTab === 'Ordonnances'} onPress={() => setActiveTab('Ordonnances')} />
        <NavItem tab="Alertes" icon={<AlertTriangle size={22} />} active={activeTab === 'Alertes'} onPress={() => setActiveTab('Alertes')} />
      </View>

      {/* Modal Modernisé */}
      <Modal visible={showAddModal} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
          <MotiView from={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nouveau Produit</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)} style={styles.modalCloseBtn}>
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <ModalInput label="Désignation" placeholder="Nom du médicament" value={newMed.nom} onChange={(v) => setNewMed({...newMed, nom: v})} />
              <ModalInput label="Code Lot" placeholder="Ex: LOT-2024" value={newMed.lot} onChange={(v) => setNewMed({...newMed, lot: v})} />
              
              <View style={styles.modalRow}>
                <View style={{ flex: 1 }}>
                  <ModalInput label="Quantité" placeholder="0" keyboard="numeric" value={newMed.quantite} onChange={(v) => setNewMed({...newMed, quantite: v})} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <ModalInput label="Catégorie" placeholder="Analgésique..." value={newMed.categorie} onChange={(v) => setNewMed({...newMed, categorie: v})} />
                </View>
              </View>

              <ModalInput label="Expiration (AAAA-MM-JJ)" placeholder="2026-01-01" value={newMed.date_expiration} onChange={(v) => setNewMed({...newMed, date_expiration: v})} />

              <TouchableOpacity style={styles.submitBtn} onPress={handleAddMedicament}>
                <LinearGradient colors={['#10B981', '#059669']} style={styles.submitGrad}>
                  <Text style={styles.submitText}>Enregistrer au Stock</Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </MotiView>
        </View>
      </Modal>
      {/* Menu Modal Premium */}
      <Modal visible={showMenuModal} animationType="fade" transparent>
        <View style={styles.menuOverlay}>
          <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
          <MotiView 
            from={{ x: -width }} 
            animate={{ x: 0 }} 
            transition={{ type: 'timing', duration: 300 }}
            style={styles.menuContent}
          >
            <SafeAreaView style={{ flex: 1 }}>
              <View style={styles.menuHeader}>
                <Text style={styles.menuTitle}>MediStock Pharma</Text>
                <TouchableOpacity onPress={() => setShowMenuModal(false)}>
                  <X color="#1E2937" size={24} />
                </TouchableOpacity>
              </View>

              <View style={styles.menuItems}>
                <MenuItem icon={<Info color="#059669" size={20} />} label="À Propos" onPress={() => { setShowMenuModal(false); router.push('/propos'); }} />
                <MenuItem icon={<Stethoscope color="#10B981" size={20} />} label="Aide Clinique" onPress={() => Alert.alert("Aide", "Contactez le service informatique pour tout support technique.")} />
                <MenuItem icon={<LogOut color="#EF4444" size={20} />} label="Déconnexion" onPress={() => { setShowMenuModal(false); logout(); }} />
              </View>

              <View style={styles.menuFooter}>
                <Text style={styles.versionText}>v2.0.0 Premium Pharma</Text>
                <Text style={styles.versionSub}>CHU Mostaganem</Text>
              </View>
            </SafeAreaView>
          </MotiView>
        </View>
      </Modal>
    </View>
  );
};

const MenuItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuIconBox}>{icon}</View>
    <Text style={styles.menuItemLabel}>{label}</Text>
    <ChevronRight size={18} color="#CBD5E1" />
  </TouchableOpacity>
);

// Internal Components
const StatCard = ({ label, value, color, icon }) => (
  <View style={[styles.statCard, { backgroundColor: color }]}>
    <View style={styles.statIcon}>{icon}</View>
    <Text style={styles.statVal}>{value}</Text>
    <Text style={styles.statLab}>{label}</Text>
  </View>
);

const NavItem = ({ tab, icon, active, onPress }) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress}>
    <View style={[styles.navIconBox, active && styles.navIconActive]}>
      {React.cloneElement(icon, { color: active ? '#10B981' : '#94A3B8' })}
    </View>
    <Text style={[styles.navText, active && styles.navTextActive]}>{tab}</Text>
  </TouchableOpacity>
);

const ModalInput = ({ label, placeholder, value, onChange, keyboard }) => (
  <View style={styles.mInputBox}>
    <Text style={styles.mLabel}>{label}</Text>
    <TextInput
      style={styles.mInput}
      placeholder={placeholder}
      placeholderTextColor="#94A3B8"
      value={value}
      onChangeText={onChange}
      keyboardType={keyboard || 'default'}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 25,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBtn: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#059669',
  },
  profileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    gap: 15,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 22,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  avatarGrad: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: '600',
  },
  doctorName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  searchBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    paddingHorizontal: 16,
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  contentScroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  statIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
    marginBottom: 10,
  },
  statVal: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1E2937',
  },
  statLab: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  alertBannerWrapper: {
    marginBottom: 20,
  },
  alertBanner: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#EF4444',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  alertGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  alertIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#991B1B',
  },
  alertMsg: {
    fontSize: 12,
    color: '#B91C1C',
    fontWeight: '600',
  },
  roleTabsContainer: {
    marginBottom: 25,
  },
  roleTabs: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    padding: 5,
    borderRadius: 18,
  },
  roleTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 14,
  },
  roleTabActive: {
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  roleTabText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '700',
  },
  roleTabTextActive: {
    color: '#059669',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#1E2937',
    letterSpacing: -0.5,
  },
  addCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#10B981',
    shadowOpacity: 0.3,
  },
  stockCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.02,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stockName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E2937',
  },
  lotCode: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '700',
    marginTop: 2,
  },
  criticalBadge: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  criticalText: {
    fontSize: 10,
    color: '#EF4444',
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 15,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 20,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '800',
    marginBottom: 4,
  },
  qtyValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E2937',
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  editLink: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F0FDF4',
    borderRadius: 10,
  },
  editLinkText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '900',
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inlineInput: {
    width: 50,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#10B981',
    padding: 5,
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
  },
  smallActionBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    elevation: 20,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIconBox: {
    padding: 8,
    borderRadius: 14,
  },
  navIconActive: {
    backgroundColor: '#ECFDF5',
  },
  navText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
    fontWeight: '700',
  },
  navTextActive: {
    color: '#10B981',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 24,
    elevation: 25,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1E2937',
    letterSpacing: -0.5,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mInputBox: {
    marginBottom: 18,
  },
  mLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  mInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    padding: 16,
    fontSize: 15,
    fontWeight: '600',
    color: '#1E2937',
  },
  modalRow: {
    flexDirection: 'row',
  },
  submitBtn: {
    marginTop: 10,
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#10B981',
    shadowOpacity: 0.3,
  },
  submitGrad: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  emptyCard: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginTop: 20,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 15,
    color: '#94A3B8',
    fontWeight: '700',
  },
  // Menu Styles
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menuContent: {
    width: width * 0.8,
    height: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    borderTopRightRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 25,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 20,
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1E2937',
  },
  menuItems: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuItemLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  menuFooter: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E2937',
  },
  versionSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
  },
});

export default PharmacienDashboard;
