import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export function CtaSection({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="relative py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-15%" }}
          className="relative overflow-hidden rounded-3xl border border-border/40"
        >
          <div className="absolute inset-0 bg-gradient-hero opacity-90" />
          <div className="absolute inset-0 bg-grid opacity-[0.08]" />
          
          {/* Floating orbs */}
          <motion.div
            className="absolute top-10 left-10 h-32 w-32 rounded-full bg-white/10 blur-3xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
            transition={{ duration: 6, repeat: Infinity }}
          />

          <div className="relative px-8 py-16 text-center lg:py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/20 px-4 py-2 mb-6"
            >
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium text-primary-foreground/90">Get started for free</span>
            </motion.div>
            
            <h2 className="text-3xl font-display font-bold text-primary-foreground sm:text-4xl lg:text-5xl leading-tight">
              Ready to transform your
              <br className="hidden sm:block" />
              teaching experience?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-primary-foreground/75">
              Launch faster, measure better, and keep students engaged — with an AI-first workflow.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                variant="secondary"
                onClick={onGetStarted}
                className="h-13 px-8 text-base font-semibold rounded-xl"
              >
                Start free demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-13 px-8 text-base border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 rounded-xl"
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
