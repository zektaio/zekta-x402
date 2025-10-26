import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface InlineCountdownProps {
  targetTime?: number | null;
}

export function InlineCountdown({ targetTime }: InlineCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!targetTime) {
      setTimeLeft('');
      return;
    }

    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft('00h : 00m : 00s');
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(`${String(hours).padStart(2, '0')}h : ${String(minutes).padStart(2, '0')}m : ${String(seconds).padStart(2, '0')}s`);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [targetTime]);

  if (!targetTime || !timeLeft) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-emerald-400">
      <Clock className="w-4 h-4" />
      <span className="font-mono text-sm">{timeLeft}</span>
    </div>
  );
}
