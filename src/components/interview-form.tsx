"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FormData, INITIAL_FORM_DATA } from "@/lib/types";
import { useToast } from "@/components/ui/toaster";
import { Progress } from "@/components/ui/progress";
import { StepName } from "./form-step-name";
import { StepGrade } from "./form-step-grade";
import {
  validateName,
  validateGrade,
} from "@/lib/validation";

const TOTAL_STEPS = 2;

interface InterviewFormProps {
  onComplete: (data: FormData) => void;
}

export function InterviewForm({ onComplete }: InterviewFormProps) {
  const [step, setStep] = React.useState(0);
  const [direction, setDirection] = React.useState(1);
  const [formData, setFormData] = React.useState<FormData>(INITIAL_FORM_DATA);
  const { toast } = useToast();

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const validateCurrentStep = (): string | null => {
    switch (step) {
      case 0:
        return validateName(formData.name);
      case 1:
        return validateGrade(formData.grade);
      default:
        return null;
    }
  };

  const next = () => {
    const error = validateCurrentStep();
    if (error) {
      toast({ title: "Validation Error", description: error, variant: "destructive" });
      return;
    }
    if (step < TOTAL_STEPS - 1) {
      setDirection(1);
      setStep((s) => s + 1);
    } else {
      onComplete(formData);
    }
  };

  const back = () => {
    if (step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  };

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-lg mx-auto"
    >
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>
            Step {step + 1} of {TOTAL_STEPS}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} />
      </div>

      <div className="relative overflow-hidden min-h-[280px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {step === 0 && (
              <StepName
                value={formData.name}
                onChange={(v) => updateField("name", v)}
                onNext={next}
              />
            )}
            {step === 1 && (
              <StepGrade
                value={formData.grade}
                onChange={(v) => updateField("grade", v)}
                onNext={next}
                onBack={back}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
