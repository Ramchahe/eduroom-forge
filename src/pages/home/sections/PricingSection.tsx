import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Sparkles, Zap } from "lucide-react";
import { RevealOnScroll } from "@/pages/home/components/RevealOnScroll";

type Props = {
  onGetStarted: () => void;
};

const plans = [
  {
    name: "Starter",
    price: "Free",
    desc: "Perfect for students",
    features: ["Access all courses", "Take unlimited quizzes", "View your results", "Community access"],
    popular: false,
    accent: "muted",
  },
  {
    name: "Professional",
    price: "₹999",
    period: "/month",
    desc: "For educators",
    features: [
      "Create unlimited courses",
      "Advanced quiz builder",
      "Live streaming",
      "Analytics dashboard",
      "Priority support",
    ],
    popular: true,
    accent: "primary",
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For institutions",
    features: ["Everything in Pro", "Custom branding", "SSO integration", "Dedicated support", "SLA guarantee"],
    popular: false,
    accent: "accent",
  },
] as const;

export function PricingSection({ onGetStarted }: Props) {
  return (
    <section id="pricing" className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <RevealOnScroll className="mx-auto mb-12 lg:mb-16 max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 backdrop-blur-sm px-4 py-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            Pricing
          </span>
          <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-display font-bold">
            Simple, <span className="text-gradient">transparent</span> pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free and scale as you grow. No hidden fees.
          </p>
        </RevealOnScroll>

        {/* Pricing cards */}
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {plans.map((plan, i) => (
            <RevealOnScroll key={plan.name} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`relative h-full overflow-hidden rounded-2xl border bg-card/30 backdrop-blur-sm p-6 lg:p-8 ${
                  plan.popular 
                    ? "border-primary/50 shadow-lg shadow-primary/10" 
                    : "border-border/50"
                }`}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-4 top-4 rounded-full bg-gradient-hero px-3 py-1 text-xs font-semibold text-primary-foreground"
                  >
                    Most popular
                  </motion.div>
                )}

                {/* Hover gradient */}
                <div className={`absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${
                  plan.popular ? "from-primary/10" : "from-accent/5"
                } to-transparent pointer-events-none`} />

                <div className="relative">
                  <h3 className="text-xl lg:text-2xl font-display font-bold">{plan.name}</h3>
                  
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl lg:text-4xl font-display font-bold">{plan.price}</span>
                    {"period" in plan && plan.period && (
                      <span className="text-muted-foreground text-sm">{plan.period}</span>
                    )}
                  </div>
                  
                  <p className="mt-2 text-sm text-muted-foreground">{plan.desc}</p>

                  <ul className="mt-6 space-y-3">
                    {plan.features.map((f, fi) => (
                      <motion.li 
                        key={f} 
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + fi * 0.05 }}
                        className="flex items-start gap-2.5 text-sm text-muted-foreground"
                      >
                        <CheckCircle2 className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                          plan.popular ? "text-primary" : "text-accent"
                        }`} />
                        {f}
                      </motion.li>
                    ))}
                  </ul>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      className={`mt-8 w-full ${
                        plan.popular 
                          ? "bg-gradient-hero glow-primary text-primary-foreground" 
                          : ""
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                      onClick={onGetStarted}
                    >
                      Get started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </RevealOnScroll>
          ))}
        </div>

        {/* Bottom note */}
        <RevealOnScroll className="mt-12 text-center">
          <motion.div
            className="inline-flex items-center gap-3 rounded-full border border-border/60 bg-card/50 backdrop-blur-sm px-5 py-2.5"
            whileHover={{ scale: 1.02 }}
          >
            <Zap className="h-4 w-4 text-accent" />
            <span className="text-sm text-muted-foreground">
              All plans include <span className="text-foreground font-medium">14-day free trial</span>
            </span>
          </motion.div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
