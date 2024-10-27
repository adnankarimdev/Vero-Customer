"use client";

import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";

export default function LocationConfirmerSkeleton() {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScale((prevScale) => (prevScale === 1 ? 1.2 : 1));
      setRotation((prevRotation) => prevRotation + 45);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
        <div
          className="relative z-10 p-4 bg-background rounded-full shadow-lg mb-10"
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg)`,
            transition: "transform 0.5s ease-in-out",
          }}
        >
          <MapPin className="w-12 h-12 text-primary" />
        </div>
      </div>
      <p className="absolute mt-24 text-lg font-semibold animate-pulse">
        Confirming your location...
      </p>
      <div className="absolute mt-36 flex space-x-1">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          ></div>
        ))}
      </div>
    </div>
  );
}
