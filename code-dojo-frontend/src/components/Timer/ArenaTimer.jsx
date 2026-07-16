import { useEffect, useState, useCallback } from "react";

export function Timer({ endTime }) {
  const calculateTimeLeft = useCallback(() => {
    const diff = Math.max(0, endTime - Date.now());
    return Math.floor(diff / 1000);
  }, [endTime]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [calculateTimeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <span>
      {minutes}:{seconds.toString().padStart(2, "0")}
    </span>
  );
}
