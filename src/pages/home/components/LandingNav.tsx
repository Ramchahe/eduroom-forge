import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
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
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 40);
  });

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed left-0 right-0 top-0 z-50 transition-all duration-500"
    >
      <div
        className={`transition-all duration-500 ${
          scrolled
            ? "mx-4 mt-3 rounded-2xl border border-border/60 bg-card/70 backdrop-blur-2xl shadow-[var(--shadow-medium)] md:mx-auto md:max-w-4xl lg:max-w-5xl"
            : "bg-transparent"
        }`}
      >
        <div
          className={`flex items-center justify-between transition-all duration-500 ${
            scrolled ? "px-4 py-2.5 md:px-6" : "container mx-auto px-4 py-4"
          }`}
        >
          {/* Logo */}
          <motion.button
            type="button"
            onClick={onLogoClick}
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2.5"
            aria-label="Go to home"
          >
            <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-hero text-primary-foreground">
              <Brain className="h-4.5 w-4.5" />
              <span className="absolute -inset-1 -z-10 rounded-xl bg-gradient-hero blur opacity-40" />
            </span>
            <span className="text-lg font-display font-semibold tracking-tight text-foreground">
              EduAI
            </span>
          </motion.button>

          {/* Desktop links */}
          <div className="hidden items-center gap-7 md:flex">
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

          {/* Desktop actions */}
          <div className="hidden items-center gap-2.5 md:flex">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={onSignIn}
              className="text-sm"
            >
              Sign in
            </Button>
            <Button
              size="sm"
              className="bg-gradient-hero glow-primary text-sm"
              onClick={onGetStarted}
            >
              Get Started
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Mobile menu toggle */}
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

        {/* Mobile menu */}
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="md:hidden border-t border-border/40"
          >
            <div className="flex flex-col gap-2 px-4 py-4">
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
              <div className="flex items-center justify-between pt-2 border-t border-border/30">
                <ThemeToggle />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={onSignIn}>
                    Sign in
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gradient-hero"
                    onClick={onGetStarted}
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
