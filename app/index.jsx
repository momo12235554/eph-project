import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Platform,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
import { Menu, X, Facebook, Instagram, Phone, Mail, ArrowRight, ShieldCheck, Activity, Users as UsersIcon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MotiView, MotiText } from 'moti';

import Connexion from './(auth)/connexion';
import ConnexionAdmin from './(auth)/connexion_admin';
import ConnexionFournisseur from './(auth)/connexion_fournisseur';
import Propos from './propos';
import { useRouter } from 'expo-router';
import { useAuthContext } from '@/src/hooks/AuthContext';

const backgroundImage = require('@/assets/images/medicale8.jpg');

export default function Index() {
  const { width, height } = useWindowDimensions();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showConnexion, setShowConnexion] = useState(false);
  const [showConnexionAdmin, setShowConnexionAdmin] = useState(false);
  const [showConnexionFournisseur, setShowConnexionFournisseur] = useState(false);
  const [showPropos, setShowPropos] = useState(false);

  const router = useRouter();
  const { user, login } = useAuthContext();

  useEffect(() => {
    if (user && user.role) {
      if (user.role === 'admin') router.replace('/(admin)/admin');
      else if (user.role === 'pharmacien') router.replace('/(pharma)/sc_phrm');
      else if (user.role === 'fournisseur') router.replace('/(fournisseur)/fournisseur');
    }
  }, [user]);

  const openLink = (url) => Linking.openURL(url);

  const handleLoginSuccess = (authData) => {
    login(authData);
    setShowConnexion(false);
    router.replace('/(pharma)/sc_phrm');
  };
  const handleAdminLoginSuccess = (authData) => {
    login(authData);
    setShowConnexionAdmin(false);
    router.replace('/(admin)/admin');
  };
  const handleFournisseurLoginSuccess = (authData) => {
    login(authData);
    setShowConnexionFournisseur(false);
    router.replace('/(fournisseur)/fournisseur');
  };
  const handleInscriptionAdmin = () => { 
    Alert.alert('Information', 'L\'inscription doit maintenant se faire via le panel Laravel super-admin.'); 
  };

  const isWeb = Platform.OS === 'web';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background handling: Gradient fallback + Image */}
      <View style={styles.absoluteFill}>
        <LinearGradient
          colors={['#1E3A8A', '#2563EB', '#60A5FA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.absoluteFill}
        />
        <ImageBackground
          source={backgroundImage}
          style={styles.absoluteFill}
          imageStyle={{ opacity: 0.35 }}
          resizeMode="cover"
        />
      </View>

      <SafeAreaView style={styles.safeContainer}>
        {/* Header */}
        <MotiView 
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 800 }}
          style={styles.header}
        >
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={['#fff', 'rgba(255,255,255,0.7)']}
              style={styles.logoCircle}
            >
              <Activity size={20} color="#1E40AF" />
            </LinearGradient>
            <View>
              <Text style={styles.logoText}>MediStock</Text>
              <Text style={styles.subLogo}>HOSPITAL SYSTEM</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setMenuOpen(!menuOpen)}
            activeOpacity={0.7}
          >
            {menuOpen ? <X size={24} color="#fff" /> : <Menu size={24} color="#fff" />}
          </TouchableOpacity>
        </MotiView>

        {/* Mobile/Web Dropdown Menu */}
        {menuOpen && (
          <MotiView 
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={[styles.dropdown, isWeb && styles.dropdownWeb]}
          >
            <BlurView intensity={90} tint="light" style={styles.menuBlur}>
              <MenuItem icon={<UsersIcon size={20} color="#1D4ED8" />} title="Espace Pharmacien" onPress={() => { setMenuOpen(false); setShowConnexion(true); }} />
              <MenuItem icon={<ShieldCheck size={20} color="#1D4ED8" />} title="Espace Administrateur" onPress={() => { setMenuOpen(false); setShowConnexionAdmin(true); }} />
              <MenuItem icon={<ArrowRight size={20} color="#1D4ED8" />} title="Espace Fournisseur" onPress={() => { setMenuOpen(false); setShowConnexionFournisseur(true); }} />
              <View style={styles.menuDivider} />
              <MenuItem title="À propos" onPress={() => { setMenuOpen(false); setShowPropos(true); }} />
            </BlurView>
          </MotiView>
        )}

        {/* Hero Content */}
        <View style={styles.heroContent}>
          <MotiView 
            from={{ opacity: 0, scale: 0.9, translateY: 30 }}
            animate={{ opacity: 1, scale: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 1000, delay: 200 }}
            style={styles.heroCardWrapper}
          >
            <BlurView intensity={35} tint="light" style={styles.heroCardBlur}>
              <View style={styles.heroCard}>
                <MotiText 
                  from={{ opacity: 0, translateY: 10 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ delay: 500 }}
                  style={styles.heroBadge}
                >
                  SYSTÈME DE SANTÉ E.P.H
                </MotiText>
                <Text style={styles.heroTitle}>Gestion Intelligente HP</Text>
                <Text style={styles.heroSubtitle}>Stocks & Pharmacies Hospitalières</Text>
                <View style={styles.separator} />
                <Text style={styles.heroDescription}>
                  Optimisez la distribution de médicaments, suivez les commandes 
                  et gérez vos inventaires en temps réel avec une interface intuitive.
                </Text>
                <TouchableOpacity
                  style={styles.ctaButton}
                  onPress={() => setShowConnexion(true)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#FFFFFF', '#F0F9FF']}
                    style={styles.ctaGradient}
                  >
                    <Text style={styles.ctaText}>Se Connecter</Text>
                    <ArrowRight size={18} color="#2563EB" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </BlurView>
          </MotiView>
        </View>

        {/* Footer */}
        <MotiView 
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 800 }}
          style={styles.footer}
        >
          <View style={styles.socialIcons}>
            <SocialButton icon={<Facebook size={20} color="#fff" />} onPress={() => openLink('https://facebook.com')} />
            <SocialButton icon={<Instagram size={20} color="#fff" />} onPress={() => openLink('https://instagram.com')} />
            <SocialButton icon={<Mail size={20} color="#fff" />} onPress={() => openLink('mailto:contact@medistock.chu')} />
          </View>
          <Text style={styles.copyright}>© 2026 MediStock CHU • Excellence Médicale</Text>
        </MotiView>
      </SafeAreaView>

      {/* Modals */}
      <AuthModal visible={showConnexion} onClose={() => setShowConnexion(false)} title="Espace Pharmacien">
        <Connexion onLoginSuccess={handleLoginSuccess} />
      </AuthModal>

      <AuthModal visible={showConnexionAdmin} onClose={() => setShowConnexionAdmin(false)} title="Espace Administrateur">
        <ConnexionAdmin onLoginSuccess={handleAdminLoginSuccess} onInscriptionPress={handleInscriptionAdmin} />
      </AuthModal>

      <AuthModal visible={showConnexionFournisseur} onClose={() => setShowConnexionFournisseur(false)} title="Espace Fournisseur">
        <ConnexionFournisseur onLoginSuccess={handleFournisseurLoginSuccess} />
      </AuthModal>

      <AuthModal visible={showPropos} onClose={() => setShowPropos(false)} title="À propos">
        <Propos />
      </AuthModal>
    </View>
  );
}

