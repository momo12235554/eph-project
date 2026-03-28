import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  ImageBackground, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { User, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthContext } from '@/src/hooks/AuthContext';
import { authService } from '@/src/services/authService';

const Connexion = ({ onLoginSuccess }) => {
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
        const nom = authData.user?.nom || "Pharmacien";
        Alert.alert('Succès', `Bienvenue, Dr. ${nom}`);
        onLoginSuccess(authData);
    } catch (err) {
        setError(err.message || 'Identifiants incorrects');
        setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ImageBackground 
        source={require('@/assets/images/pharm.jpg')} 
        style={styles.backgroundImage}
        imageStyle={{ opacity: 0.8 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <MotiView 
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 600 }}
            style={styles.cardContainer}
          >
            <BlurView intensity={65} tint="light" style={styles.blurCard}>
              <View style={styles.iconHeader}>
                <LinearGradient
                  colors={['#2563EB', '#1D4ED8']}
                  style={styles.headerIconCircle}
                >
                  <ShieldCheck size={32} color="#fff" />
                </LinearGradient>
              </View>

              <Text style={styles.title}>Espace Pharmacien</Text>
              <Text style={styles.subtitle}>Connectez-vous à votre session sécurisée</Text>

              <View style={styles.form}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Utilisateur</Text>
                  <View style={styles.inputContainer}>
                    <User size={20} color="#64748B" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Identifiant"
                      onChangeText={setUsername}
                      value={username}
                      placeholderTextColor="#94A3B8"
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Mot de passe</Text>
                  <View style={styles.inputContainer}>
                    <Lock size={20} color="#64748B" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      placeholder="••••••••"
                      secureTextEntry={!showPassword}
                      onChangeText={setPassword}
                      value={password}
                      placeholderTextColor="#94A3B8"
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                      {showPassword ? <EyeOff size={20} color="#64748B" /> : <Eye size={20} color="#64748B" />}
                    </TouchableOpacity>
                  </View>
                </View>

                {error ? (
                  <MotiView from={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={styles.errorBox}>
                    <Text style={styles.errorText}>{error}</Text>
                  </MotiView>
                ) : null}

                <TouchableOpacity 
                  style={styles.button} 
                  onPress={handleLogin} 
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#2563EB', '#1D4ED8']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.buttonGradient}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Se Connecter</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </BlurView>
          </MotiView>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    minHeight: 500,
  },
  cardContainer: {
    borderRadius: 32,
    overflow: 'hidden',
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  blurCard: {
    padding: 30,
    alignItems: 'center',
  },
  iconHeader: {
    marginBottom: 20,
  },
  headerIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#2563EB',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1E2937',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 30,
    fontWeight: '600',
  },
  form: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    paddingHorizontal: 15,
    height: 60,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1E2937',
    fontWeight: '600',
  },
  eyeIcon: {
    padding: 10,
  },
  button: {
    marginTop: 10,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#2563EB',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  buttonGradient: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '800',
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  errorText: {
    color: '#EF4444',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
  }
});

export default Connexion;
