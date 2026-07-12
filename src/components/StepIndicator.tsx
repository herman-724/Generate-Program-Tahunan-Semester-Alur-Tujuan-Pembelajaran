import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  shortTitle: string;
}

interface StepIndicatorProps {
  currentStep: number;
  steps: Step[];
  onStepClick: (stepNumber: number) => void;
  completedSteps: number[];
}

export default function StepIndicator({ currentStep, steps, onStepClick, completedSteps }: StepIndicatorProps) {
  return (
    <div className="bg-black/20 backdrop-blur-md border-b border-white/5 px-6 py-4 font-sans overflow-x-auto relative z-10">
      <div className="max-w-6xl mx-auto flex items-center justify-between min-w-[760px] md:min-w-0">
        {steps.map((step, index) => {
          const isActive = currentStep === step.number;
          const isCompleted = completedSteps.includes(step.number);

          return (
            <React.Fragment key={step.number}>
              {/* Step circle + title */}
              <button
                id={`step-indicator-${step.number}`}
                onClick={() => onStepClick(step.number)}
                className="flex items-center gap-2.5 group cursor-pointer text-left focus:outline-none shrink-0"
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-tr from-amber-400 to-orange-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)] border border-amber-300/30'
                      : isCompleted
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-white/5 text-slate-400 border border-white/15 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : step.number}
                </div>
                <div>
                  <p
                    className={`text-[10px] font-bold tracking-wider uppercase ${
                      isActive ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-400'
                    }`}
                  >
                    Langkah 0{step.number}
                  </p>
                  <p
                    className={`text-xs font-bold ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'
                    }`}
                  >
                    {step.shortTitle}
                  </p>
                </div>
              </button>

              {/* Line connector */}
              {index < steps.length - 1 && (
                <div
                  className={`h-[2px] grow mx-3 transition-colors ${
                    isCompleted ? 'bg-emerald-500/30' : 'bg-white/5'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
