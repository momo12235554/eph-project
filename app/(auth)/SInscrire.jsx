import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/src/config/firebaseConfig'; // Assure-toi que ce chemin est correct
import AdminProfile from '../(admin)/admin'; // Import du composant de profil admin

export default function InscriptionAdmin({ onInscriptionSuccess }) {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmerMotDePasse, setConfirmerMotDePasse] = useState('');
  const [showProfile, setShowProfile] = useState(false); // Nouvel état pour afficher le profil

  const handleSubmit = async () => {
    // Valider les champs
    if (!nom || !email || !motDePasse || !confirmerMotDePasse) {
      Alert.alert('Erreur', 'Tous les champs sont requis');
      return;
    }

    if (motDePasse !== confirmerMotDePasse) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    try {
      // Crée un utilisateur dans Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, motDePasse);
      const user = userCredential.user;

      // Enregistrer les informations de l'administrateur dans Firestore
      await setDoc(doc(db, 'admins', user.uid), {
        nom: nom,
        email: email,
        role: 'admin', // Ici tu spécifies le rôle "admin"
        createdAt: serverTimestamp(), // Ajout du timestamp
      });

      // L'utilisateur est enregistré avec succès
      Alert.alert('Inscription réussie', 'Vous avez été inscrit avec succès');
      
      // Afficher le profil admin après inscription
      setShowProfile(true); // Passer à l'écran de profil
    } catch (error) {
      console.error('Erreur Firebase :', error);
      Alert.alert('Erreur', error.message); // Afficher l'erreur
    }
  };

  if (showProfile) {
    return <AdminProfile userName={nom} userEmail={email} />; // Afficher le profil admin
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Inscription Administrateur</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom complet"
        value={nom}
        onChangeText={setNom}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={motDePasse}
        onChangeText={setMotDePasse}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmer le mot de passe"
        value={confirmerMotDePasse}
        onChangeText={setConfirmerMotDePasse}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>S'inscrire</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f1f1f1',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1D4ED8',
    paddingVertical: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
