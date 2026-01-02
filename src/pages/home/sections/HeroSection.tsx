import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Brain, Play, Sparkles, Star, Users } from "lucide-react";
import { useRef } from "react";

type Props = {
  heroImage: string;
  onPrimaryCta: () => void;
  onSecondaryCta?: () => void;
};

export function HeroSection({ heroImage, onPrimaryCta, onSecondaryCta }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.25]);
  const glow = useTransform(scrollYProgress, [0, 1], [0.35, 0.12]);

  return (
    <section ref={ref} className="relative min-h-screen pt-24">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-[0.18]" />
        <div className="absolute inset-0 vignette bg-gradient-glow" style={{ opacity: 1 }} />
        <motion.div
          className="absolute -top-24 left-1/4 h-[520px] w-[520px] rounded-full bg-primary/10 blur-[120px]"
          style={{ opacity: glow }}
        />
        <motion.div
          className="absolute -bottom-24 right-1/4 h-[520px] w-[520px] rounded-full bg-accent/10 blur-[120px]"
          style={{ opacity: glow }}
        />
      </div>

      <div className="container mx-auto px-4 py-10 lg:py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div style={{ y, opacity }} className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 rounded-full glass px-4 py-2"
            >
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-foreground/90">AI Control Room for Modern Schools</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-display font-semibold leading-[1.05] sm:text-5xl lg:text-6xl"
            >
              <span className="text-gradient">AI Online Teaching</span>
              <br />
              Management Software
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="max-w-xl text-lg text-muted-foreground"
            >
              Run classes, quizzes, communities, fees and analytics like a single intelligent system.
              Designed to feel fast, fluid, and futuristic.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg" className="bg-gradient-hero glow-primary" onClick={onPrimaryCta}>
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-border/60 bg-background/20 backdrop-blur"
                onClick={() => {
                  if (onSecondaryCta) return onSecondaryCta();
                  document.getElementById("solutions")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <Play className="mr-2 h-4 w-4" />
                Watch Flow
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="flex flex-wrap items-center gap-6"
            >
              <div className="flex -space-x-3">
                {["A", "I", "O", "P"].map((ch, i) => (
                  <div
                    key={ch}
                    className="grid h-10 w-10 place-items-center rounded-full border-2 border-background bg-gradient-hero text-xs font-bold text-primary-foreground"
                    style={{ transform: `translateX(${i * 0}px)` }}
                  >
                    {ch}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-warning">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">Used by educators building the next-gen classroom</p>
              </div>

              <div className="flex items-center gap-2 rounded-full glass px-3 py-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4 text-primary" />
                <span>
                  <span className="text-foreground">50K+</span> active learners
                </span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="relative"
          >
            <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-hero opacity-20 blur-2xl" />

            <motion.div
              className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 shadow-2xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <img
                src={heroImage}
                alt="AI online teaching management dashboard preview"
                className="h-auto w-full"
              />

              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,hsl(var(--accent)/0.18),transparent_55%)]" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_70%,hsl(var(--primary)/0.16),transparent_55%)]" />
            </motion.div>

            <motion.div
              className="absolute -bottom-6 -left-6 rounded-2xl glass p-4 shadow-lg"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">AI Insights</p>
                  <p className="text-lg font-semibold">Realtime</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
