import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Sparkles, Star, Users, CheckCircle2 } from "lucide-react";
import { useRef } from "react";

type Props = {
  heroImage: string;
  onPrimaryCta: () => void;
  onSecondaryCta?: () => void;
};

const stats = [
  { value: "50K+", label: "Active Users" },
  { value: "98%", label: "Satisfaction" },
  { value: "24/7", label: "Support" },
];

export function HeroSection({ heroImage, onPrimaryCta, onSecondaryCta }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen pt-20 lg:pt-24 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left content */}
          <motion.div style={{ y, opacity }} className="space-y-8 relative z-10">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 backdrop-blur-sm px-4 py-2"
            >
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-foreground/80">AI-Powered Education Platform</span>
            </motion.div>

            {/* Main headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="space-y-4"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-[1.1] tracking-tight">
                Transform Your
                <span className="block text-gradient mt-1">Teaching Experience</span>
              </h1>
              <p className="max-w-lg text-lg text-muted-foreground leading-relaxed">
                All-in-one platform for courses, live classes, assessments, and analytics. 
                Built to boost outcomes and save time.
              </p>
            </motion.div>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              {["AI Course Builder", "Live Streaming", "Smart Analytics"].map((feature, i) => (
                <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>{feature}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                size="lg"
                onClick={onPrimaryCta}
                className="group bg-gradient-hero text-primary-foreground px-8 h-12 text-base font-semibold rounded-xl glow-primary hover:opacity-90 transition-opacity"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  if (onSecondaryCta) return onSecondaryCta();
                  document.getElementById("solutions")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-8 h-12 text-base font-semibold rounded-xl border-border/60 hover:bg-card/50"
              >
                <Play className="mr-2 h-4 w-4 text-primary" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4"
            >
              {/* Avatar stack */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {["A", "B", "C", "D", "E"].map((ch, i) => (
                    <motion.div
                      key={ch}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + i * 0.05 }}
                      className="h-10 w-10 rounded-full border-2 border-background bg-gradient-hero grid place-items-center text-xs font-bold text-primary-foreground"
                    >
                      {ch}
                    </motion.div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-1 text-warning">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-muted-foreground">4.9/5 from 2,000+ reviews</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Dashboard preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative"
          >
            {/* Glow effect */}
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-r from-primary/20 via-accent/15 to-primary/20 blur-2xl opacity-60" />
            
            {/* Main dashboard image */}
            <motion.div
              className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 shadow-2xl"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={heroImage}
                alt="AI online teaching management dashboard preview"
                className="h-auto w-full"
              />

              {/* Subtle gradient overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent" />
            </motion.div>

            {/* Floating cards */}
            <motion.div
              className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm p-3 md:p-4 shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/15 grid place-items-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Active Users</p>
                  <p className="text-lg font-bold">50K+</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -top-4 -right-4 md:-top-6 md:-right-6 rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm p-3 shadow-lg"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-success animate-pulse" />
                <span className="text-sm font-medium">Live Now</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 lg:mt-24 grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="text-center"
            >
              <p className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-gradient">{stat.value}</p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
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
