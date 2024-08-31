import { CheckCircle } from "lucide-react";

interface Step {
  title: string;
  description: string;
  emoji: string;
}

interface TutorialStepsProps {
  steps: Step[];
}

export default function TutorialSteps({ steps }: TutorialStepsProps) {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <ol className="relative border-l border-gray-200 dark:border-gray-700">
        {steps.map((step, index) => (
          <li key={index} className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-transparent rounded-full -left-4 ring-4 ring-white dark:ring-gray-900">
              {/* <CheckCircle className="w-5 h-5 text-primary-foreground" /> */}
              {step.emoji}
            </span>
            <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
              {step.title}
            </h3>
            <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
