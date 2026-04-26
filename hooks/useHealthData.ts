import { useState, useEffect } from 'react';

export function useHealthData() {
  const [steps, setSteps] = useState(8432);

  useEffect(() => {
    // Simulated background updates
    const interval = setInterval(() => {
      setSteps(s => s + Math.floor(Math.random() * 5));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return {
    steps,
    calories: Math.round(steps * 0.04),
  };
}