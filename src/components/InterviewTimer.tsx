import { useState, useEffect, useCallback } from "react";
import { Clock } from "lucide-react";

interface InterviewTimerProps {
  duration: number; // in minutes
  onTimeUp: () => void;
}

export default function InterviewTimer({ duration, onTimeUp }: InterviewTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(duration * 60);
  const [isWarning, setIsWarning] = useState(false);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  useEffect(() => {
    if (timeRemaining <= 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;
        if (newTime <= 60 && !isWarning) {
          setIsWarning(true);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, isWarning, onTimeUp]);

  return (
    <div 
      className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium ${
        isWarning 
          ? "bg-destructive/10 text-destructive" 
          : "bg-muted text-muted-foreground"
      }`}
    >
      <Clock className={`w-4 h-4 ${isWarning ? "animate-pulse" : ""}`} />
      <span className="font-mono">{formatTime(timeRemaining)}</span>
    </div>
  );
}
