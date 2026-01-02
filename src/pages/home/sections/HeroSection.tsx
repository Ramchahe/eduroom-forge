import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Play, Sparkles, Star, Users, Brain, Cpu, Zap } from "lucide-react";
import { useRef, useEffect } from "react";
import { ParticleField } from "@/pages/home/components/ParticleField";
import { MorphingText } from "@/pages/home/components/MorphingText";
import { FloatingOrb } from "@/pages/home/components/FloatingOrb";
import { Floating3DCard } from "@/pages/home/components/Floating3DCard";
import { MagneticButton } from "@/pages/home/components/MagneticButton";

type Props = {
  heroImage: string;
  onPrimaryCta: () => void;
  onSecondaryCta?: () => void;
};

const floatingIcons = [
  { Icon: Brain, x: "10%", y: "20%", delay: 0 },
  { Icon: Cpu, x: "85%", y: "15%", delay: 0.5 },
  { Icon: Zap, x: "5%", y: "70%", delay: 1 },
  { Icon: Sparkles, x: "90%", y: "65%", delay: 1.5 },
];

export function HeroSection({ heroImage, onPrimaryCta, onSecondaryCta }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const y = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -5]);

  // Mouse parallax for background
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 30, stiffness: 100 };
  const bgX = useSpring(mouseX, springConfig);
  const bgY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [mouseX, mouseY]);

  return (
    <section ref={ref} className="relative min-h-[110vh] pt-24 overflow-hidden">
      {/* Dynamic background with particles */}
      <div className="absolute inset-0 -z-10">
        <motion.div 
          className="absolute inset-0 bg-grid opacity-[0.12]"
          style={{ x: bgX, y: bgY }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        
        <ParticleField />
        
        <FloatingOrb className="-top-32 left-1/4" size={500} color="primary" />
        <FloatingOrb className="-bottom-32 right-1/4" size={450} delay={2} color="accent" />
        <FloatingOrb className="top-1/3 right-1/3" size={300} delay={4} color="primary" />
      </div>

      {/* Floating icons */}
      {floatingIcons.map(({ Icon, x, y, delay }, i) => (
        <motion.div
          key={i}
          className="absolute hidden lg:grid h-16 w-16 place-items-center rounded-2xl glass"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 0.6, 
            scale: 1,
            y: [0, -15, 0],
            rotate: [-5, 5, -5],
          }}
          transition={{ 
            opacity: { delay: delay + 0.5, duration: 0.5 },
            scale: { delay: delay + 0.5, duration: 0.5 },
            y: { duration: 5, repeat: Infinity, delay },
            rotate: { duration: 7, repeat: Infinity, delay },
          }}
        >
          <Icon className="h-7 w-7 text-primary" />
        </motion.div>
      ))}

      <div className="container mx-auto px-4 py-10 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left content */}
          <motion.div style={{ y, opacity, scale }} className="space-y-8 relative z-10">
            {/* Badge with pulse effect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 relative"
            >
              <span className="absolute inset-0 rounded-full animate-ping bg-primary/20" style={{ animationDuration: "3s" }} />
              <Sparkles className="h-4 w-4 text-accent animate-pulse" />
              <span className="text-sm font-medium text-foreground/90">AI Control Room for Modern Schools</span>
            </motion.div>

            {/* Main headline with morphing text */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-display font-bold leading-[1.05] sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              <span className="block mb-2">AI-Powered</span>
              <MorphingText />
              <span className="block mt-2 text-foreground/80">Management</span>
            </motion.h1>

            {/* Description with gradient underline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="relative"
            >
              <p className="max-w-xl text-lg text-muted-foreground leading-relaxed">
                Run classes, quizzes, communities, fees and analytics like a single intelligent system.
                <span className="text-foreground font-medium"> Designed to feel fast, fluid, and futuristic.</span>
              </p>
              <motion.div 
                className="absolute -bottom-2 left-0 h-px bg-gradient-hero"
                initial={{ width: 0 }}
                animate={{ width: "60%" }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </motion.div>

            {/* CTA buttons with magnetic effect */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <MagneticButton
                onClick={onPrimaryCta}
                className="group relative inline-flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-xl bg-gradient-hero text-primary-foreground overflow-hidden glow-primary"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
              </MagneticButton>

              <MagneticButton
                onClick={() => {
                  if (onSecondaryCta) return onSecondaryCta();
                  document.getElementById("solutions")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group inline-flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-xl border border-border/60 bg-background/20 backdrop-blur hover:bg-background/40 transition-colors"
              >
                <Play className="h-4 w-4 text-primary" />
                Watch Demo
              </MagneticButton>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center gap-6 pt-4"
            >
              {/* Animated avatars */}
              <div className="flex -space-x-3">
                {["A", "I", "O", "P", "X"].map((ch, i) => (
                  <motion.div
                    key={ch}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="relative grid h-11 w-11 place-items-center rounded-full border-2 border-background bg-gradient-hero text-xs font-bold text-primary-foreground"
                  >
                    {ch}
                    <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping" style={{ animationDuration: `${3 + i * 0.5}s` }} />
                  </motion.div>
                ))}
              </div>

              <div className="h-8 w-px bg-border/50" />

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 text-warning">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                    >
                      <Star className="h-4 w-4 fill-current" />
                    </motion.span>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">4.9/5 from 2,000+ reviews</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Interactive 3D dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="relative"
          >
            <Floating3DCard className="relative cursor-pointer">
              {/* Glow effect */}
              <div className="absolute -inset-8 -z-10 rounded-3xl bg-gradient-hero opacity-20 blur-3xl" />
              
              {/* Main dashboard image */}
              <motion.div
                className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 shadow-2xl"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <img
                  src={heroImage}
                  alt="AI online teaching management dashboard preview"
                  className="h-auto w-full"
                />

                {/* Animated overlay gradients */}
                <motion.div
                  className="pointer-events-none absolute inset-0"
                  animate={{
                    background: [
                      "radial-gradient(circle at 25% 15%, hsl(var(--accent) / 0.2), transparent 55%)",
                      "radial-gradient(circle at 75% 85%, hsl(var(--primary) / 0.2), transparent 55%)",
                      "radial-gradient(circle at 25% 15%, hsl(var(--accent) / 0.2), transparent 55%)",
                    ],
                  }}
                  transition={{ duration: 8, repeat: Infinity }}
                />

                {/* Scan line effect */}
                <motion.div
                  className="pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            </Floating3DCard>

            {/* Floating metric cards */}
            <motion.div
              className="absolute -bottom-6 -left-6 rounded-2xl glass p-4 shadow-lg"
              animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">AI Processing</p>
                  <p className="text-lg font-display font-semibold">Real-time</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -top-4 -right-4 rounded-2xl glass p-4 shadow-lg"
              animate={{ y: [0, -12, 0], rotate: [2, -2, 2] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent/15">
                  <Users className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Active Users</p>
                  <motion.p 
                    className="text-lg font-display font-semibold"
                    animate={{ opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    50K+
                  </motion.p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute top-1/2 -right-8 rounded-2xl glass p-3 shadow-lg"
              animate={{ x: [0, 5, 0], y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="text-xs text-muted-foreground">Live</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs text-muted-foreground">Scroll to explore</span>
          <div className="h-10 w-6 rounded-full border-2 border-border/60 p-1">
            <motion.div
              className="h-2 w-2 rounded-full bg-primary"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
