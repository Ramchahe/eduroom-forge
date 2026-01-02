import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    q: "How does the AI personalization work?",
    a: "It analyzes results, engagement and learning patterns to suggest pacing, interventions and next actions.",
  },
  {
    q: "Can I stream live classes to multiple classes at once?",
    a: "Yes. Teachers can broadcast to multiple classes; students join based on class targeting.",
  },
  {
    q: "Is our data secure?",
    a: "Yes. The app is built around secure access patterns and privacy-first defaults.",
  },
  {
    q: "Can I try before I buy?",
    a: "Yes. Start with the free plan and upgrade when you need more features.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="relative py-24">
      <div className="container mx-auto max-w-3xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          className="mx-auto mb-14 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-primary" />
            FAQ
          </span>
          <h2 className="mt-5 text-3xl font-display font-semibold sm:text-4xl">
            Frequently asked <span className="text-gradient">questions</span>
          </h2>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={faq.q}
              value={`item-${i}`}
              className="rounded-2xl border border-border/60 bg-card/45 px-6"
            >
              <AccordionTrigger className="text-left font-medium hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
