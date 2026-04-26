import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  Platform,
  Dimensions
} from 'react-native';
import Svg, { Rect, Defs, RadialGradient, Stop } from 'react-native-svg';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../services/firebase';
import { signOut } from 'firebase/auth';

export default function ProfileScreen() {
  const handleLogout = () => {
    signOut(auth).catch(err => console.log(err));
  };

  return (
    <View style={styles.mainWrapper}>
      {/* VIBRANT MESH BACKGROUND LAYER */}
      <View style={StyleSheet.absoluteFill}>
        <Svg height="100%" width="100%">
          <Rect x="0" y="0" width="100%" height="100%" fill="#FFFFFF" />
          <Defs>
            <RadialGradient id="gradBlue" cx="15%" cy="15%" rx="60%" ry="60%">
              <Stop offset="0%" stopColor="#4361EE" stopOpacity="0.5" />
              <Stop offset="100%" stopColor="#4361EE" stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="gradViolet" cx="85%" cy="25%" rx="55%" ry="55%">
              <Stop offset="0%" stopColor="#7209B7" stopOpacity="0.4" />
              <Stop offset="100%" stopColor="#7209B7" stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="gradOrange" cx="10%" cy="65%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor="#FB8500" stopOpacity="0.35" />
              <Stop offset="100%" stopColor="#FB8500" stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="gradYellow" cx="95%" cy="75%" rx="45%" ry="45%">
              <Stop offset="0%" stopColor="#FFB703" stopOpacity="0.4" />
              <Stop offset="100%" stopColor="#FFB703" stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="gradGreen" cx="50%" cy="95%" rx="55%" ry="55%">
              <Stop offset="0%" stopColor="#2D6A4F" stopOpacity="0.3" />
              <Stop offset="100%" stopColor="#2D6A4F" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#gradBlue)" />
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#gradViolet)" />
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#gradOrange)" />
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#gradYellow)" />
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#gradGreen)" />
        </Svg>
      </View>

      <StatusBar barStyle="dark-content" translucent />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          
          {/* Avatar Section */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitial}>
                {auth.currentUser?.email?.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.userEmail}>{auth.currentUser?.email}</Text>
            <Text style={styles.memberSince}>Member since 2024</Text>
          </View>

          {/* User Stats Card */}
          <BlurView intensity={60} tint="light" style={styles.statsCard}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>48k</Text>
              <Text style={styles.statLabel}>Steps</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>15</Text>
              <Text style={styles.statLabel}>Badges</Text>
            </View>
          </BlurView>

          {/* Settings List */}
          <View style={styles.listGroupWrapper}>
            <BlurView intensity={40} tint="light" style={styles.listGroup}>
              <SettingRow icon="person-outline" label="Edit Profile" />
              <SettingRow icon="notifications-outline" label="Notifications" />
              <SettingRow icon="shield-checkmark-outline" label="Privacy" isLast />
            </BlurView>
          </View>

          {/* Logout Button */}
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={20} color="#FFF" style={{marginRight: 10}} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

// Sub-component for Settings Rows
const SettingRow = ({ icon, label, isLast }: { icon: any, label: string, isLast?: boolean }) => (
  <TouchableOpacity style={[styles.row, !isLast && styles.rowBorder]}>
    <View style={styles.rowLeft}>
      <Ionicons name={icon} size={22} color="#1A1A1A" style={{ marginRight: 15 }} />
      <Text style={styles.rowText}>{label}</Text>
    </View>
    <Ionicons name="chevron-forward" size={18} color="#888" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  mainWrapper: { flex: 1 },
  safeArea: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 22, alignItems: 'center' },
  avatarContainer: { alignItems: 'center', marginTop: 40, marginBottom: 30 },
  avatarCircle: { 
    width: 100, height: 100, borderRadius: 50, 
    backgroundColor: '#1A1A1A', justifyContent: 'center', 
    alignItems: 'center', marginBottom: 15,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10
  },
  avatarInitial: { fontSize: 42, fontWeight: '900', color: '#FFF' },
  userEmail: { fontSize: 20, fontWeight: '800', color: '#1A1A1A' },
  memberSince: { fontSize: 13, fontWeight: '600', color: '#888', marginTop: 4 },
  
  statsCard: {
    width: '100%', borderRadius: 32, padding: 25,
    flexDirection: 'row', justifyContent: 'space-around',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.6)',
    overflow: 'hidden', marginBottom: 25
  },
  statBox: { alignItems: 'center' },
  statNumber: { fontSize: 22, fontWeight: '900', color: '#1A1A1A' },
  statLabel: { fontSize: 12, fontWeight: '700', color: '#666', marginTop: 2 },
  divider: { width: 1, height: '70%', backgroundColor: 'rgba(0,0,0,0.05)' },

  listGroupWrapper: { width: '100%', marginBottom: 30 },
  listGroup: { 
    borderRadius: 32, overflow: 'hidden', 
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.6)' 
  },
  row: { 
    flexDirection: 'row', justifyContent: 'space-between', 
    alignItems: 'center', padding: 20 
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.04)' },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  rowText: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },

  logoutButton: { 
    backgroundColor: '#1A1A1A', width: '100%', 
    paddingVertical: 18, borderRadius: 20, 
    flexDirection: 'row', justifyContent: 'center', 
    alignItems: 'center', shadowColor: '#000', 
    shadowOpacity: 0.2, shadowRadius: 10, elevation: 5
  },
  logoutText: { color: '#FFF', fontWeight: '800', fontSize: 16 }
});