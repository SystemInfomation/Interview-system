"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toaster";
import { FormData, GRADE_OPTIONS } from "@/lib/types";
import { validateName, validateGrade } from "@/lib/validation";

export default function ReviewPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = React.useState<FormData | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    const stored = sessionStorage.getItem("formData");
    if (!stored) {
      router.replace("/");
      return;
    }
    setFormData(JSON.parse(stored));
  }, [router]);

  const handleSubmit = async () => {
    if (!formData) return;

    const nameErr = validateName(formData.name);
    const gradeErr = validateGrade(formData.grade);
    if (nameErr || gradeErr) {
      toast({
        title: "Validation Error",
        description: nameErr || gradeErr || "Please fix errors.",
        variant: "destructive",
      });
      return;
    }

    // Check if already submitted
    if (localStorage.getItem("interview_submitted") === "true") {
      toast({
        title: "Already Submitted",
        description: "You have already signed up for an interview.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        toast({
          title: "Error",
          description: result.error || "Submission failed. Please try again.",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      localStorage.setItem("interview_submitted", "true");
      sessionStorage.removeItem("formData");
      router.push("/thanks");
    } catch {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
      setSubmitting(false);
    }
  };

  if (!formData) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <h1 className="text-2xl font-bold text-cyan-400 text-center mb-6">
          Review Your Answers
        </h1>

        <Card className="border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg text-gray-200">
              Please confirm your details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="review-name">Name</Label>
              <Input
                id="review-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                maxLength={20}
              />
            </div>

            <div className="space-y-2">
              <Label>Grade Level</Label>
              <div className="grid grid-cols-2 gap-3">
                {GRADE_OPTIONS.map((grade) => (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => setFormData({ ...formData, grade })}
                    className={`rounded-lg border p-3 text-sm font-medium transition-all ${
                      formData.grade === grade
                        ? "border-cyan-500 bg-cyan-950 text-cyan-300"
                        : "border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-600 hover:bg-gray-800"
                    }`}
                  >
                    {grade} Grade
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                sessionStorage.setItem("formData", JSON.stringify(formData));
                router.push("/");
              }}
            >
              ← Edit
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit ✓"}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </main>
  );
}
