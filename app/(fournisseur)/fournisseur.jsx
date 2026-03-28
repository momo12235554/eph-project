import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
  Platform,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { 
  Bell, 
  Menu, 
  ShoppingCart, 
  CheckCircle, 
  XCircle, 
  Package, 
  Truck, 
  Clock, 
  LogOut,
  ChevronRight,
  TrendingUp,
  Box,
  MapPin,
  ClipboardList,
  Info,
  X
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MotiView, MotiText } from 'moti';
import { useCommandes } from '@/src/hooks/useCommandes';
import { useAuthContext } from '@/src/hooks/AuthContext';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const FournisseurDashboard = () => {
  const router = useRouter();
  const { user, logout } = useAuthContext();
  const [activeTab, setActiveTab] = useState('Fournisseur');
  const [currentSubTab, setCurrentSubTab] = useState('Commandes');
  const [showMenuModal, setShowMenuModal] = useState(false);
  const { commandes, isLoading, loadData, updateStatut } = useCommandes();

  useEffect(() => {
    loadData();
  }, []);

  const pendingOrders = commandes.filter(cmd => cmd.statut === 'en_attente');
  const deliveredOrders = commandes.filter(cmd => cmd.statut === 'livree');

  const stats = [
    { label: 'Attente', value: pendingOrders.length, icon: <Clock size={16} color="#F59E0B" />, bg: '#FFFBEB' },
    { label: 'Livrées', value: deliveredOrders.length, icon: <Truck size={16} color="#10B981" />, bg: '#F0FDF4' },
    { label: 'Total', value: commandes.length, icon: <Package size={16} color="#6366F1" />, bg: '#EEF2FF' },
  ];

  const handleStatutUpdate = async (id, status) => {
    const success = await updateStatut(id, status);
    if (success) {
      Alert.alert('Succès', `Statut mis à jour vers : ${status}`);
    } else {
      Alert.alert('Erreur', 'Impossible de mettre à jour le statut');
    }
  };

  const renderCommandes = () => (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Commandes Prioritaires</Text>
        <TrendingUp size={18} color="#6366F1" />
      </View>

      {isLoading ? (
        <ActivityIndicator color="#6366F1" style={{ marginTop: 20 }} />
      ) : pendingOrders.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Aucune commande en attente</Text>
        </View>
      ) : (
        pendingOrders.map((order, index) => (
          <MotiView 
            key={order.id}
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: index * 100 }}
            style={styles.orderCard}
          >
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.orderID}>CMD #{order.id}</Text>
                <Text style={styles.orderDate}>{order.date_commande}</Text>
              </View>
              <View style={styles.badgePending}>
                <Text style={styles.badgeTextPending}>À Traiter</Text>
              </View>
            </View>

            <View style={styles.amountBox}>
              <Text style={styles.amountLabel}>Montant à Facturer</Text>
              <Text style={styles.amountValue}>{order.montant_total?.toLocaleString()} DA</Text>
            </View>

            <View style={styles.actionGrid}>
              <TouchableOpacity style={styles.btnDeliver} onPress={() => handleStatutUpdate(order.id, 'livree')}>
                <LinearGradient colors={['#10B981', '#059669']} style={styles.btnGrad}>
                  <CheckCircle color="#fff" size={16} style={{ marginRight: 6 }} />
                  <Text style={styles.btnText}>Valider Livraison</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnCancel} onPress={() => handleStatutUpdate(order.id, 'annulee')}>
                <XCircle color="#EF4444" size={16} style={{ marginRight: 6 }} />
                <Text style={styles.btnTextCancel}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </MotiView>
        ))
      )}

      <View style={[styles.sectionHeader, { marginTop: 25 }]}>
        <Text style={styles.sectionTitle}>Dernières Livraisons</Text>
      </View>

      {deliveredOrders.slice(0, 4).map((hist, index) => (
        <MotiView 
          key={hist.id}
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 50 }}
          style={styles.historyItem}
        >
          <View style={styles.historyIconBox}>
            <CheckCircle color="#10B981" size={20} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.historyTitle}>Commande #{hist.id}</Text>
            <Text style={styles.historySub}>{hist.date_commande} • {hist.montant_total} DA</Text>
          </View>
          <ChevronRight size={18} color="#CBD5E1" />
        </MotiView>
      ))}
    </>
  );

  const renderStock = () => (
    <View style={styles.subPage}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>État des Stocks Fournisseur</Text>
        <Box size={20} color="#6366F1" />
      </View>
      <View style={styles.infoCard}>
        <Text style={styles.infoText}>Visualisation de l'inventaire prêt pour livraison.</Text>
      </View>
      {[
        { name: 'Paracétamol Injectable', qty: 500, cat: 'Analgésique' },
        { name: 'Sérum Salé 500ml', qty: 1200, cat: 'Hydratation' },
        { name: 'Antibiotique IV', qty: 250, cat: 'Anti-infectieux' },
      ].map((item, idx) => (
        <MotiView 
          key={idx}
          from={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 100 }}
          style={styles.historyItem}
        >
          <View style={[styles.historyIconBox, { backgroundColor: '#F0F9FF' }]}>
            <Package color="#0EA5E9" size={20} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.historyTitle}>{item.name}</Text>
            <Text style={styles.historySub}>{item.cat} • {item.qty} unités dispos</Text>
          </View>
        </MotiView>
      ))}
    </View>
  );

  const renderLogistique = () => (
    <View style={styles.subPage}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Suivi Flotte & Livraisons</Text>
        <Truck size={20} color="#6366F1" />
      </View>
      <View style={styles.historyItem}>
        <View style={[styles.historyIconBox, { backgroundColor: '#EEF2FF' }]}>
          <MapPin color="#6366F1" size={20} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.historyTitle}>Camion #02 - En route</Text>
          <Text style={styles.historySub}>Destination: CHU Mostaganem (Arrivée estimée: 10 min)</Text>
        </View>
      </View>
      <View style={styles.historyItem}>
        <View style={[styles.historyIconBox, { backgroundColor: '#F0FDF4' }]}>
          <Truck color="#10B981" size={20} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.historyTitle}>Livraison Terminée - CMD #102</Text>
          <Text style={styles.historySub}>Signé par: Pharmacien de garde à 14:30</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Premium Indigo Header */}
      <LinearGradient colors={['#312E81', '#4338CA', '#6366F1']} style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerNav}>
            <TouchableOpacity style={styles.headerBtn} onPress={() => setShowMenuModal(true)}>
              <Menu color="#fff" size={22} />
            </TouchableOpacity>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.headerBtn} onPress={() => Alert.alert("Notifications", "Vous avez " + pendingOrders.length + " commandes en attente de validation.")}>
                <Bell color="#fff" size={22} />
                {pendingOrders.length > 0 && <View style={styles.notificationDot} />}
              </TouchableOpacity>
              <TouchableOpacity style={[styles.headerBtn, { marginLeft: 12 }]} onPress={logout}>
                <LogOut color="#fff" size={20} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.profileBox}>
            <View style={styles.avatarCircle}>
              <LinearGradient colors={['#fff', '#EEF2FF']} style={styles.avatarGrad}>
                <Package color="#4338CA" size={28} />
              </LinearGradient>
            </View>
            <View>
              <Text style={styles.greetingLabel}>Espace Partenaire</Text>
              <Text style={styles.providerName}>{user ? user.nom : 'Fournisseur'}</Text>
              <Text style={styles.companyName}>{user ? user.entreprise || 'EPH CHU Mostaganem' : 'PharmaCorp Algeria'}</Text>
            </View>
          </View>

          {/* Floating Stats Card Glassmorphism */}
          <MotiView 
            from={{ translateY: 20, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            style={styles.statsOverlay}
          >
            <BlurView intensity={25} tint="light" style={styles.statsBlur}>
              {stats.map((stat, i) => (
                <View key={i} style={styles.statItem}>
                  <View style={[styles.statIconBox, { backgroundColor: stat.bg }]}>
                    {stat.icon}
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </BlurView>
          </MotiView>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 110, paddingTop: 60 }} showsVerticalScrollIndicator={false}>
        
        {/* Role Segment */}
        <View style={styles.roleContainer}>
          <View style={styles.roleSelector}>
            {['Admin', 'Pharmacien', 'Fournisseur'].map((tab) => (
              <View key={tab} style={[styles.roleTab, activeTab === tab && styles.roleActive]}>
                <Text style={[styles.roleText, activeTab === tab && styles.roleTextActive]}>{tab}</Text>
              </View>
            ))}
          </View>
        </View>

        {currentSubTab === 'Commandes' && renderCommandes()}
        {currentSubTab === 'Stock' && renderStock()}
        {currentSubTab === 'Logistique' && renderLogistique()}
      </ScrollView>

      {/* Modern Bottom Tab Bar */}
      <BlurView intensity={80} tint="light" style={styles.bottomNav}>
        <TabItem icon={<ClipboardList size={22} />} label="Commandes" active={currentSubTab === 'Commandes'} onPress={() => setCurrentSubTab('Commandes')} />
        <TabItem icon={<Box size={22} />} label="Stock" active={currentSubTab === 'Stock'} onPress={() => setCurrentSubTab('Stock')} />
        <TabItem icon={<Truck size={22} />} label="Logistique" active={currentSubTab === 'Logistique'} onPress={() => setCurrentSubTab('Logistique')} />
      </BlurView>

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
                <Text style={styles.menuTitle}>MediStock Menu</Text>
                <TouchableOpacity onPress={() => setShowMenuModal(false)}>
                  <X color="#1E2937" size={24} />
                </TouchableOpacity>
              </View>

              <View style={styles.menuItems}>
                <MenuItem icon={<Info color="#6366F1" size={20} />} label="À Propos" onPress={() => { setShowMenuModal(false); router.push('/propos'); }} />
                <MenuItem icon={<Package color="#10B981" size={20} />} label="Aide Fournisseur" onPress={() => Alert.alert("Aide", "Contactez le service logistique du CHU pour plus d'infos.")} />
                <MenuItem icon={<LogOut color="#EF4444" size={20} />} label="Déconnexion" onPress={() => { setShowMenuModal(false); logout(); }} />
              </View>

              <View style={styles.menuFooter}>
                <Text style={styles.versionText}>v2.0.0 Premium</Text>
                <Text style={styles.versionSub}>Développé par Antigravity pour EPH</Text>
              </View>
            </SafeAreaView>
          </MotiView>
        </View>
      </Modal>
    </View>
  );
};

const TabItem = ({ icon, label, active, onPress }) => (
  <TouchableOpacity style={styles.tabItem} onPress={onPress}>
    <View style={[styles.tabIconBox, active && styles.tabIconActive]}>
      {React.cloneElement(icon, { color: active ? '#4F46E5' : '#94A3B8' })}
    </View>
    <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
  </TouchableOpacity>
);

const MenuItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuIconBox}>{icon}</View>
    <Text style={styles.menuItemLabel}>{label}</Text>
    <ChevronRight size={18} color="#CBD5E1" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 60,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  headerRight: {
    flexDirection: 'row',
  },
  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  notificationDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#FB7185',
    borderWidth: 1.5,
    borderColor: '#4338CA',
  },
  profileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    gap: 16,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
  },
  avatarGrad: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greetingLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  providerName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  companyName: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '600',
  },
  statsOverlay: {
    position: 'absolute',
    bottom: -50,
    left: 20,
    right: 20,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  statsBlur: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.85)',
    padding: 20,
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1E2937',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  roleContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  roleSelector: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    padding: 4,
    borderRadius: 16,
  },
  roleTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  roleActive: {
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
  },
  roleText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '700',
  },
  roleTextActive: {
    color: '#4F46E5',
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
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
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
    marginBottom: 16,
  },
  orderID: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E2937',
  },
  orderDate: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 2,
  },
  badgePending: {
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  badgeTextPending: {
    fontSize: 10,
    color: '#D97706',
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  amountBox: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  amountLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#4338CA',
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  btnDeliver: {
    flex: 2,
    borderRadius: 14,
    overflow: 'hidden',
  },
  btnGrad: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  btnCancel: {
    flex: 1,
    height: 50,
    backgroundColor: '#FEF2F2',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  btnTextCancel: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '800',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  historyIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E2937',
  },
  historySub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  emptyBox: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 95,
    borderRadius: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    overflow: 'hidden',
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  tabIconActive: {
    backgroundColor: '#EEF2FF',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
  },
  tabLabelActive: {
    color: '#4F46E5',
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
  subPage: {
    flex: 1,
    paddingHorizontal: 20,
  },
  infoCard: {
    backgroundColor: '#EEF2FF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#6366F1',
  },
  infoText: {
    fontSize: 13,
    color: '#4338CA',
    fontWeight: '600',
    lineHeight: 18,
  },
});

export default FournisseurDashboard;

