import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { FloatingInput, FloatingTextarea } from "@/pages/home/components/FloatingField";

export function ContactSection({ decorativeImage }: { decorativeImage: string }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const contactCards = useMemo(
    () => [
      { icon: Mail, label: "Email", value: "hello@eduai.com" },
      { icon: Phone, label: "Phone", value: "+91 98765 43210" },
      { icon: MapPin, label: "Location", value: "Bangalore, India" },
    ],
    []
  );

  return (
    <section id="contact" className="relative py-24">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
          >
            <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-accent" />
              Contact
            </span>
            <h2 className="mt-5 text-3xl font-display font-semibold sm:text-4xl lg:text-5xl">
              Talk to us — we’ll respond <span className="text-gradient">fast</span>
            </h2>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              Tell us what you’re building (school, coaching center, institute). We’ll suggest the best setup and
              features.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {contactCards.map((c) => (
                <motion.div
                  key={c.label}
                  whileHover={{ y: -6 }}
                  className="rounded-2xl glass p-5"
                >
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/12">
                    <c.icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">{c.label}</p>
                  <p className="mt-1 text-sm font-medium text-foreground/90">{c.value}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 overflow-hidden rounded-3xl border border-border/60 bg-card/40">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-mesh opacity-20" />
                <div className="absolute inset-0 bg-grid opacity-[0.18]" />
                <div className="relative p-6">
                  <p className="text-sm text-muted-foreground">What happens next</p>
                  <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>1) We review your requirements</span>
                      <span className="text-foreground/90">~2 mins</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>2) We propose a setup + rollout plan</span>
                      <span className="text-foreground/90">same day</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>3) You get a guided demo</span>
                      <span className="text-foreground/90">24h</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <img
              src={decorativeImage}
              alt="AI blue abstract shapes decoration"
              loading="lazy"
              className="mt-10 w-full max-w-sm rounded-3xl border border-border/60 opacity-90"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            className="relative"
          >
            <div className="absolute -inset-2 -z-10 rounded-3xl bg-gradient-hero opacity-20 blur-2xl" />

            <div className="rounded-3xl border border-border/60 bg-card/50 p-8 shadow-2xl">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-display font-semibold">Request a demo</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Share your details — we’ll tailor the walkthrough.
                  </p>
                </div>
                <div className="rounded-2xl bg-accent/12 px-3 py-2 text-xs font-medium text-foreground/90">
                  24h reply
                </div>
              </div>

              <form
                className="mt-8 space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  toast.success("Thanks! We’ll contact you shortly.");
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

                <Button type="submit" size="lg" className="w-full bg-gradient-hero glow-primary">
                  <Send className="mr-2 h-4 w-4" />
                  Send request
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
