"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface StepNameProps {
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
}

export function StepName({ value, onChange, onNext }: StepNameProps) {
  return (
    <Card className="border-gray-800">
      <CardHeader>
        <CardTitle className="text-cyan-400">What is your name?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="Enter your name (letters only)"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onNext()}
            maxLength={20}
            autoFocus
          />
          <p className="text-xs text-gray-500">
            Max 20 characters, letters and spaces only.
          </p>
        </div>
        <div className="flex justify-end">
          <Button onClick={onNext}>Next →</Button>
        </div>
      </CardContent>
    </Card>
  );
}
