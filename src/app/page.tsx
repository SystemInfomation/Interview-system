"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { InterviewForm } from "@/components/interview-form";
import { FormData } from "@/lib/types";

export default function Home() {
  const [animationDone, setAnimationDone] = React.useState(false);
  const router = useRouter();

  const handleFormComplete = (data: FormData) => {
    sessionStorage.setItem("formData", JSON.stringify(data));
    router.push("/review");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      {/* Spinning logo */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
        onAnimationComplete={() => setAnimationDone(true)}
        className="mb-8"
      >
        <Image
          src="/alliance-logo.png"
          alt="Alliance Academy for Innovation Logo"
          width={160}
          height={160}
          priority
          className="rounded-full"
        />
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: animationDone ? 1 : 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-cyan-400 mb-2">
          Alliance Academy Interview Signup
        </h1>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          Sign up for a TikTok video interview. Fill out the form below to get
          started!
        </p>
      </motion.div>

      {/* Form — fades in after logo animation */}
      {animationDone && <InterviewForm onComplete={handleFormComplete} />}
    </main>
  );
}
