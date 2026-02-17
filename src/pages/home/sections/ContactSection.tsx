import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, Sparkles, Clock, ArrowRight, CheckCircle2, Globe } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { FloatingInput, FloatingTextarea } from "@/pages/home/components/FloatingField";

const steps = [
  { label: "We review your requirements", time: "~2 mins", icon: CheckCircle2 },
  { label: "We propose a setup + rollout plan", time: "same day", icon: ArrowRight },
  { label: "You get a guided demo", time: "24h", icon: Globe },
];

export function ContactSection({ decorativeImage }: { decorativeImage: string }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const contactCards = useMemo(
    () => [
      { icon: Mail, label: "Email", value: "hello@eduai.com", color: "bg-primary/10 text-primary" },
      { icon: Phone, label: "Phone", value: "+91 98765 43210", color: "bg-accent/10 text-accent" },
      { icon: MapPin, label: "Location", value: "Bangalore, India", color: "bg-success/10 text-success" },
      { icon: Clock, label: "Response", value: "Within 24 hours", color: "bg-warning/10 text-warning" },
    ],
    []
  );

  return (
    <section id="contact" className="relative py-28 overflow-hidden">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-1/4 h-[600px] w-[600px] rounded-full bg-primary/4 blur-[140px]" />
        <div className="absolute left-0 bottom-1/4 h-[400px] w-[400px] rounded-full bg-accent/4 blur-[120px]" />
      </div>

      <div className="container relative mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          className="mb-16 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-accent" />
            Get in Touch
          </span>
          <h2 className="mt-5 text-3xl font-display font-semibold sm:text-4xl lg:text-5xl">
            Ready to transform your institution?{" "}
            <span className="text-gradient">Let's talk</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Tell us what you're building. We'll suggest the best setup and features for your needs.
          </p>
        </motion.div>

        {/* Bento grid for contact cards */}
        <div className="mx-auto mb-14 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {contactCards.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="group rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-5 transition-colors hover:border-primary/30 hover:bg-card/60"
            >
              <div className={`grid h-11 w-11 place-items-center rounded-xl ${c.color} transition-transform group-hover:scale-110`}>
                <c.icon className="h-5 w-5" />
              </div>
              <p className="mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{c.label}</p>
              <p className="mt-1 text-sm font-semibold text-foreground/90">{c.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Main content: form + timeline */}
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-5 lg:items-start">
          {/* Form - takes 3 cols */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            className="relative lg:col-span-3"
          >
            <div className="absolute -inset-3 -z-10 rounded-3xl bg-gradient-hero opacity-[0.07] blur-2xl" />

            <div className="rounded-3xl border border-border/60 bg-card/50 backdrop-blur-sm p-8 shadow-lg">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-display font-semibold">Request a demo</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Share your details — we'll tailor the walkthrough.
                  </p>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  className="rounded-full bg-success/10 px-3 py-1.5 text-xs font-semibold text-success"
                >
                  Free
                </motion.div>
              </div>

              <form
                className="mt-8 space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  toast.success("Thanks! We'll contact you shortly.");
                  setForm({ name: "", email: "", phone: "", message: "" });
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <FloatingInput
                    id="contact-name"
                    label="Full name"
                    value={form.name}
                    onChange={(name) => setForm((p) => ({ ...p, name }))}
                    required
                  />
                  <FloatingInput
                    id="contact-email"
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(email) => setForm((p) => ({ ...p, email }))}
                    required
                  />
                </div>

                <FloatingInput
                  id="contact-phone"
                  label="Phone (optional)"
                  value={form.phone}
                  onChange={(phone) => setForm((p) => ({ ...p, phone }))}
                />

                <FloatingTextarea
                  id="contact-message"
                  label="What do you want to manage with AI?"
                  value={form.message}
                  onChange={(message) => setForm((p) => ({ ...p, message }))}
                  required
                />

                <Button type="submit" size="lg" className="w-full bg-gradient-hero glow-primary text-primary-foreground">
                  <Send className="mr-2 h-4 w-4" />
                  Send request
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Timeline + image - takes 2 cols */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            className="space-y-6 lg:col-span-2"
          >
            {/* What happens next timeline */}
            <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-6">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                What happens next
              </h4>
              <div className="mt-5 space-y-0">
                {steps.map((step, i) => (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex gap-4"
                  >
                    {/* Vertical line + dot */}
                    <div className="flex flex-col items-center">
                      <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10">
                        <step.icon className="h-4 w-4 text-primary" />
                      </div>
                      {i < steps.length - 1 && (
                        <div className="my-1 h-8 w-px bg-border/60" />
                      )}
                    </div>
                    <div className="pb-5">
                      <p className="text-sm font-medium text-foreground/90">{step.label}</p>
                      <p className="text-xs text-muted-foreground">{step.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Trust badges */}
            <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                {[
                  { value: "500+", label: "Institutions" },
                  { value: "50K+", label: "Students" },
                  { value: "99.9%", label: "Uptime" },
                  { value: "4.9★", label: "Rating" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.06 }}
                    className="rounded-xl bg-muted/40 p-3"
                  >
                    <p className="text-lg font-bold text-gradient">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Decorative image */}
            <motion.img
              src={decorativeImage}
              alt="AI blue abstract shapes decoration"
              loading="lazy"
              className="w-full rounded-2xl border border-border/60 opacity-80"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
