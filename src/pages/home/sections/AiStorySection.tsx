import { motion } from "framer-motion";
import {
  Radio,
  Brain,
  BarChart3,
  Lightbulb,
  TrendingUp,
  Users,
  Zap,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { RevealOnScroll } from "@/pages/home/components/RevealOnScroll";

const steps = [
  {
    icon: Radio,
    number: "01",
    title: "Collect Signals",
    desc: "Attendance, submissions, and engagement data feeds your AI engine in real-time.",
    detail: "Real-time tracking",
  },
  {
    icon: Brain,
    number: "02",
    title: "AI Analysis",
    desc: "Smart processing identifies patterns, at-risk students, and growth opportunities.",
    detail: "Machine learning",
  },
  {
    icon: BarChart3,
    number: "03",
    title: "Get Insights",
    desc: "Beautiful, actionable reports show exactly what to improve next.",
    detail: "Visual dashboards",
  },
  {
    icon: Lightbulb,
    number: "04",
    title: "Take Action",
    desc: "Implement AI recommendations and watch outcomes improve immediately.",
    detail: "Auto-suggestions",
  },
];

const metrics = [
  { icon: TrendingUp, value: "40%", label: "Time Saved", color: "primary" },
  { icon: Users, value: "98%", label: "Satisfaction", color: "accent" },
  { icon: Zap, value: "3x", label: "Faster Grading", color: "primary" },
];

export function AiStorySection() {
  return (
    <section id="solutions" className="relative py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/[0.02] to-transparent" />
      </div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <RevealOnScroll className="mx-auto mb-12 lg:mb-16 max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 backdrop-blur-sm px-4 py-2 text-sm text-muted-foreground">
            <Zap className="h-4 w-4 text-accent" />
            How It Works
          </span>
          <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-display font-bold">
            From data to insights
            <span className="text-gradient block mt-1">in four simple steps</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch how your teaching data transforms into actionable intelligence.
          </p>
        </RevealOnScroll>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-5 max-w-6xl mx-auto">
          {/* Step 1 - Large tall card */}
          <RevealOnScroll className="sm:col-span-2 lg:col-span-4 lg:row-span-2">
            <motion.div
              whileHover={{ y: -5 }}
              className="h-full rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm p-7 lg:p-8 flex flex-col"
            >
              <div className="h-14 w-14 rounded-2xl bg-primary/12 grid place-items-center mb-5">
                <Radio className="h-7 w-7 text-primary" />
              </div>
              <span className="text-6xl lg:text-7xl font-display font-bold text-primary/10 leading-none mb-3">01</span>
              <h3 className="text-2xl font-display font-bold mb-2">{steps[0].title}</h3>
              <p className="text-muted-foreground text-sm flex-1 leading-relaxed">{steps[0].desc}</p>
              <div className="mt-6 pt-4 border-t border-border/30 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                {steps[0].detail}
              </div>
            </motion.div>
          </RevealOnScroll>

          {/* Step 2 - Wide card */}
          <RevealOnScroll className="lg:col-span-5" delay={0.1}>
            <motion.div
              whileHover={{ y: -4 }}
              className="h-full min-h-[180px] rounded-2xl border border-border/40 bg-gradient-to-br from-accent/8 to-transparent backdrop-blur-sm p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-accent/12 grid place-items-center">
                  <Brain className="h-6 w-6 text-accent" />
                </div>
                <span className="text-4xl font-display font-bold text-accent/15">02</span>
              </div>
              <h3 className="text-xl font-display font-bold mb-2">{steps[1].title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{steps[1].desc}</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                {steps[1].detail}
              </div>
            </motion.div>
          </RevealOnScroll>

          {/* Metric Card 1 */}
          <RevealOnScroll className="lg:col-span-3" delay={0.15}>
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              className="h-full min-h-[180px] rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm p-6 flex flex-col justify-center items-center text-center"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/12 grid place-items-center mb-3">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <p className="text-3xl lg:text-4xl font-display font-bold">40%</p>
              <p className="text-xs text-muted-foreground mt-1">Time Saved</p>
            </motion.div>
          </RevealOnScroll>

          {/* Step 3 */}
          <RevealOnScroll className="lg:col-span-4" delay={0.2}>
            <motion.div
              whileHover={{ y: -4 }}
              className="h-full min-h-[180px] rounded-2xl border border-border/40 bg-gradient-to-br from-primary/8 to-transparent backdrop-blur-sm p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/12 grid place-items-center">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <span className="text-4xl font-display font-bold text-primary/15">03</span>
              </div>
              <h3 className="text-xl font-display font-bold mb-2">{steps[2].title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{steps[2].desc}</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                {steps[2].detail}
              </div>
            </motion.div>
          </RevealOnScroll>

          {/* Metric Card 2 */}
          <RevealOnScroll className="lg:col-span-4" delay={0.25}>
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              className="h-full min-h-[140px] rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm p-5 flex items-center gap-5"
            >
              <div className="h-12 w-12 rounded-xl bg-accent/12 grid place-items-center flex-shrink-0">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-3xl font-display font-bold">98%</p>
                <p className="text-xs text-muted-foreground">Satisfaction Rate</p>
              </div>
            </motion.div>
          </RevealOnScroll>

          {/* Step 4 - Full width */}
          <RevealOnScroll className="sm:col-span-2 lg:col-span-8" delay={0.3}>
            <motion.div
              whileHover={{ y: -4 }}
              className="h-full rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="flex items-center gap-4 flex-1">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-hero grid place-items-center flex-shrink-0">
                    <Lightbulb className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-3xl font-display font-bold text-foreground/20">04</span>
                      <h3 className="text-xl font-display font-bold">{steps[3].title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{steps[3].desc}</p>
                  </div>
                </div>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-2 text-sm text-primary font-medium cursor-pointer"
                >
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
              </div>
            </motion.div>
          </RevealOnScroll>

          {/* Metric Card 3 */}
          <RevealOnScroll className="sm:col-span-2 lg:col-span-4" delay={0.35}>
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              className="h-full rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm p-5 flex items-center gap-5"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/12 grid place-items-center flex-shrink-0">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-display font-bold">3x</p>
                <p className="text-xs text-muted-foreground">Faster Grading</p>
              </div>
            </motion.div>
          </RevealOnScroll>
        </div>

        {/* Bottom CTA */}
        <RevealOnScroll className="mt-12 lg:mt-16 text-center">
          <motion.div
            className="inline-flex items-center gap-3 rounded-full border border-primary/30 bg-primary/8 backdrop-blur-sm px-6 py-3"
            whileHover={{ scale: 1.03 }}
          >
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm">
              <span className="font-medium text-foreground">System ready</span>
              <span className="text-muted-foreground"> • Start optimizing today</span>
            </span>
          </motion.div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
