import { motion, useInView } from "framer-motion";
import { Shield, Zap, BarChart3, MessagesSquare } from "lucide-react";
import { useMemo, useRef } from "react";
import { AnimatedNumber } from "@/pages/home/components/AnimatedNumber";

const cards = [
  {
    title: "Engagement",
    value: 93,
    suffix: "%",
    icon: Zap,
    note: "AI nudges keep learners active",
  },
  {
    title: "Completion",
    value: 78,
    suffix: "%",
    icon: BarChart3,
    note: "Predictive pacing + checkpoints",
  },
  {
    title: "Response time",
    value: 24,
    suffix: "h",
    icon: MessagesSquare,
    note: "Auto-routing & smart replies",
  },
  {
    title: "Security",
    value: 99,
    suffix: ".9%",
    icon: Shield,
    note: "Encrypted & audit-friendly",
  },
];

function Sparkline({ i }: { i: number }) {
  const paths = useMemo(
    () => [
      "M0,22 C20,12 32,30 52,18 C68,10 82,22 100,8",
      "M0,26 C18,10 42,34 60,18 C76,4 84,18 100,12",
      "M0,18 C22,6 34,26 52,22 C70,18 80,10 100,16",
      "M0,20 C20,22 40,6 58,14 C76,22 86,12 100,10",
    ],
    []
  );

  return (
    <svg viewBox="0 0 100 32" className="h-8 w-full">
      <path d={paths[i % paths.length]} className="stroke-border" strokeWidth="2" fill="none" opacity="0.35" />
      <motion.path
        d={paths[i % paths.length]}
        className="stroke-primary"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.1, delay: 0.15 + i * 0.05 }}
      />
    </svg>
  );
}

export function AiTelemetrySection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <section className="relative py-16">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {cards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.06 * i }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-2xl glass p-6"
            >
              <div className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute -inset-12 bg-gradient-hero opacity-20 blur-2xl" />
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{c.title}</p>
                  <p className="mt-1 text-3xl font-display font-semibold">
                    {inView ? (
                      <>
                        <AnimatedNumber value={c.value} />
                        <span className="text-muted-foreground">{c.suffix}</span>
                      </>
                    ) : (
                      "0"
                    )}
                  </p>
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/12 transition-colors group-hover:bg-primary/18">
                  <c.icon className="h-6 w-6 text-primary" />
                </div>
              </div>

              <div className="mt-3">
                <Sparkline i={i} />
              </div>

              <p className="mt-2 text-sm text-muted-foreground">{c.note}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
