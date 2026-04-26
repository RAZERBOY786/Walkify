import { useState, useEffect, useRef } from 'react';
import { Accelerometer } from 'expo-sensors';

export const usePedometer = () => {
  const [currentStepCount, setCurrentStepCount] = useState(0);
  
  // Refs to store values without causing constant re-renders
  const observations = useRef<number[]>([]);
  const lastStepTime = useRef(0);
  const isStepActive = useRef(false);
  
  // Track the date to handle the 12 AM reset
  const lastCheckedDate = useRef(new Date().getDate());

  useEffect(() => {
    // --- PERFECTING CONSTANTS ---
    const WINDOW_SIZE = 5;      // Smooths out the last 5 readings
    const STEP_THRESHOLD = 1.18; // The "Sweet Spot" for Samsung Accelerometers
    const COOLDOWN = 380;       // Minimum ms between steps (human walking limit)
    
    const subscription = Accelerometer.addListener(data => {
      const { x, y, z } = data;
      
      // --- 12 AM RESET LOGIC ---
      const now = new Date();
      const today = now.getDate();
      
      // If the current date is different from the last checked date, reset steps
      if (today !== lastCheckedDate.current) {
        setCurrentStepCount(0);
        lastCheckedDate.current = today;
      }

      // 1. Calculate the magnitude (Total G-Force)
      const magnitude = Math.sqrt(x * x + y * y + z * z);

      // 2. Sliding Window Average (Low-Pass Filter)
      observations.current.push(magnitude);
      if (observations.current.length > WINDOW_SIZE) {
        observations.current.shift();
      }

      // Calculate the average of the current window
      const avgMagnitude = observations.current.reduce((a, b) => a + b, 0) / observations.current.length;

      const timestamp = Date.now();

      // 3. Precision Step Logic
      // Check if we are crossing the threshold upward
      if (avgMagnitude > STEP_THRESHOLD && !isStepActive.current) {
        // Ensure it's not a double-count (Cooldown)
        if (timestamp - lastStepTime.current > COOLDOWN) {
          setCurrentStepCount(prev => prev + 1);
          lastStepTime.current = timestamp;
          isStepActive.current = true; // Lock the step
        }
      }

      // 4. Reset the Lock
      // Only allow a new step once the force returns near normal gravity
      if (avgMagnitude < (STEP_THRESHOLD - 0.05)) {
        isStepActive.current = false;
      }
    });

    // 60Hz update rate (approx 16ms)
    Accelerometer.setUpdateInterval(16); 

    return () => subscription.remove();
  }, []);

  return {
    totalStepsToday: currentStepCount,
    caloriesBurned: Math.round(currentStepCount * 0.045),
    distanceKm: ((currentStepCount * 0.78) / 1000).toFixed(2), 
  };
};