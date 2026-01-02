import { motion, useScroll, useVelocity, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

interface Props {
  children: string;
  baseVelocity?: number;
  className?: string;
}

export function ScrollVelocityText({ children, baseVelocity = 2, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });
  
  const x = useTransform(velocityFactor, (v) => `${-v * 2}%`);
  const skewX = useTransform(smoothVelocity, [-1000, 1000], [-3, 3]);

  return (
    <div ref={ref} className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div 
        className="inline-flex gap-8"
        style={{ x, skewX }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="text-6xl sm:text-8xl lg:text-[10rem] font-display font-bold text-border/30">
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
