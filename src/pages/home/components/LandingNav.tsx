import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Menu, X } from "lucide-react";
import { useState } from "react";

type Props = {
  onLogoClick: () => void;
  onSignIn: () => void;
  onGetStarted: () => void;
};

const links = [
  { label: "Modules", href: "#features" },
  { label: "Flow", href: "#solutions" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

export function LandingNav({ onLogoClick, onSignIn, onGetStarted }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed left-0 right-0 top-0 z-50 glass-strong"
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <motion.button
          type="button"
          onClick={onLogoClick}
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3"
          aria-label="Go to home"
        >
          <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-hero text-primary-foreground">
            <Brain className="h-5 w-5" />
            <span className="absolute -inset-1 -z-10 rounded-xl bg-gradient-hero blur opacity-40" />
          </span>
          <span className="text-xl font-display font-semibold tracking-tight text-foreground">EduAI</span>
        </motion.button>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-hero transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={onSignIn}>
            Sign in
          </Button>
          <Button size="sm" className="bg-gradient-hero glow-primary" onClick={onGetStarted}>
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((p) => !p)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden border-t border-border/60"
        >
          <div className="container mx-auto flex flex-col gap-3 px-4 py-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="py-2 text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <div className="flex items-center justify-between pt-2">
              <ThemeToggle />
              <div className="flex gap-3">
                <Button variant="outline" onClick={onSignIn}>
                  Sign in
                </Button>
                <Button className="bg-gradient-hero" onClick={onGetStarted}>
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
