import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CtaSection({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="relative py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-20%" }}
          className="relative overflow-hidden rounded-3xl border border-border/60"
        >
          <div className="absolute inset-0 bg-gradient-hero opacity-90" />
          <div className="absolute inset-0 bg-grid opacity-[0.14]" />

          <div className="relative px-8 py-16 text-center lg:py-20">
            <h2 className="text-3xl font-display font-semibold text-primary-foreground sm:text-4xl lg:text-5xl">
              Ready to run your teaching like a modern product?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
              Launch faster, measure better, and keep students engaged — with an AI-first workflow.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" onClick={onGetStarted}>
                Start free trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/35 text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              >
                Talk to sales
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
