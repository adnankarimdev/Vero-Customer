import React, { useState, useEffect } from "react";

const TypingEffect = ({
  text = "Thank You 🙌🏼",
  speed = 100,
  className = "text-4xl font-bold text-gray-800",
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [index, text, speed]);

  return <div className={className}>{displayedText}</div>;
};

export default TypingEffect;
