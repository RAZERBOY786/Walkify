import React, { useContext, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar, 
  Platform,
  TextInput,
  KeyboardAvoidingView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Rect, Defs, RadialGradient, Stop } from 'react-native-svg';
import { BlurView } from 'expo-blur';
import { HabitContext } from '../../context/HabitContext';
import { Ionicons } from '@expo/vector-icons';

export default function HabitsScreen() {
  const { habits, toggleHabit, addHabit, deleteHabit } = useContext(HabitContext);
  const [newHabitName, setNewHabitName] = useState('');
  const insets = useSafeAreaInsets();

  const handleAdd = () => {
    if (newHabitName.trim().length > 0 && addHabit) {
      addHabit(newHabitName);
      setNewHabitName('');
    }
  };

  return (
    <View style={styles.mainWrapper}>
      
      {/* BACKGROUND */}
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

      <View style={[styles.content, { paddingTop: insets.top }]}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={{ flex: 1 }}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.dateText}>TRACKING</Text>
            <Text style={styles.title}>Habits</Text>
          </View>

          {/* INPUT */}
          <BlurView intensity={60} tint="light" style={styles.inputCard}>
            <TextInput
              style={styles.input}
              placeholder="Add a new habit..."
              placeholderTextColor="#888"
              value={newHabitName}
              onChangeText={setNewHabitName}
            />
            <TouchableOpacity onPress={handleAdd} style={styles.addIconButton}>
              <Ionicons name="add-circle" size={36} color="#1A1A1A" />
            </TouchableOpacity>
          </BlurView>

          {/* LIST */}
          <FlatList
            data={habits}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.listContainer,
              { paddingBottom: insets.bottom + 120 }
            ]}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <BlurView intensity={70} tint="light" style={styles.glassWrapper}>
                <View style={styles.habitItemContainer}>

                  {/* LEFT */}
                  <TouchableOpacity 
                    style={styles.leftSection}
                    onPress={() => toggleHabit(item.id)}
                  >
                    <View style={[
                      styles.checkbox,
                      item.completed && styles.checked
                    ]}>
                      {item.completed && (
                        <Ionicons name="checkmark" size={14} color="white" />
                      )}
                    </View>

                    <Text style={[
                      styles.habitText,
                      item.completed && styles.completedText
                    ]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>

                  {/* RIGHT */}
                  <View style={styles.rightSection}>
                    <View style={styles.streakBadge}>
                      {/* 🔥 REMOVED HERE */}
                      <Text style={styles.streakText}>
                        {item.streak} days
                      </Text>
                    </View>

                    <TouchableOpacity 
                      onPress={() => deleteHabit(item.id)}
                      style={styles.deleteButton}
                    >
                      <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>

                </View>
              </BlurView>
            )}
          />

        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1 },
  content: { flex: 1 },

  header: { paddingHorizontal: 22, marginTop: 15, marginBottom: 20 },
  dateText: { fontSize: 11, fontWeight: '800', color: '#888', letterSpacing: 1.5 },
  title: { fontSize: 36, fontWeight: '900', color: '#1A1A1A' },

  inputCard: {
    marginHorizontal: 22,
    borderRadius: 20,
    paddingLeft: 20,
    paddingRight: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    overflow: 'hidden'
  },

  input: { flex: 1, fontSize: 16, fontWeight: '600', color: '#1A1A1A' },
  addIconButton: { marginLeft: 10 },

  listContainer: { paddingHorizontal: 22 },

  glassWrapper: {
    borderRadius: 24,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },

  habitItemContainer: {
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  leftSection: { flexDirection: 'row', alignItems: 'center', flex: 1 },

  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },

  checked: { backgroundColor: '#1A1A1A', borderColor: '#1A1A1A' },

  habitText: { fontSize: 17, fontWeight: '700', color: '#1A1A1A' },

  completedText: {
    textDecorationLine: 'line-through',
    color: '#666',
    opacity: 0.6
  },

  rightSection: { flexDirection: 'row', alignItems: 'center' },

  streakBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginRight: 10
  },

  streakText: { fontSize: 13, fontWeight: '800', color: '#1A1A1A' },

  deleteButton: { padding: 5 }
});