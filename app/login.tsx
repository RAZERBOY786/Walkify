import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Dimensions
} from 'react-native';
import Svg, { Rect, Defs, RadialGradient, Stop } from 'react-native-svg';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../services/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleAuth = async () => {
    const cleanEmail = email.trim();
    const cleanName = name.trim();

    // Validation Logic
    if (isRegistering && !cleanName) {
      Alert.alert("Error", "Please enter your full name.");
      return;
    }
    if (!cleanEmail || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    if (isRegistering && password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        // Save user details including the Name
        await setDoc(doc(db, "users", userCredential.user.uid), {
          displayName: cleanName,
          email: userCredential.user.email,
          createdAt: new Date().toISOString(),
          dailyStepGoal: 10000,
          points: 0
        });
      } else {
        await signInWithEmailAndPassword(auth, cleanEmail, password);
      }
    } catch (error: any) {
      Alert.alert("Auth Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainWrapper}>
      <StatusBar barStyle="dark-content" />
      
      {/* PREMIUM BACKGROUND */}
      <View style={StyleSheet.absoluteFill}>
        <Svg height="100%" width="100%">
          <Rect x="0" y="0" width="100%" height="100%" fill="#FFFFFF" />
          <Defs>
            <RadialGradient id="indigoGrad" cx="20%" cy="10%" rx="60%" ry="50%">
              <Stop offset="0%" stopColor="#7209B7" stopOpacity="0.12" />
              <Stop offset="100%" stopColor="#7209B7" stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="blueGrad" cx="90%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor="#4361EE" stopOpacity="0.1" />
              <Stop offset="100%" stopColor="#4361EE" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#indigoGrad)" />
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#blueGrad)" />
        </Svg>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerSection}>
            <View style={styles.logoIcon}>
              <Ionicons name="fitness" size={40} color="#4361EE" />
            </View>
            <Text style={styles.title}>{isRegistering ? 'Create Account' : 'Welcome Back'}</Text>
            <Text style={styles.subtitle}>
              {isRegistering ? 'Start your high-performance journey' : 'Sign in to reach your goals'}
            </Text>
          </View>

          <BlurView intensity={40} tint="light" style={styles.glassCard}>
            
            {/* FULL NAME FIELD (Only shows on Registration) */}
            {isRegistering && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={20} color="#4361EE" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Sahil Islam"
                    placeholderTextColor="#999"
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color="#4361EE" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="name@example.com"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color="#4361EE" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Min. 6 characters"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            {/* CONFIRM PASSWORD (Only shows on Registration) */}
            {isRegistering && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="shield-checkmark-outline" size={20} color="#4361EE" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Repeat password"
                    placeholderTextColor="#999"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                  />
                </View>
              </View>
            )}

            <TouchableOpacity 
              style={[styles.mainButton, loading && styles.buttonDisabled]} 
              onPress={handleAuth}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {isRegistering ? 'Sign Up' : 'Sign In'}
                </Text>
              )}
            </TouchableOpacity>
          </BlurView>

          <TouchableOpacity 
            onPress={() => setIsRegistering(!isRegistering)}
            style={styles.toggleContainer}
          >
            <Text style={styles.toggleText}>
              {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
              <Text style={styles.toggleLink}>
                {isRegistering ? 'Sign In' : 'Sign Up'}
              </Text>
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  headerSection: { alignItems: 'center', marginBottom: 30 },
  logoIcon: { width: 70, height: 70, borderRadius: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginBottom: 15, shadowColor: '#4361EE', shadowOpacity: 0.1, shadowRadius: 10, elevation: 3 },
  title: { fontSize: 30, fontWeight: '900', color: '#1A1A1A' },
  subtitle: { fontSize: 15, color: '#666', marginTop: 5, textAlign: 'center' },
  glassCard: { borderRadius: 32, padding: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)', backgroundColor: 'rgba(255,255,255,0.4)' },
  inputGroup: { marginBottom: 18 },
  label: { fontSize: 12, fontWeight: '800', color: '#4361EE', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 15, borderWidth: 1, borderColor: '#E0E7FF', paddingHorizontal: 15 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 50, fontSize: 15, color: '#1A1A1A' },
  mainButton: { backgroundColor: '#4361EE', height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginTop: 10, shadowColor: '#4361EE', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 4 },
  buttonDisabled: { backgroundColor: '#A5B4FC' },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  toggleContainer: { marginTop: 25, alignItems: 'center' },
  toggleText: { color: '#666', fontSize: 14 },
  toggleLink: { color: '#7209B7', fontWeight: '800' },
});