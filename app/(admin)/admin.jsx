import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  ActivityIndicator,
  StatusBar,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import {
  Bell,
  Menu,
  User,
  Plus,
  Box,
  Package,
  AlertTriangle,
  Home,
  ClipboardList,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Search,
  X,
  Info,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MotiView, MotiText } from 'moti';
import { useRouter } from 'expo-router';
import { useDashboard } from '@/src/hooks/useDashboard';
import { useCommandes } from '@/src/hooks/useCommandes';
import { useUsers } from '@/src/hooks/useUsers';
import { useMedicaments } from '@/src/hooks/useMedicaments';
import { useAuthContext } from '@/src/hooks/AuthContext';

const { width } = Dimensions.get('window');

const AdminDashboard = () => {
  const router = useRouter();
  const { user, logout } = useAuthContext();
  const [activeTab, setActiveTab] = useState('Admin'); 
  const [activeNav, setActiveNav] = useState('Accueil');
  const [showMenuModal, setShowMenuModal] = useState(false);

  const handleMenuPress = () => {
    setShowMenuModal(true);
  };

  const handleNotificationPress = () => {
    router.push('/(admin)/alertes_page');
  };

  const { stats, alertes, isLoading: dashLoading, loadDashboard } = useDashboard();
  const { fournisseurs, commandes, isLoading: cmdLoading, loadData: loadCommandes, createCommande } = useCommandes();
  const { users, isLoading: usersLoading, loadUsers } = useUsers();
  const { medicaments, loadMedicaments } = useMedicaments();

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [newOrder, setNewOrder] = useState({
    fournisseur_id: '',
    medicament_id: '',
    quantite: '',
    prix_unitaire: ''
  });

  useEffect(() => {
    // Garde-fou crucial : on ne charge les données sensibles (commandes, users) 
    // que si l'utilisateur est bien admin.
    if (!user || user.role !== 'admin') {
      console.warn("🔐 Accès Admin restreint - Redirection...");
      return;
    }

    loadDashboard();
    loadCommandes();
    loadUsers();
    loadMedicaments();
  }, [user]);

  const recentOrders = commandes.slice(0, 3);
  const displayUsers = users.slice(0, 3);

  const isLoading = dashLoading || cmdLoading || usersLoading;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header Premium with Gradient */}
      <LinearGradient
        colors={['#1E40AF', '#2563EB', '#3B82F6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.headerIconButton} onPress={handleMenuPress}>
              <Menu color="#fff" size={22} />
            </TouchableOpacity>
            
            <View style={styles.headerActions}>
              <View style={styles.notificationBadgeContainer}>
                <TouchableOpacity style={styles.headerIconButton} onPress={handleNotificationPress}>
                  <Bell color="#fff" size={22} />
                </TouchableOpacity>
                {(stats.notifications_count > 0 || alertes.length > 0) && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{stats.notifications_count || alertes.length}</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity style={styles.headerIconButton} onPress={logout}>
                <LogOut color="#fff" size={20} />
              </TouchableOpacity>
            </View>
          </View>

          <MotiView 
            from={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={styles.profileSection}
          >
            <View style={styles.avatarWrapper}>
              <LinearGradient
                colors={['#fff', '#E0F2FE']}
                style={styles.avatar}
              >
                <User color="#2563EB" size={28} />
              </LinearGradient>
              <View style={styles.onlineIndicator} />
            </View>
            <View>
              <Text style={styles.greeting}>Tableau de Bord</Text>
              <Text style={styles.userName}>{user ? user.nom : 'Admin'}</Text>
            </View>
          </MotiView>
        </SafeAreaView>

        {/* Floating Statistics Card */}
        <MotiView 
          from={{ opacity: 0, translateY: 40 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 800, delay: 300 }}
          style={styles.statsCardUnified}
        >
          <StatItem 
            icon={<Box color="#2563EB" size={22} />} 
            label="Médicaments" 
            value={stats.medicaments_count || 0} 
            color="#EFF6FF"
          />
          <View style={styles.statDivider} />
          <StatItem 
            icon={<AlertTriangle color="#EF4444" size={22} />} 
            label="Alertes" 
            value={stats.alertes_active || 0} 
            color="#FEF2F2"
            valueColor="#EF4444"
          />
          <View style={styles.statDivider} />
          <StatItem 
            icon={<TrendingUp color="#10B981" size={22} />} 
            label="Commandes" 
            value={commandes.length} 
            color="#ECFDF5"
            valueColor="#10B981"
          />
        </MotiView>
      </LinearGradient>

      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={{ paddingTop: 90, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrapper}>
          {/* Custom Segmented Control */}
          <MotiView 
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={styles.segmentedWrapper}
          >
            <View style={styles.segmentedContainer}>
              {['Admin', 'Pharmacien', 'Fournisseur'].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[styles.segmentTab, activeTab === tab && styles.segmentTabActive]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text style={[styles.segmentText, activeTab === tab && styles.segmentTextActive]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </MotiView>

          {isLoading ? (
            <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 60 }} />
          ) : (
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 500 }}
            >
              {activeNav === 'Accueil' && (
                <>
                  {/* Commandes Section */}
                  <SectionHeader title="Commandes Récentes" action="Voir tout" onAction={() => setActiveNav('Commandes')} />
                  {recentOrders.length > 0 ? recentOrders.map((order, index) => (
                    <OrderCard key={order.id} order={order} delay={index * 100} />
                  )) : (
                    <EmptyState message="Aucune commande récente" />
                  )}

                  {/* Équipe Section */}
                  <SectionHeader title="Équipe Médicale" action="Gérer" onAction={() => setActiveNav('Utilisateurs')} />
                  {displayUsers.length > 0 ? displayUsers.map((user, index) => (
                    <UserCard key={user.id} user={user} delay={index * 100} />
                  )) : (
                    <EmptyState message="Aucun utilisateur enregistré" />
                  )}
                </>
              )}

              {activeNav === 'Commandes' && (
                <>
                  <SectionHeader 
                    title="Historique Commandes" 
                    icon={<Plus size={18} color="#fff" />} 
                    onAction={() => setShowOrderModal(true)} 
                  />
                  {commandes.map((order, index) => (
                    <OrderCard key={order.id} order={order} full delay={index * 50} />
                  ))}
                </>
              )}

              {activeNav === 'Utilisateurs' && (
                <>
                  <SectionHeader title="Gestion Utilisateurs" icon={<Plus size={18} color="#fff" />} />
                  {users.map((u, index) => (
                    <UserCard key={u.id} user={u} full delay={index * 50} />
                  ))}
                </>
              )}
            </MotiView>
          )}
        </View>
      </ScrollView>

      {/* Modal Modernisé */}
      <Modal visible={showOrderModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
          <MotiView 
            from={{ translateY: 400 }}
            animate={{ translateY: 0 }}
            style={styles.modalCard}
          >
            <View style={styles.modalIndicator} />
            <Text style={styles.modalTitle}>Nouvelle Commande</Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <InputLabel label="Identifiant Fournisseur" />
              <TextInput 
                style={styles.modalInput} 
                placeholder="ID du fournisseur" 
                value={newOrder.fournisseur_id}
                onChangeText={(t) => setNewOrder({...newOrder, fournisseur_id: t})}
                placeholderTextColor="#9CA3AF"
              />

              <InputLabel label="Médicament" />
              <View style={styles.tagScrollContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {medicaments.slice(0, 8).map(m => (
                    <TouchableOpacity 
                      key={m.id}
                      onPress={() => setNewOrder({...newOrder, medicament_id: m.id.toString()})}
                      style={[
                        styles.medicineTag, 
                        newOrder.medicament_id == m.id && styles.medicineTagActive
                      ]}
                    >
                      <Text style={[styles.medicineTagText, newOrder.medicament_id == m.id && styles.medicineTagTextActive]}>{m.nom}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              <TextInput 
                style={styles.modalInput} 
                placeholder="Ou ID manuel" 
                value={newOrder.medicament_id}
                onChangeText={(t) => setNewOrder({...newOrder, medicament_id: t})}
                placeholderTextColor="#9CA3AF"
              />

              <View style={styles.row}>
                <View style={styles.flex1}>
                  <InputLabel label="Quantité" />
                  <TextInput 
                    style={styles.modalInput} 
                    keyboardType="numeric"
                    value={newOrder.quantite}
                    onChangeText={(t) => setNewOrder({...newOrder, quantite: t})}
                    placeholder="0"
                  />
                </View>
                <View style={styles.flex1}>
                  <InputLabel label="Prix Unit. (DA)" />
                  <TextInput 
                    style={styles.modalInput} 
                    keyboardType="numeric"
                    value={newOrder.prix_unitaire}
                    onChangeText={(t) => setNewOrder({...newOrder, prix_unitaire: t})}
                    placeholder="0.00"
                  />
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowOrderModal(false)}>
                  <Text style={styles.cancelBtnText}>Fermer</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.confirmBtn} 
                  onPress={async () => {
                    const payload = {
                      fournisseur_id: parseInt(newOrder.fournisseur_id),
                      lignes: [{
                        medicament_id: parseInt(newOrder.medicament_id),
                        quantite: parseInt(newOrder.quantite),
                        prix_unitaire: parseFloat(newOrder.prix_unitaire)
                      }]
                    };
                    const res = await createCommande(payload);
                    if(res) {
                      setShowOrderModal(false);
                      setNewOrder({fournisseur_id: '', medicament_id: '', quantite: '', prix_unitaire: ''});
                      Alert.alert('Succès', 'Commande enregistrée avec succès');
                      loadDashboard();
                    } else {
                      Alert.alert('Erreur', 'Impossible de créer la commande');
                    }
                  }}
                >
                  <LinearGradient colors={['#2563EB', '#1D4ED8']} style={styles.confirmGradient}>
                    <Text style={styles.confirmBtnText}>Commander</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
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
                <Text style={styles.menuTitle}>MediStock Admin</Text>
                <TouchableOpacity onPress={() => setShowMenuModal(false)}>
                  <X color="#1E2937" size={24} />
                </TouchableOpacity>
              </View>

              <View style={styles.menuItems}>
                <MenuItem icon={<Info color="#2563EB" size={20} />} label="À Propos" onPress={() => { setShowMenuModal(false); router.push('/propos'); }} />
                <MenuItem icon={<Package color="#10B981" size={20} />} label="Gérer Stock" onPress={() => { setShowMenuModal(false); router.push('/(admin)/gs_medicament'); }} />
                <MenuItem icon={<ClipboardList color="#F59E0B" size={20} />} label="Gérer Ordonnances" onPress={() => { setShowMenuModal(false); router.push('/(admin)/gs_ordonnance'); }} />
                <MenuItem icon={<LogOut color="#EF4444" size={20} />} label="Déconnexion" onPress={() => { setShowMenuModal(false); logout(); }} />
              </View>

              <View style={styles.menuFooter}>
                <Text style={styles.versionText}>v2.0.0 Premium Admin</Text>
                <Text style={styles.versionSub}>CHU Mostaganem</Text>
              </View>
            </SafeAreaView>
          </MotiView>
        </View>
      </Modal>

      {/* Bottom Navigation High-End */}
      <View style={styles.bottomNav}>
        <NavItem icon={<Home size={22} />} label="Accueil" active={activeNav === 'Accueil'} onPress={() => setActiveNav('Accueil')} />
        <NavItem icon={<ClipboardList size={22} />} label="Commandes" active={activeNav === 'Commandes'} onPress={() => setActiveNav('Commandes')} />
        <NavItem icon={<Users size={22} />} label="Équipe" active={activeNav === 'Utilisateurs'} onPress={() => setActiveNav('Utilisateurs')} />
      </View>
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

// Sub-components
const StatItem = ({ icon, label, value, color, valueColor }) => (
  <View style={styles.statItem}>
    <View style={[styles.statIconCircle, { backgroundColor: color }]}>
      {icon}
    </View>
    <Text style={[styles.statValue, valueColor && { color: valueColor }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const SectionHeader = ({ title, action, icon, onAction }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {action ? (
      <TouchableOpacity onPress={onAction}>
        <Text style={styles.viewAllText}>{action}</Text>
      </TouchableOpacity>
    ) : icon ? (
      <TouchableOpacity style={styles.circleActionBtn} onPress={onAction}>
        {icon}
      </TouchableOpacity>
    ) : null}
  </View>
);

const OrderCard = ({ order, delay, full }) => (
  <MotiView 
    from={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    style={styles.itemCard}
  >
    <View style={styles.cardAccent} />
    <View style={styles.itemInfo}>
      <Text style={styles.itemName} numberOfLines={1}>{order.medicament_nom || 'Commande #' + order.id}</Text>
      <Text style={styles.itemSubText}>Qté: {order.quantite || '0'} • {full ? new Date(order.created_at).toLocaleDateString() : 'Aujourd\'hui'}</Text>
      {full && <Text style={styles.itemSecondaryText}>Fournisseur: {order.fournisseur?.nom || 'N/A'}</Text>}
    </View>
    <View style={[styles.statusBadge, order.statut === 'En attente' ? styles.statusPending : styles.statusCompleted]}>
      <Text style={[styles.statusText, order.statut === 'En attente' ? styles.statusTextPending : styles.statusTextCompleted]}>{order.statut}</Text>
    </View>
  </MotiView>
);

const UserCard = ({ user, delay, full }) => (
  <MotiView 
    from={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    style={styles.itemCard}
  >
    <View style={styles.avatarSmall}>
      <User size={18} color="#4F46E5" />
    </View>
    <View style={styles.itemInfo}>
      <Text style={styles.itemName}>{user.prenom} {user.nom}</Text>
      <Text style={styles.itemSubText}>{user.role}</Text>
      {full && <Text style={styles.itemSecondaryText}>{user.email}</Text>}
    </View>
    {full && (
      <TouchableOpacity style={styles.editBtn}>
        <Text style={styles.editText}>Détails</Text>
      </TouchableOpacity>
    )}
  </MotiView>
);

const NavItem = ({ icon, label, active, onPress }) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress}>
    <View style={[styles.navIconContainer, active && styles.navIconActive]}>
      {React.cloneElement(icon, { color: active ? '#2563EB' : '#9CA3AF' })}
    </View>
    <Text style={[styles.navText, active && styles.navTextActive]}>{label}</Text>
  </TouchableOpacity>
);

const InputLabel = ({ label }) => <Text style={styles.inputLabel}>{label}</Text>;

const EmptyState = ({ message }) => (
  <View style={styles.emptyContainer}>
    <Search size={32} color="#E5E7EB" />
    <Text style={styles.emptyText}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 80,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 10,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationBadgeContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2563EB',
  },
  badgeText: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginTop: 10,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#2563EB',
  },
  greeting: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 14,
    fontWeight: '600',
  },
  userName: {
    color: 'white',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  statsCardUnified: {
    position: 'absolute',
    bottom: -70,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 28,
    flexDirection: 'row',
    padding: 24,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1E2937',
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: '60%',
    backgroundColor: '#F1F5F9',
    alignSelf: 'center',
  },
  contentScroll: {
    flex: 1,
  },
  contentWrapper: {
    paddingHorizontal: 20,
  },
  segmentedWrapper: {
    marginTop: 15,
    marginBottom: 20,
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 18,
    padding: 6,
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 14,
  },
  segmentTabActive: {
    backgroundColor: 'white',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  segmentText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '700',
  },
  segmentTextActive: {
    color: '#2563EB',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1E2937',
    letterSpacing: -0.5,
  },
  viewAllText: {
    color: '#2563EB',
    fontWeight: '800',
    fontSize: 14,
  },
  circleActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#2563EB',
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 5,
  },
  cardAccent: {
    width: 4,
    height: 40,
    backgroundColor: '#2563EB',
    borderRadius: 2,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E2937',
    marginBottom: 2,
  },
  itemSubText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  itemSecondaryText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusPending: {
    backgroundColor: '#FFFBEB',
  },
  statusCompleted: {
    backgroundColor: '#F0FDF4',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  statusTextPending: {
    color: '#B45309',
  },
  statusTextCompleted: {
    color: '#15803D',
  },
  avatarSmall: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: '#F5F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  editBtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  editText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: 'white',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 25,
    maxHeight: '90%',
    elevation: 30,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  modalIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 24,
    color: '#1E2937',
    letterSpacing: -0.5,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 8,
    marginTop: 15,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    color: '#1E2937',
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    fontWeight: '600',
  },
  tagScrollContainer: {
    marginBottom: 10,
    marginTop: 5,
  },
  medicineTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  medicineTagActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  medicineTagText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '700',
  },
  medicineTagTextActive: {
    color: '#2563EB',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: 32,
    gap: 15,
  },
  cancelBtn: {
    flex: 1,
    padding: 18,
    borderRadius: 18,
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  cancelBtnText: {
    color: '#64748B',
    fontWeight: '800',
    fontSize: 15,
  },
  confirmBtn: {
    flex: 2,
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#2563EB',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  confirmGradient: {
    padding: 18,
    alignItems: 'center',
  },
  confirmBtnText: {
    color: 'white',
    fontWeight: '900',
    fontSize: 15,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    elevation: 30,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIconContainer: {
    padding: 8,
    borderRadius: 14,
  },
  navIconActive: {
    backgroundColor: '#EFF6FF',
  },
  navText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
    fontWeight: '700',
  },
  navTextActive: {
    color: '#2563EB',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
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

export default AdminDashboard;
