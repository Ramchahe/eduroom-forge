import { motion } from "framer-motion";
import {
  BarChart3,
  Brain,
  FileCheck,
  MessageCircle,
  Shield,
  Video,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI course builder",
    desc: "Draft lessons, outlines and quizzes with consistent quality.",
    tags: ["outlines", "rubrics", "question bank"],
  },
  {
    icon: Video,
    title: "Live classes",
    desc: "Stream sessions with chat, replays and class targeting.",
    tags: ["chat", "replays", "attendance"],
  },
  {
    icon: BarChart3,
    title: "Performance analytics",
    desc: "See trends, rank insights and improvement signals instantly.",
    tags: ["trends", "leaderboards", "alerts"],
  },
  {
    icon: MessageCircle,
    title: "Communities",
    desc: "Students post, discuss and collaborate with attachments.",
    tags: ["posts", "files", "comments"],
  },
  {
    icon: FileCheck,
    title: "Assessments",
    desc: "Build and deliver quizzes fast with smart reporting.",
    tags: ["auto grade", "reports", "results"],
  },
  {
    icon: Shield,
    title: "Secure by design",
    desc: "Permission-based access with audit-friendly controls.",
    tags: ["roles", "privacy", "controls"],
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Modules
          </span>
          <h2 className="mt-5 text-3xl font-display font-semibold sm:text-4xl lg:text-5xl">
            Everything, orchestrated by <span className="text-gradient">AI</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A complete AI-powered online teaching management platform—designed to feel like a control room.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-2xl glass p-8"
            >
              <div className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute -inset-10 bg-gradient-accent opacity-15 blur-3xl" />
              </div>

              <div className="flex items-start gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/12 transition-colors group-hover:bg-primary/18">
                  <f.icon className="h-7 w-7 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-display font-semibold">{f.title}</h3>
                  <p className="mt-2 text-muted-foreground">{f.desc}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {f.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center rounded-full border border-border/60 bg-background/10 px-3 py-1 text-xs text-muted-foreground"
                  >
                    <Zap className="mr-1 h-3.5 w-3.5 text-accent" />
                    {t}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
