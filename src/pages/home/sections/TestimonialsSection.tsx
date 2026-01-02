import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Sarah Johnson",
    role: "Professor, Stanford",
    quote:
      "EduAI turned my content + assessments into a coherent system. Analytics is now effortless.",
  },
  {
    name: "Michael Chen",
    role: "EdTech Director",
    quote: "Live streaming feels premium and stable. Engagement improved immediately.",
  },
  {
    name: "Priya Sharma",
    role: "Online Educator",
    quote: "Communities with file sharing made collaboration feel natural for my students.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Testimonials
          </span>
          <h2 className="mt-5 text-3xl font-display font-semibold sm:text-4xl lg:text-5xl">
            Built for <span className="text-gradient">real</span> classrooms
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.article
              key={t.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ delay: i * 0.06 }}
              className="rounded-3xl border border-border/60 bg-card/45 p-8 shadow-2xl"
            >
              <div className="mb-4 flex gap-1 text-warning">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground">“{t.quote}”</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-hero text-sm font-semibold text-primary-foreground">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-medium">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
