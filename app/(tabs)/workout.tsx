import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  Modal, StatusBar, Image, Dimensions, Animated, Easing, Alert, ScrollView
} from 'react-native';
import Svg, { Rect, Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/* ================= CONSTANTS ================= */
const WORK_TIME = 30;
const REST_TIME = 15;

/* ================= BASE EXERCISES ================= */
const baseExercises = [
  { name: 'Jumping Jacks', gif: 'https://media.giphy.com/media/3o7TKsQ8v0fG4Y6Qd6/giphy.gif', description: 'Full body cardio move that improves coordination.' },
  { name: 'Burpees', gif: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif', description: 'High-intensity full body exercise.' },
  { name: 'Mountain Climbers', gif: 'https://media.giphy.com/media/26ufnwz3wDUli7GU0/giphy.gif', description: 'Core and cardio exercise.' },
  { name: 'High Knees', gif: 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif', description: 'Running in place with high knee lift.' },
  { name: 'Plank Jacks', gif: 'https://media.giphy.com/media/3o7TKL9urUjN6A1S8M/giphy.gif', description: 'Plank with jumping jack motion.' },
  { name: 'Push-ups', gif: 'https://media.giphy.com/media/26BRv0D4v6v1s2f1K/giphy.gif', description: 'Classic upper body strength exercise.' },
  { name: 'Squats', gif: 'https://media.giphy.com/media/l0HlRnAWXxn0MhKLK/giphy.gif', description: 'Fundamental lower body exercise.' },
  { name: 'Lunges', gif: 'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif', description: 'Unilateral leg exercise for balance.' },
  { name: 'Bicycle Crunches', gif: 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif', description: 'Effective oblique exercise.' },
  { name: 'Jump Squats', gif: 'https://media.giphy.com/media/26ufnwz3wDUli7GU0/giphy.gif', description: 'Explosive lower body power move.' },
  { name: 'Plank', gif: 'https://media.giphy.com/media/3o7TKSjRqiKkW6b4c0/giphy.gif', description: 'Isometric core strengthener.' },
  { name: 'Skater Jumps', gif: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif', description: 'Lateral agility exercise.' },
  { name: 'Russian Twists', gif: 'https://media.giphy.com/media/26BRv0D4v6v1s2f1K/giphy.gif', description: 'Rotational core exercise.' },
  { name: 'Wall Sit', gif: 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif', description: 'Isometric lower body endurance.' },
  { name: 'Jumping Lunges', gif: 'https://media.giphy.com/media/l0HlRnAWXxn0MhKLK/giphy.gif', description: 'Dynamic lunge with cardio.' },
];

/* ================= WORKOUT PLANS ================= */
const WORKOUT_PLANS = [
  {
    id: 'p1',
    title: 'Weight Loss HIIT',
    subtitle: 'Burn fat fast',
    level: 'Hard',
    color: '#FF4757',
    icon: 'flame',
    days: Array.from({ length: 30 }, (_, i) => {
      const dayNum = i + 1;
      if (dayNum % 4 === 0) return { day: dayNum, isRest: true, exercises: [] };
      const start = (dayNum - 1) % 6;
      return {
        day: dayNum,
        isRest: false,
        exercises: baseExercises.slice(start, start + 10).map(ex => ({ ...ex, workTime: WORK_TIME }))
      };
    })
  },
  {
    id: 'p2',
    title: 'Arms & Shoulders',
    subtitle: 'Build strong upper body',
    level: 'Medium',
    color: '#4361EE',
    icon: 'barbell',
    days: Array.from({ length: 30 }, (_, i) => {
      const dayNum = i + 1;
      if (dayNum % 4 === 0) return { day: dayNum, isRest: true, exercises: [] };
      return {
        day: dayNum,
        isRest: false,
        exercises: baseExercises.slice(5, 15).map(ex => ({ ...ex, workTime: WORK_TIME }))
      };
    })
  },
  {
    id: 'p3',
    title: 'Full Body Burn',
    subtitle: 'Total body transformation',
    level: 'Hard',
    color: '#F72585',
    icon: 'body',
    days: Array.from({ length: 30 }, (_, i) => {
      const dayNum = i + 1;
      if (dayNum % 4 === 0) return { day: dayNum, isRest: true, exercises: [] };
      return {
        day: dayNum,
        isRest: false,
        exercises: baseExercises.map(ex => ({ ...ex, workTime: WORK_TIME }))
      };
    })
  },
  {
    id: 'p4',
    title: 'Legs & Glutes',
    subtitle: 'Sculpt strong lower body',
    level: 'Medium',
    color: '#06D6A0',
    icon: 'walk',
    days: Array.from({ length: 30 }, (_, i) => {
      const dayNum = i + 1;
      if (dayNum % 4 === 0) return { day: dayNum, isRest: true, exercises: [] };
      return {
        day: dayNum,
        isRest: false,
        exercises: baseExercises.slice(6, 16).map(ex => ({ ...ex, workTime: WORK_TIME }))
      };
    })
  },
  {
    id: 'p5',
    title: 'Core Crusher',
    subtitle: 'Strong & defined abs',
    level: 'Medium',
    color: '#7209B7',
    icon: 'body',
    days: Array.from({ length: 30 }, (_, i) => {
      const dayNum = i + 1;
      if (dayNum % 4 === 0) return { day: dayNum, isRest: true, exercises: [] };
      return {
        day: dayNum,
        isRest: false,
        exercises: baseExercises.slice(8, 18).map(ex => ({ ...ex, workTime: WORK_TIME }))
      };
    })
  },
  {
    id: 'p6',
    title: 'Cardio HIIT',
    subtitle: 'Maximum fat burn',
    level: 'Hard',
    color: '#FF9F1C',
    icon: 'heart',
    days: Array.from({ length: 30 }, (_, i) => {
      const dayNum = i + 1;
      if (dayNum % 4 === 0) return { day: dayNum, isRest: true, exercises: [] };
      return {
        day: dayNum,
        isRest: false,
        exercises: baseExercises.slice(0, 10).map(ex => ({ ...ex, workTime: WORK_TIME }))
      };
    })
  },
];

/* ================= PROGRESS STORAGE ================= */
const usePlanProgress = (planId: string) => {
  const [completedDays, setCompletedDays] = useState<number[]>([]);

  useEffect(() => {
    loadProgress(planId);
  }, [planId]);

  const loadProgress = async (id: string) => {
    try {
      const saved = await AsyncStorage.getItem(`@progress_${id}`);
      if (saved) setCompletedDays(JSON.parse(saved));
    } catch (e) {}
  };

  const markDayAsCompleted = async (dayNumber: number) => {
    if (!completedDays.includes(dayNumber)) {
      const updated = [...completedDays, dayNumber].sort((a, b) => a - b);
      setCompletedDays(updated);
      try {
        await AsyncStorage.setItem(`@progress_${planId}`, JSON.stringify(updated));
      } catch (e) {}
    }
  };

  const isDayCompleted = (dayNumber: number) => completedDays.includes(dayNumber);
  const completedCount = completedDays.length;
  const totalActiveDays = 23; // 30 days - 7 rest days

  return { completedCount, isDayCompleted, markDayAsCompleted, totalActiveDays };
};

/* ================= CIRCULAR TIMER & PLAYER (same as before) ================= */
function CircularTimer({ duration, timeLeft, isRest = false }: any) {
  const radius = 85;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const progress = useRef(new Animated.Value(0)).current;

  const percentageLeft = timeLeft / duration;
  let strokeColor = isRest ? '#3498db' : '#2ecc71';
  if (!isRest && percentageLeft <= 0.5 && percentageLeft > 0.2) strokeColor = '#f1c40f';
  else if (!isRest && percentageLeft <= 0.2) strokeColor = '#e74c3c';

  useEffect(() => {
    Animated.timing(progress, {
      toValue: (duration - timeLeft) / duration,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start();
  }, [timeLeft]);

  const strokeDashoffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={200} height={200}>
        <Circle stroke="#f0f0f0" fill="none" cx="100" cy="100" r={radius} strokeWidth={strokeWidth} />
        <AnimatedCircle stroke={strokeColor} fill="none" cx="100" cy="100" r={radius}
          strokeWidth={strokeWidth} strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset} strokeLinecap="round"
          rotation="-90" origin="100,100"
        />
      </Svg>
      <Text style={[styles.timerText, { color: strokeColor }]}>{timeLeft}</Text>
    </View>
  );
}

function WorkoutPlayer({ day, color, onClose, onComplete }: any) {
  // ... (same as previous version - kept for brevity, copy from last response if needed)
  // I'll keep it short here but in full code it's complete
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRestPhase, setIsRestPhase] = useState(false);
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isPaused, setIsPaused] = useState(false);

  const startTimeRef = useRef(Date.now());
  const lastSpokenRef = useRef<number | null>(null);

  const currentExercise = day.exercises[currentIndex];
  const isLastExercise = currentIndex === day.exercises.length - 1;

  // Timer logic same as before...
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const currentDuration = isRestPhase ? REST_TIME : WORK_TIME;
      const remaining = Math.max(0, currentDuration - elapsed);
      setTimeLeft(remaining);

      if (remaining > 0 && remaining <= 3 && lastSpokenRef.current !== remaining) {
        lastSpokenRef.current = remaining;
        Speech.speak(remaining.toString());
      }

      if (remaining <= 0) {
        if (isRestPhase) {
          if (isLastExercise) {
            Speech.speak('Great job! Workout complete!');
            onComplete?.(day.day);
            onClose();
          } else {
            setCurrentIndex(p => p + 1);
            setIsRestPhase(false);
            Speech.speak(`Next: ${day.exercises[currentIndex + 1].name}`);
            startTimeRef.current = Date.now();
          }
        } else {
          if (isLastExercise) {
            Speech.speak('Final exercise done!');
            onComplete?.(day.day);
            onClose();
          } else {
            setIsRestPhase(true);
            Speech.speak('Rest');
            startTimeRef.current = Date.now();
          }
        }
      }
    }, 200);
    return () => clearInterval(interval);
  }, [currentIndex, isRestPhase, isPaused]);

  const togglePause = () => setIsPaused(!isPaused);
  const skipToNext = () => {
    if (isLastExercise) {
      onComplete?.(day.day);
      onClose();
    } else if (isRestPhase) {
      setCurrentIndex(p => p + 1);
      setIsRestPhase(false);
      startTimeRef.current = Date.now();
    } else {
      setIsRestPhase(true);
      startTimeRef.current = Date.now();
    }
  };

  return (
    <View style={styles.playerWrapper}>
      <View style={[styles.playerHeader, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={onClose}><Ionicons name="close-circle" size={32} color="#333" /></TouchableOpacity>
        <Text style={styles.playerProgress}>{currentIndex + 1} / {day.exercises.length}</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.visualArea}>
        {isRestPhase ? (
          <View style={styles.restContainer}>
            <Ionicons name="timer-outline" size={120} color="#3498db" />
            <Text style={styles.restText}>REST TIME</Text>
          </View>
        ) : (
          <Image source={{ uri: currentExercise.gif }} style={styles.exerciseGif} />
        )}
      </View>

      <View style={styles.playerBody}>
        <Text style={styles.playerExerciseName}>
          {isRestPhase ? "TAKE A BREATH" : currentExercise.name.toUpperCase()}
        </Text>
        <CircularTimer duration={isRestPhase ? REST_TIME : WORK_TIME} timeLeft={timeLeft} isRest={isRestPhase} />

        <View style={styles.playerControls}>
          <TouchableOpacity style={[styles.controlBtn, { backgroundColor: '#eee' }]} onPress={togglePause}>
            <Ionicons name={isPaused ? "play" : "pause"} size={30} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.controlBtn, { backgroundColor: color }]} onPress={skipToNext}>
            <Ionicons name="play-skip-forward" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

/* ================= MAIN SCREEN ================= */
export default function WorkoutScreen() {
  const insets = useSafeAreaInsets();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<any>(null);
  const [startWorkout, setStartWorkout] = useState(false);

  const [activePlanId, setActivePlanId] = useState(WORKOUT_PLANS[0].id);
  const currentPlan = WORKOUT_PLANS.find(p => p.id === activePlanId) || WORKOUT_PLANS[0];
  const { completedCount, isDayCompleted, markDayAsCompleted, totalActiveDays } = usePlanProgress(activePlanId);

  const handleWorkoutComplete = (dayNumber: number) => {
    markDayAsCompleted(dayNumber);
    Alert.alert("🎉 Congratulations!", `Day ${dayNumber} of ${currentPlan.title} completed!`);
  };

  return (
    <View style={styles.mainWrapper}>
      <StatusBar barStyle="dark-content" translucent />

      <View style={StyleSheet.absoluteFill}>
        <Svg height="100%" width="100%">
          <Rect x="0" y="0" width="100%" height="100%" fill="#F8F9FA" />
          <Defs>
            <RadialGradient id="grad1" cx="20%" cy="10%" rx="50%" ry="40%"><Stop offset="0%" stopColor="#4361EE" stopOpacity="0.08" /><Stop offset="100%" stopColor="#4361EE" stopOpacity="0" /></RadialGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad1)" />
        </Svg>
      </View>

      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.dateText}>CHOOSE YOUR GOAL</Text>
          <Text style={styles.title}>Workout Plans</Text>
        </View>

        {/* Progress Wish Section */}
        <View style={styles.progressWishCard}>
          <Text style={styles.wishTitle}>Your Progress</Text>
          <Text style={styles.wishSubtitle}>{currentPlan.title}</Text>
          <View style={styles.progressRow}>
            <View style={styles.progressCircle}>
              <Text style={styles.progressBig}>{Math.round((completedCount / totalActiveDays) * 100)}%</Text>
            </View>
            <View>
              <Text style={styles.progressText}>{completedCount} / {totalActiveDays} days completed</Text>
              <Text style={styles.motivationText}>Keep going, you're doing great! 💪</Text>
            </View>
          </View>
        </View>

        {/* All Workout Sections */}
        <FlatList
          data={WORKOUT_PLANS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listPadding}
          renderItem={({ item }) => (
            <TouchableOpacity 
              activeOpacity={0.9} 
              style={styles.planCardContainer}
              onPress={() => {
                setActivePlanId(item.id);
                setSelectedPlan(item);
              }}
            >
              <BlurView intensity={90} tint="light" style={[styles.planCard, { borderLeftColor: item.color, borderLeftWidth: 6 }]}>
                <View style={styles.planInfo}>
                  <Ionicons name={item.icon as any} size={28} color={item.color} />
                  <Text style={styles.planTitle}>{item.title}</Text>
                  <Text style={styles.planSubtitle}>{item.subtitle}</Text>
                  <Text style={[styles.planLevel, { color: item.color }]}>{item.level}</Text>
                </View>
              </BlurView>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Day Selection Modal */}
      <Modal visible={!!selectedPlan} animationType="slide" transparent>
        <BlurView intensity={100} tint="dark" style={styles.modalOverlay}>
          <View style={[styles.modalContent, { marginTop: insets.top + 40 }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setSelectedPlan(null)}>
                <Ionicons name="arrow-back" size={28} color="#1A1A1A" />
              </TouchableOpacity>
              <Text style={styles.modalTitleText}>{selectedPlan?.title}</Text>
              <View style={{ width: 28 }} />
            </View>

            <FlatList
              data={selectedPlan?.days}
              numColumns={4}
              keyExtractor={(item) => item.day.toString()}
              contentContainerStyle={styles.daysGrid}
              renderItem={({ item }) => {
                const completed = isDayCompleted(item.day);
                return (
                  <TouchableOpacity 
                    style={[styles.dayBox, item.isRest ? styles.restBox : { borderColor: selectedPlan.color }]} 
                    onPress={() => !item.isRest && setSelectedDay(item)}
                  >
                    {item.isRest ? (
                      <Ionicons name="cafe-outline" size={24} color="#aaa" />
                    ) : (
                      <Text style={[styles.dayBoxText, { color: selectedPlan.color }]}>{item.day}</Text>
                    )}
                    <Text style={styles.dayBoxLabel}>{item.isRest ? 'Rest' : completed ? '✓ Done' : 'Day'}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </BlurView>
      </Modal>

      {/* Day Detail Modal */}
      <Modal visible={!!selectedDay} animationType="slide" transparent>
        <BlurView intensity={100} tint="dark" style={styles.modalOverlay}>
          <View style={[styles.modalContent, { marginTop: insets.top + 40 }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setSelectedDay(null)}><Ionicons name="close" size={28} color="#1A1A1A" /></TouchableOpacity>
              <Text style={styles.modalTitleText}>Day {selectedDay?.day} • {currentPlan.title}</Text>
              <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.exerciseList}>
              {selectedDay?.exercises.map((item: any, index: number) => (
                <View key={index} style={styles.exerciseRow}>
                  <View style={[styles.iconCircle, { backgroundColor: currentPlan.color + '15' }]}>
                    <Ionicons name="fitness" size={24} color={currentPlan.color} />
                  </View>
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseNameText}>{item.name}</Text>
                    <Text style={styles.exerciseDescText}>{item.description}</Text>
                    <Text style={styles.exerciseTimeText}>30s work + 15s rest</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity style={[styles.startBtn, { backgroundColor: currentPlan.color }]} onPress={() => setStartWorkout(true)}>
              <Text style={styles.startBtnText}>START TODAY'S WORKOUT</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>

      {/* Workout Player */}
      <Modal visible={startWorkout} animationType="fade">
        {selectedDay && (
          <WorkoutPlayer 
            day={selectedDay} 
            color={currentPlan.color} 
            onClose={() => setStartWorkout(false)}
            onComplete={handleWorkoutComplete}
          />
        )}
      </Modal>
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: '#FFF' },
  container: { flex: 1 },
  header: { paddingHorizontal: 22, marginTop: 10, marginBottom: 20 },
  dateText: { fontSize: 11, fontWeight: '900', color: '#888', letterSpacing: 1.5 },
  title: { fontSize: 34, fontWeight: '900', color: '#1A1A1A', letterSpacing: -1.2 },

  /* Progress Wish Section */
  progressWishCard: {
    marginHorizontal: 22,
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    marginBottom: 25,
  },
  wishTitle: { fontSize: 16, fontWeight: '700', color: '#666', marginBottom: 4 },
  wishSubtitle: { fontSize: 22, fontWeight: '900', color: '#1A1A1A', marginBottom: 16 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  progressCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 7,
    borderColor: '#FF4757'
  },
  progressBig: { fontSize: 28, fontWeight: '900', color: '#FF4757' },
  progressText: { fontSize: 16, fontWeight: '700', color: '#333' },
  motivationText: { fontSize: 13, color: '#666', marginTop: 4 },

  listPadding: { paddingHorizontal: 22, paddingBottom: 40 },
  planCardContainer: { marginBottom: 16 },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  planInfo: { flex: 1 },
  planTitle: { fontSize: 20, fontWeight: '900', color: '#1A1A1A', marginTop: 8 },
  planSubtitle: { fontSize: 14, color: '#666', marginVertical: 4 },
  planLevel: { fontSize: 12, fontWeight: '800', marginTop: 4 },

  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 25, flex: 1 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  modalTitleText: { fontSize: 22, fontWeight: '900', color: '#1A1A1A' },

  daysGrid: { paddingBottom: 30 },
  dayBox: { width: (width - 70) / 4, height: 78, margin: 5, borderRadius: 18, borderWidth: 2.5, justifyContent: 'center', alignItems: 'center' },
  restBox: { backgroundColor: '#f9f9f9', borderColor: '#eee' },
  dayBoxText: { fontSize: 19, fontWeight: '900' },
  dayBoxLabel: { fontSize: 9, color: '#999', fontWeight: '800', marginTop: 4, textTransform: 'uppercase' },

  exerciseList: { paddingVertical: 10, paddingBottom: 100 },
  exerciseRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 18, backgroundColor: '#F8F9FA', padding: 16, borderRadius: 22 },
  iconCircle: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', marginTop: 2 },
  exerciseInfo: { marginLeft: 16, flex: 1 },
  exerciseNameText: { fontSize: 17, fontWeight: '800', color: '#1A1A1A', marginBottom: 4 },
  exerciseDescText: { fontSize: 14, color: '#555', lineHeight: 20, marginBottom: 6 },
  exerciseTimeText: { fontSize: 13, color: '#666', fontWeight: '700' },

  startBtn: { height: 62, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  startBtnText: { color: '#fff', fontSize: 17, fontWeight: '900', letterSpacing: 1 },

  playerWrapper: { flex: 1, backgroundColor: '#fff' },
  playerHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center' },
  playerProgress: { fontSize: 16, fontWeight: '800', color: '#aaa' },
  visualArea: { height: height * 0.42, backgroundColor: '#fafafa', justifyContent: 'center', alignItems: 'center' },
  exerciseGif: { width: '85%', height: '85%', resizeMode: 'contain' },
  restContainer: { alignItems: 'center' },
  restText: { fontSize: 28, fontWeight: '900', color: '#3498db', marginTop: 20 },
  playerBody: { flex: 1, padding: 20, alignItems: 'center' },
  playerExerciseName: { fontSize: 24, fontWeight: '900', color: '#333', textAlign: 'center', marginBottom: 20 },
  timerText: { position: 'absolute', fontSize: 48, fontWeight: 'bold' },
  playerControls: { flexDirection: 'row', gap: 30, marginTop: 30 },
  controlBtn: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center' },
});