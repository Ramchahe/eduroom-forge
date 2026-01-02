import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

interface Props {
  className?: string;
  size?: number;
  delay?: number;
  color?: "primary" | "accent";
}

export function FloatingOrb({ className = "", size = 300, delay = 0, color = "primary" }: Props) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 100 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      mouseX.set((clientX - centerX) * 0.05);
      mouseY.set((clientY - centerY) * 0.05);
    };

    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [mouseX, mouseY]);

  const colorClass = color === "primary" 
    ? "bg-primary/20" 
    : "bg-accent/20";

  return (
    <motion.div
      className={`absolute rounded-full blur-[100px] ${colorClass} ${className}`}
      style={{ 
        width: size, 
        height: size,
        x,
        y,
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}
