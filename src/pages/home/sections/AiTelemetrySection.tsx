import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Shield, Zap, BarChart3, MessagesSquare, TrendingUp } from "lucide-react";
import { useRef } from "react";
import { AnimatedNumber } from "@/pages/home/components/AnimatedNumber";
import { Floating3DCard } from "@/pages/home/components/Floating3DCard";
import { ScrollVelocityText } from "@/pages/home/components/ScrollVelocityText";

const cards = [
  {
    title: "Student Engagement",
    value: 93,
    suffix: "%",
    icon: Zap,
    note: "AI nudges keep learners active",
    trend: "+12%",
    color: "from-primary/20 to-accent/10",
  },
  {
    title: "Course Completion",
    value: 78,
    suffix: "%",
    icon: BarChart3,
    note: "Predictive pacing + checkpoints",
    trend: "+24%",
    color: "from-accent/20 to-primary/10",
  },
  {
    title: "Response Time",
    value: 24,
    suffix: "h",
    icon: MessagesSquare,
    note: "Auto-routing & smart replies",
    trend: "-65%",
    color: "from-primary/20 to-accent/10",
  },
  {
    title: "Platform Security",
    value: 99,
    suffix: ".9%",
    icon: Shield,
    note: "Encrypted & audit-friendly",
    trend: "A+ Grade",
    color: "from-accent/20 to-primary/10",
  },
];

function AnimatedSparkline({ i, inView }: { i: number; inView: boolean }) {
  const paths = [
    "M0,28 C15,18 25,35 40,22 C55,10 65,28 80,15 C95,5 100,12 100,8",
    "M0,30 C12,15 28,38 45,20 C60,8 75,25 90,12 C98,5 100,10 100,8",
    "M0,25 C18,12 32,32 50,18 C68,6 82,22 95,10 C100,5 100,8 100,8",
    "M0,32 C14,20 30,38 48,24 C65,12 80,28 92,15 C98,8 100,10 100,8",
  ];

  return (
    <svg viewBox="0 0 100 40" className="h-12 w-full">
      <defs>
        <linearGradient id={`gradient-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
          <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <motion.path
        d={paths[i % paths.length]}
        fill="none"
        stroke={`url(#gradient-${i})`}
        strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 1.5, delay: 0.2 + i * 0.1, ease: "easeOut" }}
      />
      <motion.path
        d={paths[i % paths.length]}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 1.5, delay: 0.2 + i * 0.1, ease: "easeOut" }}
      />
    </svg>
  );
}

export function AiTelemetrySection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const containerRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section ref={containerRef} className="relative py-20 overflow-hidden">
      {/* Scroll velocity text background */}
      <div className="absolute inset-0 flex items-center -z-10 opacity-30">
        <ScrollVelocityText>AI-POWERED • INTELLIGENT • AUTOMATED •</ScrollVelocityText>
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          style={{ y }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {cards.map((c, i) => (
            <Floating3DCard key={c.title} className="h-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 * i, duration: 0.5 }}
                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 h-full"
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${c.color}`} />
                
                {/* Animated corner accent */}
                <motion.div
                  className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-primary/10 blur-2xl"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                />

                <div className="relative">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">{c.title}</p>
                      <p className="mt-1 text-4xl font-display font-bold">
                        {inView ? (
                          <>
                            <AnimatedNumber value={c.value} />
                            <span className="text-muted-foreground text-2xl">{c.suffix}</span>
                          </>
                        ) : (
                          "0"
                        )}
                      </p>
                    </div>
                    <motion.div 
                      className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 border border-border/50"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <c.icon className="h-7 w-7 text-primary" />
                    </motion.div>
                  </div>

                  <AnimatedSparkline i={i} inView={inView} />

                  <div className="flex items-center justify-between mt-3">
                    <p className="text-sm text-muted-foreground">{c.note}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                      <TrendingUp className="h-3 w-3" />
                      {c.trend}
                    </span>
                  </div>
                </div>
              </motion.div>
            </Floating3DCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
