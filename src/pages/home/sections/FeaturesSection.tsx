import { motion } from "framer-motion";
import {
  BarChart3,
  Brain,
  FileCheck,
  MessageCircle,
  Shield,
  Video,
  Sparkles,
} from "lucide-react";
import { RevealOnScroll } from "@/pages/home/components/RevealOnScroll";

const features = [
  {
    icon: Brain,
    title: "AI Course Builder",
    desc: "Create courses, lessons and quizzes with AI assistance. Smart content generation saves hours of work.",
    accent: "primary",
  },
  {
    icon: Video,
    title: "Live Classes",
    desc: "Stream HD sessions with real-time chat, attendance tracking, and instant replays for your students.",
    accent: "accent",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    desc: "Visualize student performance, identify trends, and get actionable insights with AI-powered reports.",
    accent: "primary",
  },
  {
    icon: MessageCircle,
    title: "Communities",
    desc: "Foster collaboration with discussion forums, file sharing, and peer-to-peer learning spaces.",
    accent: "accent",
  },
  {
    icon: FileCheck,
    title: "Smart Assessments",
    desc: "Build quizzes with auto-grading, detailed reports, and adaptive question banks powered by AI.",
    accent: "primary",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    desc: "Role-based access control, audit logs, and privacy-first design keep your data safe.",
    accent: "accent",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
      </div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <RevealOnScroll className="mx-auto mb-12 lg:mb-20 max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 backdrop-blur-sm px-4 py-2 text-sm text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            Core Modules
          </span>
          <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-display font-bold">
            Everything you need to
            <span className="text-gradient block mt-1">run modern education</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete AI-powered platform designed to streamline teaching and maximize student outcomes.
          </p>
        </RevealOnScroll>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            const isAccent = f.accent === "accent";
            
            return (
              <RevealOnScroll key={f.title} delay={i * 0.08}>
                <motion.article
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="group relative h-full overflow-hidden rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm p-6 lg:p-8 cursor-pointer"
                >
                  {/* Hover gradient */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${isAccent ? "from-accent/10" : "from-primary/10"} to-transparent`} />

                  <div className="relative">
                    {/* Icon */}
                    <motion.div 
                      className={`mb-5 h-12 w-12 rounded-xl grid place-items-center ${isAccent ? "bg-accent/15" : "bg-primary/15"}`}
                      whileHover={{ scale: 1.05, rotate: 3 }}
                    >
                      <Icon className={`h-6 w-6 ${isAccent ? "text-accent" : "text-primary"}`} />
                    </motion.div>

                    {/* Content */}
                    <h3 className="text-xl font-display font-semibold mb-2">{f.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </motion.article>
              </RevealOnScroll>
            );
          })}
        </div>

        {/* CTA */}
        <RevealOnScroll className="mt-12 lg:mt-16 text-center">
          <motion.div
            className="inline-flex items-center gap-3 rounded-full border border-border/60 bg-card/50 backdrop-blur-sm px-6 py-3"
            whileHover={{ scale: 1.02 }}
          >
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm text-muted-foreground">
              <span className="text-foreground font-medium">All features included</span> in every plan
            </span>
          </motion.div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
