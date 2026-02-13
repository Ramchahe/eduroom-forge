import { motion } from "framer-motion";
import {
  BarChart3,
  Brain,
  FileCheck,
  MessageCircle,
  Shield,
  Video,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { RevealOnScroll } from "@/pages/home/components/RevealOnScroll";

const features = [
  {
    icon: Brain,
    title: "AI Course Builder",
    desc: "Create courses, lessons and quizzes with AI assistance. Smart content generation saves hours of work.",
    accent: "primary",
    tag: "Popular",
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
    tag: "AI-Powered",
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
            Six powerful modules designed to streamline teaching and maximize student outcomes.
          </p>
        </RevealOnScroll>

        {/* Bento Grid - mixed sizes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 max-w-6xl mx-auto">
          {features.map((f, i) => {
            const Icon = f.icon;
            const isAccent = f.accent === "accent";
            // Make first and last items span 2 cols on large
            const isWide = i === 0 || i === 5;

            return (
              <RevealOnScroll
                key={f.title}
                delay={i * 0.07}
                className={isWide ? "lg:col-span-2" : ""}
              >
                <motion.article
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`group relative h-full overflow-hidden rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm cursor-pointer ${
                    isWide ? "p-8 lg:p-10" : "p-6 lg:p-8"
                  }`}
                >
                  {/* Animated gradient bg on hover */}
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${
                      isAccent ? "from-accent/8 via-transparent" : "from-primary/8 via-transparent"
                    } to-transparent`}
                  />

                  {/* Animated corner glow */}
                  <motion.div
                    className={`absolute -top-16 -right-16 h-32 w-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                      isAccent ? "bg-accent/15" : "bg-primary/15"
                    }`}
                  />

                  <div className="relative flex flex-col h-full">
                    <div className={`flex items-start ${isWide ? "gap-6" : "flex-col gap-4"}`}>
                      {/* Icon */}
                      <motion.div
                        className={`${isWide ? "h-14 w-14" : "h-12 w-12"} rounded-2xl grid place-items-center flex-shrink-0 ${
                          isAccent ? "bg-accent/12" : "bg-primary/12"
                        }`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Icon
                          className={`${isWide ? "h-7 w-7" : "h-6 w-6"} ${
                            isAccent ? "text-accent" : "text-primary"
                          }`}
                        />
                      </motion.div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className={`${isWide ? "text-2xl" : "text-xl"} font-display font-semibold`}>
                            {f.title}
                          </h3>
                          {f.tag && (
                            <span className={`text-[10px] font-semibold uppercase tracking-wider rounded-full px-2.5 py-0.5 ${
                              isAccent
                                ? "bg-accent/15 text-accent"
                                : "bg-primary/15 text-primary"
                            }`}>
                              {f.tag}
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                      </div>
                    </div>

                    {/* Learn more link on hover */}
                    <motion.div
                      className="mt-auto pt-4 flex items-center gap-1 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ color: isAccent ? "hsl(var(--accent))" : "hsl(var(--primary))" }}
                    >
                      Learn more
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </motion.div>
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
            whileHover={{ scale: 1.03 }}
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
