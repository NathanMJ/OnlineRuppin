import { useState, useEffect } from 'react';

export default function FCTimer({ start }) {
  const [time, setTime] = useState('00:00');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      
      // Parser la date ISO directement
      const startTime = new Date(start);
      
      // Calculer la différence en secondes
      const diff = Math.floor((now - startTime) / 1000);

      if (diff < 0) {
        setTime('00:00');
        return;
      }

      const diffHours = Math.floor(diff / 3600);
      const diffMinutes = Math.floor((diff % 3600) / 60);
      const diffSeconds = diff % 60;

      let formattedTime;
      if (diffHours > 0) {
        // Format HH:MM:SS si plus d'une heure
        formattedTime = `${diffHours.toString().padStart(2, '0')}:${diffMinutes.toString().padStart(2, '0')}:${diffSeconds.toString().padStart(2, '0')}`;
      } else {
        // Format MM:SS si moins d'une heure
        formattedTime = `${diffMinutes.toString().padStart(2, '0')}:${diffSeconds.toString().padStart(2, '0')}`;
      }

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