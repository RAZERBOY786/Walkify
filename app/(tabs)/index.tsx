import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar, 
  Platform 
} from 'react-native';
// 1. Change the import here
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'; 
import Svg, { Circle, Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { usePedometer } from '../../hooks/usePedometer';

const { width } = Dimensions.get('window');
const SIZE = width * 0.78;
const STROKE = 26;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUM = RADIUS * 2 * Math.PI;

export default function HomeScreen() {
  const { totalStepsToday, caloriesBurned, distanceKm } = usePedometer();
  const insets = useSafeAreaInsets(); // Get precise padding for notches
  
  const goal = 10000;
  const progress = Math.min(totalStepsToday / goal, 1);
  const offset = CIRCUM - progress * CIRCUM;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <View style={styles.mainWrapper}>
      {/* VIBRANT MESH BACKGROUND */}
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
      
      {/* 2. Using the updated SafeAreaView */}
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={[
            styles.scrollContainer, 
            { paddingTop: Platform.OS === 'android' ? 10 : 0 } // Fine-tune padding
          ]}
        >
          
          <View style={styles.header}>
            <View>
              <Text style={styles.dateText}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase()}
              </Text>
              <Text style={styles.titleText}>{getGreeting()}</Text>
            </View>
            <TouchableOpacity style={styles.profileCircle}>
              <Ionicons name="person" size={22} color="#1A1A1A" />
            </TouchableOpacity>
          </View>

          {/* GLASS HERO CARD */}
          <BlurView intensity={70} tint="light" style={styles.mainCard}>
            <View style={styles.chartContainer}>
              <Svg width={SIZE} height={SIZE}>
                <Circle cx={SIZE/2} cy={SIZE/2} r={RADIUS} stroke="rgba(0,0,0,0.04)" strokeWidth={STROKE} fill="none" />
                <Circle 
                  cx={SIZE/2} cy={SIZE/2} r={RADIUS} stroke="#1A1A1A" strokeWidth={STROKE} 
                  fill="none" strokeDasharray={CIRCUM} strokeDashoffset={offset}
                  strokeLinecap="round" rotation="-90" origin={`${SIZE/2}, ${SIZE/2}`}
                />
              </Svg>
              <View style={styles.overlay}>
                <Text style={styles.countText}>{totalStepsToday.toLocaleString()}</Text>
                <Text style={styles.goalText}>OF {goal.toLocaleString()} STEPS</Text>
              </View>
            </View>
          </BlurView>

          {/* STATS GRID */}
          <View style={styles.statsGrid}>
            <StatCard icon="flame" label="Burn" value={caloriesBurned} unit="kcal" color="#FB8500" />
            <StatCard icon="map" label="Dist" value={distanceKm} unit="km" color="#4361EE" />
          </View>

          {/* INSIGHTS */}
          <Text style={styles.sectionTitle}>Insights</Text>
          <BlurView intensity={50} tint="light" style={styles.listGroup}>
            <DetailRow icon="battery-charging" label="Energy" value="Optimal" color="#2D6A4F" />
            <DetailRow icon="trophy" label="Progress" value={`${Math.round(progress * 100)}%`} color="#FFB703" isLast />
          </BlurView>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const StatCard = ({ icon, label, value, unit, color }: any) => (
  <BlurView intensity={60} tint="light" style={styles.statCard}>
    <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}<Text style={styles.statUnit}> {unit}</Text></Text>
    </View>
  </BlurView>
);

const DetailRow = ({ icon, label, value, color, isLast }: any) => (
  <View style={[styles.detailRow, !isLast && styles.detailBorder]}>
    <View style={styles.detailLeft}>
      <Ionicons name={icon} size={22} color={color} style={{ marginRight: 12 }} />
      <Text style={styles.detailLabelText}>{label}</Text>
    </View>
    <Text style={styles.detailValueText}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  mainWrapper: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContainer: { paddingHorizontal: 22, paddingBottom: 120 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, marginBottom: 30 },
  dateText: { fontSize: 11, fontWeight: '800', color: '#888', letterSpacing: 1.5 },
  titleText: { fontSize: 36, fontWeight: '900', color: '#1A1A1A', letterSpacing: -1.2 },
  profileCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' },
  mainCard: { borderRadius: 44, paddingVertical: 55, alignItems: 'center', marginBottom: 28, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.6)' },
  chartContainer: { justifyContent: 'center', alignItems: 'center' },
  overlay: { position: 'absolute', alignItems: 'center' },
  countText: { fontSize: 64, fontWeight: '900', color: '#1A1A1A', letterSpacing: -2.5 },
  goalText: { color: '#888', fontSize: 12, fontWeight: '800', letterSpacing: 1.2, marginTop: -5 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 },
  statCard: { width: '47%', borderRadius: 32, padding: 22, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.6)' },
  iconBox: { width: 40, height: 40, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  statLabel: { fontSize: 14, fontWeight: '700', color: '#777', marginBottom: 2 },
  statValue: { fontSize: 24, fontWeight: '900', color: '#1A1A1A' },
  statUnit: { fontSize: 13, color: '#999', fontWeight: '600' },
  sectionTitle: { fontSize: 22, fontWeight: '900', color: '#1A1A1A', marginBottom: 16, marginLeft: 6 },
  listGroup: { borderRadius: 32, paddingHorizontal: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.6)' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 22, alignItems: 'center' },
  detailBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.04)' },
  detailLeft: { flexDirection: 'row', alignItems: 'center' },
  detailLabelText: { fontSize: 17, fontWeight: '700', color: '#444' },
  detailValueText: { fontSize: 17, fontWeight: '800', color: '#1A1A1A' }
});