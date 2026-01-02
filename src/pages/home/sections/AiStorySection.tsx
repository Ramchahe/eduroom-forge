import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";
import { useMemo, useRef, useState } from "react";

type Step = {
  chip: string;
  title: string;
  desc: string;
  bullets: string[];
};

const steps: Step[] = [
  {
    chip: "Signal Intake",
    title: "Collect class signals",
    desc: "Attendance, results, engagement and submissions feed your AI engine.",
    bullets: ["live attendance", "assignment timelines", "community activity"],
  },
  {
    chip: "Live Ops",
    title: "Run live classes",
    desc: "Stream to the right class, keep chat actionable, and capture replays.",
    bullets: ["targeted streams", "teacher controls", "chat + comments"],
  },
  {
    chip: "Assessment",
    title: "Measure learning",
    desc: "Quizzes + reports turn activity into performance insights.",
    bullets: ["question bank", "quiz report", "student results"],
  },
  {
    chip: "Optimization",
    title: "AI recommendations",
    desc: "See what to fix next and where students are stuck—instantly.",
    bullets: ["risk detection", "improvement prompts", "next best action"],
  },
];

export function AiStorySection() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(steps.length - 1, Math.max(0, Math.floor(v * steps.length)));
    setActive(next);
  });

  const panelY = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const panelRotate = useTransform(scrollYProgress, [0, 1], [-1.5, 1.5]);
  const meter = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const highlights = useMemo(
    () => [
      "radial-gradient(circle at 30% 20%, hsl(var(--accent) / 0.20), transparent 55%)",
      "radial-gradient(circle at 75% 35%, hsl(var(--primary) / 0.20), transparent 55%)",
      "radial-gradient(circle at 25% 70%, hsl(var(--primary) / 0.18), transparent 55%)",
      "radial-gradient(circle at 75% 75%, hsl(var(--accent) / 0.18), transparent 55%)",
    ],
    []
  );

  return (
    <section id="solutions" ref={ref} className="relative py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-accent" />
            Scrollytelling
          </span>
          <h2 className="mt-5 text-3xl font-display font-semibold sm:text-4xl lg:text-5xl">
            Your platform becomes a <span className="text-gradient">system</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Scroll to watch how data moves through the AI teaching engine—from signals to action.
          </p>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          {/* Sticky AI panel */}
          <div className="lg:sticky lg:top-24">
            <motion.div
              style={{ y: panelY, rotate: panelRotate }}
              className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/50 p-8 shadow-2xl"
            >
              <div className="absolute inset-0 bg-grid opacity-[0.18]" />
              <div className="absolute inset-0" style={{ backgroundImage: highlights[active] }} />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">AI Engine Status</p>
                  <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-medium text-success">
                    Online
                  </span>
                </div>

                <div className="mt-6 grid gap-4">
                  <div className="rounded-2xl border border-border/60 bg-background/10 p-4">
                    <p className="text-xs text-muted-foreground">Active stage</p>
                    <p className="mt-1 text-lg font-display font-semibold">{steps[active].chip}</p>
                  </div>

                  <div className="rounded-2xl border border-border/60 bg-background/10 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">Processing</p>
                      <motion.p className="text-xs text-muted-foreground" style={{ width: meter }}>
                        {Math.round((active / (steps.length - 1)) * 100)}%
                      </motion.p>
                    </div>
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                      <motion.div className="h-full bg-gradient-hero" style={{ width: meter }} />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border/60 bg-background/10 p-4">
                    <p className="text-xs text-muted-foreground">Trace</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      ingestion → routing → scoring → recommendations
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Steps */}
          <div className="space-y-6">
            {steps.map((s, idx) => (
              <motion.article
                key={s.title}
                className={`relative rounded-2xl border p-7 transition-colors ${
                  idx === active ? "border-primary/50 bg-card/55" : "border-border/60 bg-card/35"
                }`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20%" }}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/10 px-3 py-1 text-xs text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {s.chip}
                  </span>
                  <span className="text-xs text-muted-foreground">Step {idx + 1}</span>
                </div>

                <h3 className="mt-4 text-2xl font-display font-semibold">{s.title}</h3>
                <p className="mt-2 text-muted-foreground">{s.desc}</p>

                <ul className="mt-5 space-y-3">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-primary/12">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
