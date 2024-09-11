import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Send, CircleArrowRight } from "lucide-react";
import AnimatedTextareaSkeletonLoader from "@/components/ui/Skeletons/AnimatedSkeletonLoader";

interface FreeformPlatformProps {
  title: string;
  rating: number;
  questions: { questions: string[] }[];
  reviews: string[];
  currentStep: number;
  isReviewTemplateLoading: boolean;
  handleReviewChange: (value: string) => void;
  handleNext: () => void;
  handleSpeechRecord: () => void;
}

const FreeformPlatform: React.FC<FreeformPlatformProps> = ({
  title,
  rating,
  questions,
  reviews,
  currentStep,
  isReviewTemplateLoading,
  handleReviewChange,
  handleNext,
  handleSpeechRecord,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [placeholder, setPlaceholder] = useState<string>("✍🏻");

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        <p className="text-3xl font-bold">{title || "Untitled"}</p>
        <div className="max mx-auto p-6 bg-white rounded-lg shadow-sm">
          <ul className="space-y-4">
            {questions[rating - 1].questions.map((item, index) => (
              <li
                key={index}
                className="flex items-start space-x-3 transition-opacity duration-300 ease-in-out"
                style={{
                  opacity:
                    hoveredIndex === null || hoveredIndex === index ? 1 : 0.5,
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <span className="flex-shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-gray-400" />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-grow">
          {isReviewTemplateLoading ? (
            <AnimatedTextareaSkeletonLoader />
          ) : (
            <Textarea
              id="reviewArea"
              value={reviews[currentStep]}
              onFocus={() => setPlaceholder("")}
              onBlur={() => setPlaceholder(reviews[currentStep] ? "" : "✍🏻")}
              onChange={(e) => handleReviewChange(e.target.value)}
              className={
                placeholder === ""
                  ? "w-full border-none outline-none text-[16px]"
                  : "w-full border-none outline-none text-center text-[16px]"
              }
              style={{ resize: "none" }}
              rows={3}
              placeholder={placeholder}
            />
          )}
        </div>
        <div className="flex justify-between items-center w-full">
          {currentStep === questions.length - 1 ? (
            <div className="flex w-full justify-between items-center">
              <Button variant="ghost" onClick={handleSpeechRecord}>
                <Mic />
              </Button>

              <Button
                variant="ghost"
                onClick={handleNext}
                disabled={
                  isReviewTemplateLoading || reviews[currentStep].trim() === ""
                }
              >
                <Send />
              </Button>
            </div>
          ) : (
            <CircleArrowRight />
          )}
        </div>
      </div>
    </div>
  );
};

export default FreeformPlatform;
