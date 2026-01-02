import { motion, useScroll, useTransform } from "framer-motion";
import {
  BarChart3,
  Brain,
  FileCheck,
  MessageCircle,
  Shield,
  Video,
  Zap,
  ArrowUpRight,
} from "lucide-react";
import { useRef } from "react";
import { RevealOnScroll } from "@/pages/home/components/RevealOnScroll";

const features = [
  {
    icon: Brain,
    title: "AI Course Builder",
    desc: "Draft lessons, outlines and quizzes with consistent quality.",
    tags: ["outlines", "rubrics", "question bank"],
    gradient: "from-primary/20 via-accent/10 to-transparent",
  },
  {
    icon: Video,
    title: "Live Classes",
    desc: "Stream sessions with chat, replays and class targeting.",
    tags: ["chat", "replays", "attendance"],
    gradient: "from-accent/20 via-primary/10 to-transparent",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    desc: "See trends, rank insights and improvement signals instantly.",
    tags: ["trends", "leaderboards", "alerts"],
    gradient: "from-primary/20 via-accent/10 to-transparent",
  },
  {
    icon: MessageCircle,
    title: "Communities",
    desc: "Students post, discuss and collaborate with attachments.",
    tags: ["posts", "files", "comments"],
    gradient: "from-accent/20 via-primary/10 to-transparent",
  },
  {
    icon: FileCheck,
    title: "Smart Assessments",
    desc: "Build and deliver quizzes fast with smart reporting.",
    tags: ["auto grade", "reports", "results"],
    gradient: "from-primary/20 via-accent/10 to-transparent",
  },
  {
    icon: Shield,
    title: "Secure by Design",
    desc: "Permission-based access with audit-friendly controls.",
    tags: ["roles", "privacy", "controls"],
    gradient: "from-accent/20 via-primary/10 to-transparent",
  },
];

export function FeaturesSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section id="features" ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-[0.06]" />
      </div>

      <div className="container mx-auto px-4">
        <RevealOnScroll className="mx-auto mb-16 max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full glass px-5 py-2.5 text-sm text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            Core Modules
          </span>
          <h2 className="mt-6 text-4xl font-display font-bold sm:text-5xl lg:text-6xl">
            Everything, orchestrated by
            <span className="text-gradient block mt-2">Artificial Intelligence</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete AI-powered online teaching management platform—designed to feel like a control room.
          </p>
        </RevealOnScroll>

        <motion.div style={{ y }} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <RevealOnScroll key={f.title} delay={i * 0.1}>
              <motion.article
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm p-8 h-full cursor-pointer"
              >
                {/* Animated gradient background */}
                <motion.div
                  className={`absolute inset-0 -z-10 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Corner glow */}
                <motion.div
                  className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"
                />

                <div className="relative">
                  <div className="flex items-start justify-between mb-6">
                    <motion.div 
                      className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 border border-border/50"
                      whileHover={{ rotate: 5, scale: 1.1 }}
                    >
                      <f.icon className="h-7 w-7 text-primary" />
                    </motion.div>
                    <motion.div
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ scale: 1.2 }}
                    >
                      <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                    </motion.div>
                  </div>

                  <h3 className="text-xl font-display font-bold mb-2">{f.title}</h3>
                  <p className="text-muted-foreground mb-6">{f.desc}</p>

                  <div className="flex flex-wrap gap-2">
                    {f.tags.map((t, ti) => (
                      <motion.span
                        key={t}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + ti * 0.1 }}
                        className="inline-flex items-center rounded-full border border-border/50 bg-background/30 px-3 py-1 text-xs text-muted-foreground"
                      >
                        <Zap className="mr-1 h-3 w-3 text-accent" />
                        {t}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.article>
            </RevealOnScroll>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
