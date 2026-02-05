import { motion } from "framer-motion";
import { Star, Quote, MessageCircle } from "lucide-react";
import { RevealOnScroll } from "@/pages/home/components/RevealOnScroll";

const testimonials = [
  {
    name: "Dr. Sarah Johnson",
    role: "Professor, Stanford",
    quote: "EduAI turned my content + assessments into a coherent system. Analytics is now effortless.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "EdTech Director",
    quote: "Live streaming feels premium and stable. Engagement improved immediately.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Online Educator",
    quote: "Communities with file sharing made collaboration feel natural for my students.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/[0.02] to-transparent" />
      </div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <RevealOnScroll className="mx-auto mb-12 lg:mb-16 max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 backdrop-blur-sm px-4 py-2 text-sm text-muted-foreground">
            <MessageCircle className="h-4 w-4 text-accent" />
            Testimonials
          </span>
          <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-display font-bold">
            Built for <span className="text-gradient">real</span> classrooms
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            See what educators are saying about their experience.
          </p>
        </RevealOnScroll>

        {/* Testimonial cards */}
        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <RevealOnScroll key={t.name} delay={i * 0.1}>
              <motion.article
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative h-full rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm p-6 lg:p-8"
              >
                {/* Hover gradient */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-accent/10 to-transparent rounded-2xl pointer-events-none" />

                <div className="relative">
                  {/* Quote icon */}
                  <div className="mb-4">
                    <Quote className="h-8 w-8 text-primary/20" />
                  </div>

                  {/* Stars */}
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <motion.span
                        key={j}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + j * 0.05 }}
                      >
                        <Star className="h-4 w-4 text-warning fill-current" />
                      </motion.span>
                    ))}
                  </div>

                  {/* Quote text */}
                  <p className="text-foreground/90 leading-relaxed mb-6">"{t.quote}"</p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-border/30">
                    <motion.div 
                      className="h-11 w-11 rounded-full bg-gradient-hero grid place-items-center text-sm font-bold text-primary-foreground flex-shrink-0"
                      whileHover={{ scale: 1.1 }}
                    >
                      {t.name.split(' ').map(n => n[0]).join('')}
                    </motion.div>
                    <div>
                      <p className="font-medium text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              </motion.article>
            </RevealOnScroll>
          ))}
        </div>

        {/* Stats row */}
        <RevealOnScroll className="mt-12 lg:mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { value: "50K+", label: "Active Users" },
              { value: "4.9/5", label: "Average Rating" },
              { value: "98%", label: "Satisfaction" },
              { value: "24/7", label: "Support" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="text-center p-4 rounded-xl border border-border/30 bg-card/20 backdrop-blur-sm"
              >
                <p className="text-xl lg:text-2xl font-display font-bold text-gradient">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
