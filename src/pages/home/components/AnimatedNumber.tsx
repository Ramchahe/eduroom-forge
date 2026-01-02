import { useEffect, useState } from "react";
import { animate } from "framer-motion";

type Props = {
  value: number;
  duration?: number;
  format?: (n: number) => string;
};

export function AnimatedNumber({ value, duration = 1.2, format }: Props) {
  const [display, setDisplay] = useState(() => (format ? format(0) : "0"));

  useEffect(() => {
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        const n = Math.round(latest);
        setDisplay(format ? format(n) : n.toLocaleString());
      },
    });

    return () => controls.stop();
  }, [duration, format, value]);

  return <span>{display}</span>;
}
