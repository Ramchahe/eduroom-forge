import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles, MessageCircleQuestion, Zap, Shield, CreditCard, Users, Lightbulb } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    q: "How does the AI personalization work?",
    a: "It analyzes results, engagement and learning patterns to suggest pacing, interventions and next actions — all in real-time.",
    icon: Zap,
  },
  {
    q: "Can I stream live classes to multiple classes at once?",
    a: "Yes. Teachers can broadcast to multiple classes simultaneously; students join based on class targeting and scheduling.",
    icon: Users,
  },
  {
    q: "Is our data secure?",
    a: "Absolutely. The platform is built around secure access patterns, end-to-end encryption, and privacy-first defaults with role-based access control.",
    icon: Shield,
  },
  {
    q: "Can I try before I buy?",
    a: "Yes. Start with the free plan — no credit card required — and upgrade when you need more features or capacity.",
    icon: CreditCard,
  },
  {
    q: "How quickly can we onboard our institution?",
    a: "Most institutions are fully set up within 24 hours. We provide guided onboarding, data migration support, and dedicated training sessions.",
    icon: Lightbulb,
  },
];

function FaqItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [open, setOpen] = useState(false);
  const Icon = faq.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <motion.button
        onClick={() => setOpen(!open)}
        className="group w-full text-left rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-5 transition-colors hover:border-primary/30 hover:bg-card/60"
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <div className="flex items-center gap-4">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
            <Icon className="h-4.5 w-4.5 text-primary" />
          </div>
          <span className="flex-1 font-medium text-foreground/90">{faq.q}</span>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-muted/60"
          >
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <p className="pt-4 pl-14 text-sm leading-relaxed text-muted-foreground">
                {faq.a}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
}

export function FaqSection() {
  return (
    <section id="faq" className="relative py-28 overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="container relative mx-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          className="mb-14 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm text-muted-foreground">
            <MessageCircleQuestion className="h-4 w-4 text-primary" />
            FAQ
          </span>
          <h2 className="mt-5 text-3xl font-display font-semibold sm:text-4xl lg:text-5xl">
            Got questions? We've got{" "}
            <span className="text-gradient">answers</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Everything you need to know about EduAI. Can't find what you're looking for? Reach out to our team.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FaqItem key={faq.q} faq={faq} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 flex flex-col items-center gap-2 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Still have questions?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Talk to our team
          </a>
        </motion.div>
      </div>
    </section>
  );
}
