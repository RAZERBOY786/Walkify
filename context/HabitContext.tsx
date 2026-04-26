import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const HabitContext = createContext<any>(null);

export const HabitProvider = ({ children }: { children: React.ReactNode }) => {
  const [habits, setHabits] = useState<any[]>([]);

  // 🧠 Calculate days since created
  const calculateDays = (createdAt: string) => {
    const createdDate = new Date(createdAt);
    const today = new Date();

    const diffTime = today.getTime() - createdDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays >= 0 ? diffDays : 0;
  };

  // 📦 Load habits from storage
  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const data = await AsyncStorage.getItem('HABITS');

      if (data) {
        const parsed = JSON.parse(data);

        // 🔥 Update streak automatically
        const updated = parsed.map((habit: any) => ({
          ...habit,
          streak: calculateDays(habit.createdAt),
        }));

        setHabits(updated);
      }
    } catch (e) {
      console.log('Error loading habits', e);
    }
  };

  // 💾 Save habits whenever they change
  useEffect(() => {
    saveHabits();
  }, [habits]);

  const saveHabits = async () => {
    try {
      await AsyncStorage.setItem('HABITS', JSON.stringify(habits));
    } catch (e) {
      console.log('Error saving habits', e);
    }
  };

  // ✅ Add Habit
  const addHabit = (name: string) => {
    const newHabit = {
      id: Date.now().toString(),
      name,
      completed: false,
      streak: 0,
      createdAt: new Date().toISOString(), // 🔥 key for daily count
    };

    setHabits(prev => [newHabit, ...prev]);
  };

  // ✅ Delete Habit
  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  // ✅ Toggle (optional, does not affect streak now)
  const toggleHabit = (id: string) => {
    setHabits(prev =>
      prev.map(h =>
        h.id === id ? { ...h, completed: !h.completed } : h
      )
    );
  };

  return (
    <HabitContext.Provider
      value={{ habits, addHabit, deleteHabit, toggleHabit }}
    >
      {children}
    </HabitContext.Provider>
  );
};