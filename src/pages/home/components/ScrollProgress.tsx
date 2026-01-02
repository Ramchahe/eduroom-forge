import { MotionValue, motion } from "framer-motion";

export function ScrollProgress({ progress }: { progress: MotionValue<number> }) {
  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 right-0 top-0 z-[60] h-1 origin-left bg-gradient-hero opacity-80"
      style={{ scaleX: progress }}
    />
  );
}
