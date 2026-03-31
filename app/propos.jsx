import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { ChevronLeft, Info, Hospital, ShieldCheck, Database, Award } from 'lucide-react-native';
import { MotiView, MotiText } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const InfoScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#10B981', '#059669']}
        style={styles.headerGradient}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft color="#fff" size={24} />
        </TouchableOpacity>
        
        <MotiView 
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={styles.headerContent}
        >
          <View style={styles.logoCircle}>
            <Hospital color="#fff" size={40} />
          </View>
          <MotiText 
            from={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={styles.headerTitle}
          >
            MediStock Premium
          </MotiText>
          <Text style={styles.headerSubtitle}>Solution Hospitalière Intégrée</Text>
        </MotiView>
      </LinearGradient>

      <ScrollView 
        style={styles.contentScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 200 }}
          style={styles.mainCard}
        >
          <View style={styles.infoRow}>
            <Info color="#10B981" size={20} />
            <Text style={styles.infoLabel}>À PROPOS DE NOUS</Text>
          </View>
          <Text style={styles.paragraph}>
            MediStock est une plateforme de pointe dédiée à l'excellence opérationnelle du <Text style={styles.boldText}>GRAND CHU DE CORSE</Text>. 
            Conçue pour transformer la gestion pharmaceutique, notre application assure une traçabilité sans faille, de l'approvisionnement à la distribution.
          </Text>

          <View style={styles.featuresGrid}>
            <FeatureBox 
              icon={<ShieldCheck color="#10B981" size={24} />} 
              title="Sécurité" 
              desc="Contrôle rigoureux des stocks"
            />
            <FeatureBox 
              icon={<Database color="#3B82F6" size={24} />} 
              title="Temps Réel" 
              desc="Données synchronisées 24/7"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Award color="#F59E0B" size={20} />
            <Text style={styles.infoLabel}>NOTRE MISSION</Text>
          </View>
          <Text style={styles.paragraph}>
            Garantir la disponibilité constante des traitements vitaux pour les patients grâce à une interface intuitive et des analyses prédictives.
          </Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 400 }}
          style={styles.footer}
        >
          <Text style={styles.footerText}>Version 2.0.0 • 2024</Text>
          <Text style={styles.footerText}>Développé pour le GRAND CHU DE CORSE</Text>
        </MotiView>
      </ScrollView>
    </View>
  );
};

const FeatureBox = ({ icon, title, desc }) => (
  <View style={styles.featureBox}>
    <View style={styles.featureIcon}>{icon}</View>
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureDesc}>{desc}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  headerGradient: { height: 260, paddingTop: 50, paddingHorizontal: 20, alignItems: 'center' },
  backBtn: { position: 'absolute', top: 50, left: 20, width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerContent: { alignItems: 'center' },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  headerTitle: { fontSize: 28, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  contentScroll: { flex: 1, marginTop: -40 },
  mainCard: { backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 32, padding: 24, elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  infoLabel: { fontSize: 12, fontWeight: '800', color: '#64748B', letterSpacing: 1 },
  paragraph: { fontSize: 16, color: '#334155', lineHeight: 26, marginBottom: 20 },
  boldText: { fontWeight: '700', color: '#1E2937' },
  featuresGrid: { flexDirection: 'row', gap: 15, marginBottom: 20 },
  featureBox: { flex: 1, backgroundColor: '#F8FAFC', padding: 16, borderRadius: 20, borderSize: 1, borderColor: '#F1F5F9' },
  featureIcon: { marginBottom: 10 },
  featureTitle: { fontSize: 14, fontWeight: '700', color: '#1E2937' },
  featureDesc: { fontSize: 11, color: '#64748B', marginTop: 4 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 20 },
  footer: { alignItems: 'center', marginTop: 24 },
  footerText: { fontSize: 12, color: '#94A3B8', fontWeight: '500' },
});

export default InfoScreen;
