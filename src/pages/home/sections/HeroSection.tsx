import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Sparkles, Star, Users, CheckCircle2, Zap, Brain } from "lucide-react";
import { useRef } from "react";

type Props = {
  heroImage: string;
  onPrimaryCta: () => void;
  onSecondaryCta?: () => void;
};

const stats = [
  { value: "50K+", label: "Active Learners", icon: Users },
  { value: "98%", label: "Satisfaction Rate", icon: Star },
  { value: "3x", label: "Faster Results", icon: Zap },
];

const floatingWords = ["Courses", "Analytics", "Live Classes", "AI Grading", "Communities"];

export function HeroSection({ heroImage, onPrimaryCta, onSecondaryCta }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <section ref={ref} className="relative min-h-screen pt-24 lg:pt-28 overflow-hidden">
      {/* Sophisticated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.04] via-transparent to-transparent" />
        <div className="absolute top-20 left-1/3 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-accent/8 rounded-full blur-[130px]" />
        <div className="absolute inset-0 bg-grid opacity-[0.025]" />
      </div>

      {/* Floating keyword tags */}
      <div className="absolute inset-0 -z-5 overflow-hidden pointer-events-none hidden lg:block">
        {floatingWords.map((word, i) => (
          <motion.div
            key={word}
            className="absolute rounded-full border border-border/30 bg-card/20 backdrop-blur-sm px-4 py-1.5 text-xs text-muted-foreground/50 font-medium"
            style={{
              top: `${18 + (i * 15) % 60}%`,
              right: `${3 + (i * 8) % 20}%`,
            }}
            animate={{
              y: [0, -15 - i * 3, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              delay: i * 0.7,
            }}
          >
            {word}
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-16">
        {/* Centered hero content */}
        <motion.div style={{ y, opacity }} className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-5 py-2 mb-8"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-4 w-4 text-primary" />
            </motion.div>
            <span className="text-sm font-medium text-primary">AI-Powered Education Platform</span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-[1.08] tracking-tight">
              The smarter way to
              <motion.span
                className="text-gradient block mt-2"
                initial={{ backgroundPosition: "0% 50%" }}
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 6, repeat: Infinity }}
              >
                teach & manage
              </motion.span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-6 text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            All-in-one platform for courses, live classes, assessments, and analytics.
            Built to boost outcomes and save educators hours every week.
          </motion.p>

          {/* Feature checkmarks */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2"
          >
            {["AI Course Builder", "Live Streaming", "Smart Analytics", "Auto Grading"].map((f) => (
              <span key={f} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                {f}
              </span>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Button
              size="lg"
              onClick={onPrimaryCta}
              className="group bg-gradient-hero text-primary-foreground px-8 h-13 text-base font-semibold rounded-xl glow-primary hover:opacity-90 transition-all"
            >
              Start Free Demo
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                if (onSecondaryCta) return onSecondaryCta();
                document.getElementById("solutions")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-8 h-13 text-base font-semibold rounded-xl border-border/60 hover:bg-card/50"
            >
              <Play className="mr-2 h-4 w-4 text-primary" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-8 flex items-center justify-center gap-3"
          >
            <div className="flex -space-x-2.5">
              {["S", "M", "A", "P", "K"].map((ch, i) => (
                <motion.div
                  key={ch}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.06 }}
                  className="h-8 w-8 rounded-full border-2 border-background bg-gradient-hero grid place-items-center text-[10px] font-bold text-primary-foreground"
                >
                  {ch}
                </motion.div>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="flex items-center gap-1 text-warning mb-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-current" />
                ))}
              </span>
              4.9/5 from 2,000+ reviews
            </div>
          </motion.div>
        </motion.div>

        {/* Dashboard preview - below centered content */}
        <motion.div
          style={{ y: imageY, scale: imageScale }}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="relative mt-14 lg:mt-20 max-w-5xl mx-auto"
        >
          {/* Glow behind */}
          <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-r from-primary/15 via-accent/10 to-primary/15 blur-3xl opacity-50" />

          <motion.div
            className="relative overflow-hidden rounded-2xl border border-border/40 bg-card/30 shadow-[var(--shadow-large)]"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={heroImage}
              alt="AI online teaching management dashboard preview"
              className="h-auto w-full"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" />

            {/* Browser dots */}
            <div className="absolute top-0 left-0 right-0 flex items-center gap-1.5 bg-card/60 backdrop-blur-sm px-4 py-2.5 border-b border-border/30">
              <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-warning/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-success/60" />
              <div className="ml-3 flex-1 rounded-md bg-muted/30 h-5 max-w-xs" />
            </div>
          </motion.div>

          {/* Floating metric cards */}
          <motion.div
            className="absolute -bottom-5 -left-3 md:-bottom-6 md:-left-6 rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl p-4 shadow-[var(--shadow-medium)]"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-primary/12 grid place-items-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active Users</p>
                <p className="text-xl font-display font-bold">50,247</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute -top-3 -right-3 md:-top-5 md:-right-5 rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl p-3 shadow-[var(--shadow-medium)]"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-medium">2,340 Online</span>
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-8 -right-3 md:-right-6 rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl p-3 shadow-[var(--shadow-medium)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-accent" />
              <span className="text-xs font-medium">AI analyzing...</span>
            </div>
            <div className="mt-1.5 h-1.5 w-28 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full bg-gradient-hero rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "72%" }}
                transition={{ delay: 1.2, duration: 1.5 }}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-20 lg:mt-28 grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              whileHover={{ y: -3 }}
              className="text-center p-4 rounded-2xl border border-border/30 bg-card/20 backdrop-blur-sm"
            >
              <stat.icon className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-2xl md:text-3xl font-display font-bold text-gradient">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs text-muted-foreground">Scroll to explore</span>
          <div className="h-8 w-5 rounded-full border-2 border-border/60 p-1">
            <motion.div
              className="h-1.5 w-1.5 rounded-full bg-primary"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
