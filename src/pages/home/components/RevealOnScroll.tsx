import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  direction?: "up" | "left" | "right";
  delay?: number;
}

export function RevealOnScroll({ children, className = "", direction = "up", delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 95%", "start 60%"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  
  const getTransform = () => {
    switch (direction) {
      case "left": return useTransform(scrollYProgress, [0, 1], [80, 0]);
      case "right": return useTransform(scrollYProgress, [0, 1], [-80, 0]);
      default: return useTransform(scrollYProgress, [0, 1], [60, 0]);
    }
  };

  const y = direction === "up" ? getTransform() : 0;
  const x = direction !== "up" ? getTransform() : 0;

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y, x }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
