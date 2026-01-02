import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const words = ["Teaching", "Learning", "Education", "Coaching", "Training"];

export function MorphingText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="relative inline-block min-w-[200px] sm:min-w-[280px]">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ y: 40, opacity: 0, rotateX: -90 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          exit={{ y: -40, opacity: 0, rotateX: 90 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-0 text-gradient"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
      <span className="invisible">{words[0]}</span>
    </span>
  );
}
