"use client";

import { businessConfig } from "@/lib/config";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export default function ProgressBar({
  currentStep,
  totalSteps,
  steps,
}: ProgressBarProps) {
  return (
    <div className="w-full py-4">
      {/* Progress line */}
      <div className="relative flex items-center justify-between mb-2">
        {/* Background line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2" />

        {/* Active line */}
        <div
          className="absolute top-1/2 left-0 h-0.5 -translate-y-1/2 transition-all duration-300"
          style={{
            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
            backgroundColor: businessConfig.theme.primary,
          }}
        />

        {/* Step circles */}
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div
              key={step}
              className="relative flex flex-col items-center z-10"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  isCompleted || isCurrent
                    ? "text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
                style={{
                  backgroundColor:
                    isCompleted || isCurrent
                      ? businessConfig.theme.primary
                      : undefined,
                }}
              >
                {isCompleted ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Step labels */}
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCurrent = stepNumber === currentStep;

          return (
            <span
              key={step}
              className={`text-xs text-center flex-1 ${
                isCurrent ? "font-medium" : "text-gray-500"
              }`}
              style={{ color: isCurrent ? businessConfig.theme.primary : undefined }}
            >
              {step}
            </span>
          );
        })}
      </div>
    </div>
  );
}
