"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const COLORS = ["#06b6d4", "#22d3ee", "#a78bfa", "#f472b6", "#facc15", "#34d399"];

interface ConfettiData {
  id: number;
  delay: number;
  x: number;
  color: string;
  drift: number;
}

function ConfettiPiece({ x, delay, color, drift }: Omit<ConfettiData, "id">) {
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full"
      style={{ backgroundColor: color, left: `${x}%` }}
      initial={{ y: -20, opacity: 1, rotate: 0 }}
      animate={{
        y: [0, 400, 600],
        opacity: [1, 1, 0],
        rotate: [0, 180, 360],
        x: [0, drift],
      }}
      transition={{
        duration: 2.5,
        delay,
        ease: "easeOut",
      }}
    />
  );
}

function generateConfetti(): ConfettiData[] {
  return Array.from({ length: 40 }, (_, i) => ({
    id: i,
    delay: Math.random() * 0.8,
    x: Math.random() * 100,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    drift: (Math.random() - 0.5) * 200,
  }));
}

export default function ThanksPage() {
  const [confettiPieces] = React.useState<ConfettiData[]>(() => generateConfetti());

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Confetti */}
      <div className="absolute inset-0 pointer-events-none">
        {confettiPieces.map((piece) => (
          <ConfettiPiece
            key={piece.id}
            delay={piece.delay}
            x={piece.x}
            color={piece.color}
            drift={piece.drift}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center z-10"
      >
        <motion.div
          className="text-6xl mb-6"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          🎉
        </motion.div>
        <h1 className="text-3xl font-bold text-cyan-400 mb-4">
          Photos Uploaded!
        </h1>
        <p className="text-gray-400 max-w-md mx-auto mb-8">
          Your photos have been saved successfully. Thanks for sharing!
        </p>
        <Link href="/">
          <Button variant="outline">← Back to Home</Button>
        </Link>
      </motion.div>
    </main>
  );
}
