"use client";
import { useState, useEffect } from "react";
import TypingEffect from "@/components/ui/TypingEffect";

export default function DuplicateReviewPage() {
  const [showSecondComponent, setShowSecondComponent] = useState(false);
  const [showFirstEmoji, setShowFirstEmoji] = useState(false);
  const [showSecondEmoji, setShowSecondEmoji] = useState(false);

  useEffect(() => {
    const firstEmojiTimer = setTimeout(() => {
      setShowFirstEmoji(true);
    }, 2000); // Show emoji after the first text types

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
      <div className="flex items-center">
        <TypingEffect
          text="You've already posted your review!"
          speed={50}
          className="text-2xl"
        />
        {showFirstEmoji && <span className="text-2xl ml-2">🦸‍♂️</span>}
      </div>

      {/* Embedding the YouTube video iframe with autoplay */}
      <div className=" flex mt-6 w-full items-center justify-center ">
        <iframe
          src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
        ></iframe>
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
