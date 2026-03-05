"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { GRADE_OPTIONS } from "@/lib/types";

interface StepGradeProps {
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepGrade({ value, onChange, onNext, onBack }: StepGradeProps) {
  return (
    <Card className="border-gray-800">
      <CardHeader>
        <CardTitle className="text-cyan-400">What grade are you in?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Grade Level</Label>
          <div className="grid grid-cols-2 gap-3">
            {GRADE_OPTIONS.map((grade) => (
              <button
                key={grade}
                type="button"
                onClick={() => onChange(grade)}
                className={`rounded-lg border p-3 text-sm font-medium transition-all ${
                  value === grade
                    ? "border-cyan-500 bg-cyan-950 text-cyan-300"
                    : "border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-600 hover:bg-gray-800"
                }`}
              >
                {grade} Grade
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            ← Back
          </Button>
          <Button onClick={onNext}>Review Answers →</Button>
        </div>
      </CardContent>
    </Card>
  );
}