const MenuItem = ({ title, onPress, icon }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuItemContent}>
      {icon && <View style={styles.menuIcon}>{icon}</View>}
      <Text style={styles.menuText}>{title}</Text>
    </View>
  </TouchableOpacity>
);

const SocialButton = ({ icon, onPress }) => (
  <TouchableOpacity style={styles.socialButton} onPress={onPress}>
    {icon}
  </TouchableOpacity>
);

const AuthModal = ({ visible, onClose, title, children }) => (
  <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
    <View style={styles.modalOverlay}>
      <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.modalContent}>
        <View style={styles.modalIndicator} />
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <X size={20} color="#4B5563" />
          </Pressable>
        </View>
        <ScrollView style={{ maxHeight: 600 }} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E3A8A',
  },
  safeContainer: {
    flex: 1,
  },
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    zIndex: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -0.5,
  },
  subLogo: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: -2,
  },
  menuButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  dropdown: {
    position: 'absolute',
    top: 90,
    right: 24,
    width: 260,
    borderRadius: 20,
    overflow: 'hidden',
    zIndex: 100,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  menuBlur: {
    padding: 8,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(29, 78, 216, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    color: '#1E2937',
    fontSize: 15,
    fontWeight: '700',
  },
  menuDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginVertical: 8,
    marginHorizontal: 12,
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  heroCardWrapper: {
    width: '100%',
    maxWidth: 500,
    borderRadius: 32,
    overflow: 'hidden',
    elevation: 25,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  heroCardBlur: {
    padding: 30,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  heroCard: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#DBEAFE',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  separator: {
    width: 40,
    height: 4,
    backgroundColor: '#fff',
    borderRadius: 2,
    marginBottom: 20,
    opacity: 0.6,
  },
  heroDescription: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  ctaButton: {
    width: '100%',
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  ctaText: {
    color: '#1D4ED8',
    fontSize: 17,
    fontWeight: '800',
  },
  footer: {
    paddingBottom: 30,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  socialIcons: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  socialButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  copyright: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 25,
  },
  modalIndicator: {
    width: 40,
    height: 5,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
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
    color: '#111827',
    letterSpacing: -0.5,
  },
  closeButton: {
    width: 36,
    height: 36,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

