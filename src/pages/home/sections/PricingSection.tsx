import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

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
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For institutions",
    features: ["Everything in Pro", "Custom branding", "SSO integration", "Dedicated support", "SLA guarantee"],
    popular: false,
  },
] as const;

export function PricingSection({ onGetStarted }: Props) {
  return (
    <section id="pricing" className="relative py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Pricing
          </span>
          <h2 className="mt-5 text-3xl font-display font-semibold sm:text-4xl lg:text-5xl">
            Simple, <span className="text-gradient">transparent</span> pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">Start free and scale as you grow. No hidden fees.</p>
        </motion.div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ delay: i * 0.06 }}
              className={`relative overflow-hidden rounded-3xl border bg-card/45 p-8 shadow-2xl ${
                plan.popular ? "border-primary/50" : "border-border/60"
              }`}
            >
              {plan.popular && (
                <div className="absolute right-6 top-6 rounded-full bg-gradient-hero px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Most popular
                </div>
              )}

              <h3 className="text-2xl font-display font-semibold">{plan.name}</h3>
              <div className="mt-4 flex items-end gap-2">
                <span className="text-4xl font-semibold">{plan.price}</span>
                {"period" in plan && plan.period ? (
                  <span className="text-muted-foreground">{plan.period}</span>
                ) : null}
              </div>
              <p className="mt-2 text-muted-foreground">{plan.desc}</p>

              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                className={plan.popular ? "mt-8 w-full bg-gradient-hero glow-primary" : "mt-8 w-full"}
                variant={plan.popular ? "default" : "outline"}
                onClick={onGetStarted}
              >
                Get started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
