import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LOADING_WORDS } from "../data/site";

const DURATION_MS = 2700;
const WORD_INTERVAL_MS = 900;
const COMPLETE_DELAY_MS = 400;

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const hasCompletedRef = useRef(false);

  // Drive the counter from 0 -> 100 over DURATION_MS using requestAnimationFrame.
  useEffect(() => {
    let rafId = 0;
    let startTime: number | null = null;

    const tick = (now: number) => {
      if (startTime === null) {
        startTime = now;
      }
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / DURATION_MS, 1);
      setCount(Math.round(progress * 100));

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Cycle through the rotating words.
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setWordIndex((prev) => (prev + 1) % LOADING_WORDS.length);
    }, WORD_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  // Fire onComplete once, shortly after the counter reaches 100.
  useEffect(() => {
    if (count < 100 || hasCompletedRef.current) {
      return;
    }
    hasCompletedRef.current = true;

    const timeoutId = window.setTimeout(() => {
      onCompleteRef.current();
    }, COMPLETE_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [count]);

  return (
    <div className="fixed inset-0 z-[9999] bg-bg font-body overflow-hidden">
      {/* Top-left label */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute top-8 left-8 text-xs text-muted uppercase tracking-[0.3em]"
      >
        Portfolio
      </motion.div>

      {/* Center: rotating words */}
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={wordIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-4xl md:text-6xl lg:text-7xl font-display italic text-text-primary/80"
          >
            {LOADING_WORDS[wordIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Bottom-right counter */}
      <div className="absolute bottom-8 right-8 text-6xl md:text-8xl lg:text-9xl font-display text-text-primary tabular-nums">
        {String(count).padStart(3, "0")}
      </div>

      {/* Bottom progress bar */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-stroke/50">
        <div
          className="accent-gradient w-full h-full"
          style={{
            transform: `scaleX(${count / 100})`,
            transformOrigin: "left",
            boxShadow: "0 0 8px rgba(137,170,204,0.35)",
          }}
        />
      </div>
    </div>
  );
}
