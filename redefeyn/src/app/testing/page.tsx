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
    }, 1600); // Show emoji after the first text types

    const secondComponentTimer = setTimeout(() => {
      setShowSecondComponent(true);
    }, 2000); // Wait for 3 seconds for the second text

    const secondEmojiTimer = setTimeout(() => {
      setShowSecondEmoji(true);
    }, 3300); // Show emoji after the second text types

    return () => {
      clearTimeout(firstEmojiTimer);
      clearTimeout(secondComponentTimer);
      clearTimeout(secondEmojiTimer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white space-y-4">
    </div>
  );
}
