import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ImageBackground,
  ActivityIndicator
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useAuthContext } from '@/src/hooks/AuthContext';
import { authService } from '@/src/services/authService';

const ConnexionAdmin = ({ onLoginSuccess, onInscriptionPress }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuthContext();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
        const authData = await authService.login(username, password);
        login(authData);
        setIsLoading(false);
        Alert.alert('Connexion réussie', `Bienvenue ${authData.user.nom}`);
        onLoginSuccess(authData);
    } catch (err) {
        setError(err.message || 'Identifiants incorrects');
        setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/admin.png')}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>Connexion Administrateur</Text>

          <View style={styles.inputContainer}>
            <FontAwesome name="user" size={20} color="#00aeef" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Nom d'utilisateur"
              onChangeText={setUsername}
              value={username}
              placeholderTextColor="#ccc"
            />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesome name="lock" size={20} color="#00aeef" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              secureTextEntry={!showPassword}
              onChangeText={setPassword}
              value={password}
              placeholderTextColor="#ccc"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <FontAwesome
                name={showPassword ? 'eye-slash' : 'eye'}
                size={20}
                color="#00aeef"
              />
            </TouchableOpacity>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Se connecter</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.registerButton} onPress={onInscriptionPress}>
            <Text style={styles.registerText}>S'inscrire (Nouveau Admin)</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    padding: 20,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  button: {
    backgroundColor: '#00aeef',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
  },
  registerButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#00aeef',
    backgroundColor: 'transparent',
  },
  registerText: {
    textAlign: 'center',
    color: '#00aeef',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 5,
    borderRadius: 5,
  }
});

export default ConnexionAdmin;
