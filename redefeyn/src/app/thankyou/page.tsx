"use client";
import { useState, useEffect } from "react";
import TypingEffect from "@/components/ui/TypingEffect";

export default function ThankYouPage() {
  const [showSecondComponent, setShowSecondComponent] = useState(false);
  const [showFirstEmoji, setShowFirstEmoji] = useState(false);
  const [showSecondEmoji, setShowSecondEmoji] = useState(false);

  useEffect(() => {
    const firstEmojiTimer = setTimeout(() => {
      setShowFirstEmoji(true);
    }, 2800); // Show emoji after the first text types

    const secondComponentTimer = setTimeout(() => {
      setShowSecondComponent(true);
    }, 3000); // Wait for 3 seconds for the second text

    const secondEmojiTimer = setTimeout(() => {
      setShowSecondEmoji(true);
    }, 4200); // Show emoji after the second text types

    return () => {
      clearTimeout(firstEmojiTimer);
      clearTimeout(secondComponentTimer);
      clearTimeout(secondEmojiTimer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white space-y-4">
      <div className="flex items-center">
        <TypingEffect
          text="See how fast that was? You’re a feedback superstar!"
          speed={50}
        />
        {showFirstEmoji && <span className="text-4xl ml-2">🏃💨</span>}
      </div>

      {showSecondComponent && (
        <div className="flex items-center">
          <TypingEffect
            text="Thanks for using Vero"
            speed={50}
            className="text-md text-muted-foreground"
          />
          {showSecondEmoji && <span className="text-xl ml-2">🥳</span>}
        </div>
      )}
    </div>
  );
}
