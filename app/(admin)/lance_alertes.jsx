import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Package,
  Zap,
} from "lucide-react-native";
import { MotiView } from "moti";
import { apiClient } from "../../src/services/apiClient";

const Lance = () => {
  const [medicaments, setMedicaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [lastScanResult, setLastScanResult] = useState(null);

  useEffect(() => {
    loadMedicaments();
  }, []);

  const loadMedicaments = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/medicaments");
      const data = response.data?.data || response.data || response;
      if (Array.isArray(data)) {
        setMedicaments(data);
      }
    } catch (error) {
      console.error("Erreur chargement médicaments:", error);
    } finally {
      setLoading(false);
    }
  };

  const lancerScan = async () => {
    setScanning(true);
    try {
      const response = await apiClient.post("/alertes/generer");
      const result = response.data?.data || response.data || response;
      setLastScanResult(result);
      Alert.alert(
        "Scan terminé",
        response.data?.message || response.message || `${result.alertes_generees || 0} nouvelle(s) alerte(s) générée(s).`
      );
      loadMedicaments();
    } catch (error) {
      console.error("Erreur scan alertes:", error);
      Alert.alert("Erreur", "Impossible de lancer le scan des alertes.");
    } finally {
      setScanning(false);
    }
  };

  const lowStockMeds = medicaments.filter((m) => parseInt(m.quantite) <= 10);
  const okMeds = medicaments.filter((m) => parseInt(m.quantite) > 10);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Scanner de Stock</Text>
          <Text style={styles.subtitle}>
            Vérification automatique des alertes
          </Text>
        </View>
        <TouchableOpacity
          style={styles.refreshBtn}
          onPress={loadMedicaments}
        >
          <RefreshCw size={18} color="#6366F1" />
        </TouchableOpacity>
      </View>

      {/* Scan Button */}
      <MotiView
        from={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "timing", duration: 400 }}
      >
        <TouchableOpacity
          style={[styles.scanBtn, scanning && styles.scanBtnDisabled]}
          onPress={lancerScan}
          disabled={scanning}
        >
          {scanning ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Zap size={20} color="#fff" />
          )}
          <Text style={styles.scanBtnText}>
            {scanning ? "Scan en cours..." : "Lancer le scan des alertes"}
          </Text>
        </TouchableOpacity>
      </MotiView>

      {lastScanResult && (
        <MotiView
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          style={styles.resultBanner}
        >
          <CheckCircle size={16} color="#10B981" />
          <Text style={styles.resultText}>
            Dernier scan : {lastScanResult.alertes_generees || 0} alerte(s)
            générée(s)
          </Text>
        </MotiView>
      )}

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { borderLeftColor: "#EF4444" }]}>
          <Text style={[styles.statValue, { color: "#EF4444" }]}>
            {lowStockMeds.length}
          </Text>
          <Text style={styles.statLabel}>Stock bas</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: "#10B981" }]}>
          <Text style={[styles.statValue, { color: "#10B981" }]}>
            {okMeds.length}
          </Text>
          <Text style={styles.statLabel}>Stock OK</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: "#6366F1" }]}>
          <Text style={[styles.statValue, { color: "#6366F1" }]}>
            {medicaments.length}
          </Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      {/* List */}
      {loading ? (
        <ActivityIndicator color="#6366F1" style={{ marginTop: 30 }} />
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {lowStockMeds.length > 0 && (
            <Text style={styles.sectionTitle}>⚠️ Stock critique</Text>
          )}
          {lowStockMeds.map((med, idx) => (
            <MotiView
              key={med.id}
              from={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 60 }}
              style={[styles.card, styles.lowStockCard]}
            >
              <View style={styles.cardRow}>
                <View style={styles.iconBox}>
                  <AlertTriangle size={18} color="#EF4444" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.medName}>{med.nom}</Text>
                  <Text style={styles.medInfo}>
                    Lot: {med.lot || "-"} • Cat: {med.categorie || "-"}
                  </Text>
                </View>
                <View style={styles.stockBadge}>
                  <Text style={styles.stockBadgeText}>
                    {med.quantite}
                  </Text>
                </View>
              </View>
            </MotiView>
          ))}

          {okMeds.length > 0 && (
            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
              ✅ Stock normal
            </Text>
          )}
          {okMeds.slice(0, 10).map((med, idx) => (
            <MotiView
              key={med.id}
              from={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 40 }}
              style={styles.card}
            >
              <View style={styles.cardRow}>
                <View style={[styles.iconBox, { backgroundColor: "#ECFDF5" }]}>
                  <Package size={18} color="#10B981" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.medName}>{med.nom}</Text>
                  <Text style={styles.medInfo}>
                    Lot: {med.lot || "-"} • Cat: {med.categorie || "-"}
                  </Text>
                </View>
                <View style={[styles.stockBadge, { backgroundColor: "#ECFDF5" }]}>
                  <Text style={[styles.stockBadgeText, { color: "#10B981" }]}>
                    {med.quantite}
                  </Text>
                </View>
              </View>
            </MotiView>
          ))}
          {okMeds.length > 10 && (
            <Text style={styles.moreText}>
              + {okMeds.length - 10} autres médicaments...
            </Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: { fontSize: 22, fontWeight: "900", color: "#1E2937" },
  subtitle: { fontSize: 13, color: "#94A3B8", fontWeight: "600", marginTop: 2 },
  refreshBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  scanBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#6366F1",
    marginHorizontal: 20,
    marginVertical: 12,
    paddingVertical: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#6366F1",
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  scanBtnDisabled: { opacity: 0.7 },
  scanBtnText: { color: "#fff", fontSize: 15, fontWeight: "800" },
  resultBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#ECFDF5",
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  resultText: { fontSize: 13, color: "#065F46", fontWeight: "700" },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    borderLeftWidth: 4,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.03,
  },
  statValue: { fontSize: 24, fontWeight: "900" },
  statLabel: { fontSize: 11, color: "#94A3B8", fontWeight: "700", marginTop: 2 },
  scroll: { flex: 1, paddingHorizontal: 20 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#475569",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.02,
  },
  lowStockCard: { borderColor: "#FCA5A5" },
  cardRow: { flexDirection: "row", alignItems: "center" },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
  },
  medName: { fontSize: 14, fontWeight: "800", color: "#1E2937" },
  medInfo: { fontSize: 11, color: "#94A3B8", fontWeight: "600", marginTop: 2 },
  stockBadge: {
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stockBadgeText: { fontSize: 14, fontWeight: "900", color: "#EF4444" },
  moreText: {
    textAlign: "center",
    color: "#94A3B8",
    fontWeight: "600",
    fontSize: 13,
    marginTop: 10,
  },
});

export default Lance;
