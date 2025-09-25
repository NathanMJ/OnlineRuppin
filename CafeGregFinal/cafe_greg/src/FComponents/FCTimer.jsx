import { useState, useEffect } from 'react';

export default function FCTimer({ start }) {
  const [time, setTime] = useState('00:00');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      
      // Parser le format "HH:MM:SS" et créer une date aujourd'hui avec cette heure
      const [hours, minutes, seconds] = start.split(':').map(Number);
      const startTime = new Date();
      startTime.setHours(hours, minutes, seconds, 0);
      
      // Calculer la différence en secondes
      const diff = Math.floor((now - startTime) / 1000);

      if (diff < 0) {
        setTime('00:00');
        return;
      }

      const diffMinutes = Math.floor(diff / 60);
      const diffSeconds = diff % 60;

      const formattedTime = `${diffMinutes.toString().padStart(2, '0')}:${diffSeconds.toString().padStart(2, '0')}`;
      setTime(formattedTime);
    };

    // Mise à jour immédiate
    updateTimer();

    // Mise à jour chaque seconde
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [start]);

  return <p className="timer">{time}</p>;
}