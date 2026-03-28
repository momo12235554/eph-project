import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from "react-native";

const Lance = () => {
  const [medicaments, setMedicaments] = useState([
    { nom: "Paracétamol", stock: 5 },
    { nom: "Ibuprofène", stock: 12 },
    { nom: "Amoxicilline", stock: 2 },
    { nom: "Aspirine", stock: 15 },
    { nom: "Ciprofloxacine", stock: 8 },
  ]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    checkStocks();
  }, [medicaments]);

  const checkStocks = () => {
    const lowStock = medicaments.filter((m) => m.stock < 10);
    if (lowStock.length > 0) {
      lowStock.forEach((m) => {
        Alert.alert(
          "Alerte Stock",
          `Le stock du médicament "${m.nom}" est bas (${m.stock} unités).`
        );
        sendNotificationToAdmin(m.nom, m.stock);
      });
    }
  };

  const sendNotificationToAdmin = (nom, stock) => {
    console.log(
      `Notification envoyée à l'Administrateur: Le stock de ${nom} est faible (${stock}).`
    );
  };

  const filteredMedicaments = medicaments.filter((m) =>
    m.nom.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stock médicament</Text>

      <TextInput
        style={styles.input}
        placeholder="🔍 Rechercher un médicament"
        value={search}
        onChangeText={setSearch}
      />

      <ScrollView style={{ marginBottom: 20 }}>
        {filteredMedicaments.map((med, index) => (
          <View
            key={index}
            style={[styles.card, med.stock < 10 ? styles.lowStockCard : null]}
          >
            <Text style={styles.nom}>{med.nom}</Text>
            <Text style={styles.stock}>
              Stock:{" "}
              <Text style={{ color: med.stock < 10 ? "red" : "green" }}>
                {med.stock}
              </Text>
            </Text>

            {med.stock < 10 && (
              <TouchableOpacity
                style={styles.notifyButton}
                onPress={() => sendNotificationToAdmin(med.nom, med.stock)}
              >
                <Text style={styles.notifyButtonText}>Notifier à l'Admin</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[styles.refresh, { backgroundColor: "#4B6C76" }]}
        onPress={checkStocks}
      >
        <Text style={styles.refreshText}>Vérifier le stock</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F4F9FF",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "rgba(0,174,239,0.85)",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    elevation: 3,
  },
  lowStockCard: {
    borderColor: "red",
    borderWidth: 1.5,
  },
  nom: {
    fontSize: 18,
    fontWeight: "600",
  },
  stock: {
    fontSize: 16,
    marginTop: 5,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  refresh: {
    marginTop: 10,
    backgroundColor: "rgba(0,174,239,0.85)",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  refreshText: {
    color: "#fff",
    fontWeight: "bold",
  },
  notifyButton: {
    marginTop: 10,
    backgroundColor: "red",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  notifyButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Lance;
