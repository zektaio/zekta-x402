import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  targetTime: number | null;
  onComplete?: () => void;
}

export function CountdownTimer({ targetTime, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    if (!targetTime) {
      setTimeLeft(null);
      return;
    }

    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (!hasCompleted && onComplete) {
          setHasCompleted(true);
          onComplete();
        }
        return true;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
      return false;
    };

    const isExpired = calculateTimeLeft();
    if (isExpired) {
      return;
    }

    const interval = setInterval(() => {
      const isExpired = calculateTimeLeft();
      if (isExpired) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime, onComplete, hasCompleted]);

  if (!timeLeft || !targetTime) {
    return null;
  }

  const isExpired = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;
  const showDays = timeLeft.days > 0;

  return (
    <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 rounded-lg border border-cyan-500/20" data-testid="countdown-timer">
      <Clock className="w-5 h-5 text-cyan-400" data-testid="countdown-icon" />
      <div className="flex items-center gap-2 font-mono">
        {showDays && (
          <>
            <span className={`text-xl font-bold ${isExpired ? 'text-red-400' : 'gradient-text'}`} data-testid="countdown-days">
              {String(timeLeft.days).padStart(2, '0')}d
            </span>
            <span className="text-muted-foreground">:</span>
          </>
        )}
        <span className={`text-xl font-bold ${isExpired ? 'text-red-400' : 'gradient-text'}`} data-testid="countdown-hours">
          {String(timeLeft.hours).padStart(2, '0')}h
        </span>
        <span className="text-muted-foreground">:</span>
        <span className={`text-xl font-bold ${isExpired ? 'text-red-400' : 'gradient-text'}`} data-testid="countdown-minutes">
          {String(timeLeft.minutes).padStart(2, '0')}m
        </span>
        <span className="text-muted-foreground">:</span>
        <span className={`text-xl font-bold ${isExpired ? 'text-red-400' : 'gradient-text'}`} data-testid="countdown-seconds">
          {String(timeLeft.seconds).padStart(2, '0')}s
        </span>
      </div>
    </div>
  );
}
