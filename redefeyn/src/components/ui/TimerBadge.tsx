"use client";

import { useState, useEffect } from "react";
import { parseISO, addDays, differenceInSeconds } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function TimerBadge({
  timestamp = "2024-10-29T23:46:35+00:00",
}) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const targetDate = addDays(parseISO(timestamp), 3);

    const timer = setInterval(() => {
      const now = new Date();
      const diff = differenceInSeconds(targetDate, now);

      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft("Expired");
        clearInterval(timer);
      } else {
        const days = Math.floor(diff / (24 * 60 * 60));
        const hours = Math.floor((diff % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((diff % (60 * 60)) / 60);
        const seconds = diff % 60;
        
        let timeLeft;
        
        if (days > 0) {
          timeLeft = `${days}d ${hours}h`;
        } else if (hours > 0) {
          timeLeft = `${hours}h ${minutes}m`;
        } else if (minutes > 0) {
          timeLeft = `${minutes}m ${seconds}s`;
        } else {
          timeLeft = `${seconds}s`;
        }
        
        setTimeLeft(timeLeft);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timestamp]);

  return (
    <Badge
      variant="outline"
      className={`
        ${
          isExpired
            ? "bg-gradient-to-r from-purple-500 to-purple-700 text-white font-medium mt-2"
            : timeLeft.startsWith("0d")
              ? "bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-medium mt-2"
              : "bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-medium mt-2"
        }
      `}
    >
      {isExpired ? (
        "Can Review Again"
      ) : (
        <>
          Review Again In:{" "}
          <span className="text-yellow-300 font-bold ml-1">{timeLeft}</span>
        </>
      )}
    </Badge>
  );
}
