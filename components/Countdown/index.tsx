import { useState, useEffect } from "react";

interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown() {
  const [countdown, setCountdown] = useState<CountdownValues>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Set target date to March 16, 2025 23:59:59 Rome time (UTC+1 in winter, UTC+2 in summer)
    // March is in winter time (CET), so UTC+1
    const targetDate = new Date("2025-03-16T22:59:59Z"); // 23:59:59 Rome time (UTC+1)

    const updateCountdown = () => {
      // Convert current time to Rome time
      const now = new Date();
      const romeOffset = 60; // Rome timezone offset in minutes (UTC+1)
      const localOffset = now.getTimezoneOffset();
      const adjustedNow = new Date(
        now.getTime() + (localOffset + romeOffset) * 60000
      );

      const diff = targetDate.getTime() - adjustedNow.getTime();

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setCountdown({ days, hours, minutes, seconds });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <p className="text-purple-500 mt-2 md:mt-6">
      Applications closing in {countdown.days}d, {countdown.hours}hr,{" "}
      {countdown.minutes}m, {countdown.seconds}s
    </p>
  );
}
