import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: '#2D6A4F',
      tabBarInactiveTintColor: '#999',
      tabBarStyle: styles.tabBar,
      tabBarBackground: () => (
        <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
      ),
      headerShown: false, // Using custom headers for "Apple" look
    }}>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Activity',
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "fitness" : "fitness-outline"} size={26} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="habits" 
        options={{ 
          title: 'Habits',
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "checkmark-circle" : "checkmark-circle-outline"} size={26} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="workout" 
        options={{ 
          title: 'Workouts',
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "barbell" : "barbell-outline"} size={26} color={color} />
        }} 
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    borderTopWidth: 0,
    elevation: 0,
    height: 85,
    paddingBottom: 25,
  }
});