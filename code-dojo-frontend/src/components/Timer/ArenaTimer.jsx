import { useEffect, useState } from "react";

export function Timer({ endTime }) {
  const calculateTimeLeft = () => {
    const diff = Math.max(0, endTime - Date.now());
    return Math.floor(diff / 1000);
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <span>
      {minutes}:{seconds.toString().padStart(2, "0")}
    </span>
  );
}
