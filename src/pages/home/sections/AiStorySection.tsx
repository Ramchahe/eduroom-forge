import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { CheckCircle2, Sparkles, ArrowRight, Brain, Radio, BarChart3, Lightbulb } from "lucide-react";
import { useRef } from "react";
import { RevealOnScroll } from "@/pages/home/components/RevealOnScroll";

type Step = {
  icon: React.ComponentType<{ className?: string }>;
  chip: string;
  title: string;
  desc: string;
  bullets: string[];
  color: string;
};

const steps: Step[] = [
  {
    icon: Radio,
    chip: "Signal Intake",
    title: "Collect class signals",
    desc: "Attendance, results, engagement and submissions feed your AI engine automatically.",
    bullets: ["Live attendance tracking", "Assignment timelines", "Community activity logs"],
    color: "from-primary/30 to-accent/30",
  },
  {
    icon: Brain,
    chip: "Live Ops",
    title: "Run live classes",
    desc: "Stream to the right class, keep chat actionable, and capture replays instantly.",
    bullets: ["Targeted streams", "Teacher controls", "Chat + comments"],
    color: "from-accent/30 to-primary/30",
  },
  {
    icon: BarChart3,
    chip: "Assessment",
    title: "Measure learning",
    desc: "Quizzes + reports turn activity into powerful performance insights.",
    bullets: ["Question bank", "Quiz reports", "Student results"],
    color: "from-primary/30 to-accent/30",
  },
  {
    icon: Lightbulb,
    chip: "Optimization",
    title: "AI recommendations",
    desc: "See what to fix next and where students are stuck—instantly with AI analysis.",
    bullets: ["Risk detection", "Improvement prompts", "Next best action"],
    color: "from-accent/30 to-primary/30",
  },
];

export function AiStorySection() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const progressLine = useSpring(
    useTransform(scrollYProgress, [0.1, 0.9], [0, 100]),
    { damping: 30, stiffness: 100 }
  );

  return (
    <section id="solutions" ref={ref} className="relative py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-[0.08]" />
        <motion.div
          className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-border to-transparent"
          style={{ opacity: 0.3 }}
        />
      </div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <RevealOnScroll className="mx-auto mb-20 max-w-3xl text-center">
          <motion.span 
            className="inline-flex items-center gap-2 rounded-full glass px-5 py-2.5 text-sm text-muted-foreground"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="h-4 w-4 text-accent" />
            How It Works
          </motion.span>
          <h2 className="mt-6 text-4xl font-display font-bold sm:text-5xl lg:text-6xl">
            Your platform becomes an
            <span className="block text-gradient mt-2">intelligent system</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch how data flows through the AI teaching engine—from signals to actionable insights.
          </p>
        </RevealOnScroll>

        {/* Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Progress line */}
          <div className="absolute left-8 lg:left-1/2 lg:-translate-x-px top-0 h-full w-0.5 bg-border/30">
            <motion.div
              className="w-full bg-gradient-hero rounded-full"
              style={{ height: `${progressLine.get()}%` }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-24 lg:space-y-32">
            {steps.map((step, idx) => {
              const isLeft = idx % 2 === 0;
              const Icon = step.icon;

              return (
                <RevealOnScroll
                  key={step.title}
                  direction={isLeft ? "left" : "right"}
                  className={`relative grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                    isLeft ? "" : "lg:text-right"
                  }`}
                >
                  {/* Timeline node */}
                  <motion.div
                    className="absolute left-8 lg:left-1/2 -translate-x-1/2 z-10"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <div className="relative">
                      <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${step.color} grid place-items-center border border-border/50`}>
                        <Icon className="h-7 w-7 text-foreground" />
                      </div>
                      <motion.div
                        className="absolute inset-0 rounded-2xl bg-primary/30"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity, delay: idx * 0.5 }}
                      />
                    </div>
                  </motion.div>

                  {/* Content - alternating sides on desktop */}
                  <div className={`pl-24 lg:pl-0 ${isLeft ? "lg:pr-20" : "lg:order-2 lg:pl-20"}`}>
                    <motion.div
                      className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/30 backdrop-blur-sm p-8"
                      whileHover={{ y: -5, borderColor: "hsl(var(--primary) / 0.3)" }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Background gradient */}
                      <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${step.color}`} />
                      
                      <div className="relative">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/50 px-3 py-1 text-xs font-medium text-muted-foreground">
                            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                            {step.chip}
                          </span>
                          <span className="text-xs text-muted-foreground">Step {idx + 1}</span>
                        </div>

                        <h3 className="text-2xl lg:text-3xl font-display font-bold mb-3">{step.title}</h3>
                        <p className="text-muted-foreground mb-6">{step.desc}</p>

                        <ul className="space-y-3">
                          {step.bullets.map((b, i) => (
                            <motion.li
                              key={b}
                              initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.3 + i * 0.1 }}
                              className={`flex items-center gap-3 text-sm text-muted-foreground ${!isLeft ? "lg:flex-row-reverse" : ""}`}
                            >
                              <span className="grid h-6 w-6 place-items-center rounded-full bg-primary/15 flex-shrink-0">
                                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                              </span>
                              {b}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className={`hidden lg:block ${isLeft ? "lg:order-2" : ""}`} />
                </RevealOnScroll>
              );
            })}
          </div>

          {/* End node */}
          <RevealOnScroll className="mt-20 flex justify-center">
            <motion.div
              className="flex items-center gap-4 rounded-full glass px-6 py-3"
              whileHover={{ scale: 1.05 }}
            >
              <span className="h-3 w-3 rounded-full bg-success animate-pulse" />
              <span className="font-medium">System optimized and running</span>
              <ArrowRight className="h-4 w-4 text-primary" />
            </motion.div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
