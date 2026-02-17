import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "@/lib/storage";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  ArrowRight,
  Rocket,
  BarChart3,
  Users,
  BookOpen,
  Video,
  Shield,
  Sparkles,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type OnboardingStep = "welcome" | "details" | "launching";

const platformFeatures = [
  { icon: BookOpen, label: "Course Management", delay: 0 },
  { icon: Video, label: "Live Classes", delay: 0.1 },
  { icon: BarChart3, label: "AI Analytics", delay: 0.2 },
  { icon: Users, label: "Student Management", delay: 0.3 },
  { icon: Shield, label: "Enterprise Security", delay: 0.4 },
  { icon: Zap, label: "Smart Assessments", delay: 0.5 },
];

const Login = () => {
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [orgName, setOrgName] = useState("");
  const navigate = useNavigate();

  const handleLaunch = () => {
    if (!name || !email) {
      toast.error("Please fill in your name and email");
      return;
    }

    setStep("launching");

    // Check existing user
    const existingUser = storage.getUserByEmail(email);

    setTimeout(() => {
      if (existingUser) {
        storage.setCurrentUser(existingUser);
        toast.success(`Welcome back, ${existingUser.name}!`);
      } else {
        const user = {
          id: Date.now().toString(),
          name,
          email,
          role: "admin" as const,
        };
        storage.setCurrentUser(user);
        storage.addUser(user);
        toast.success(`Welcome, ${name}! Your demo is ready.`);
      }
      navigate("/dashboard");
    }, 2400);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Theme toggle */}
      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle />
      </div>

      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/8 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/8 rounded-full blur-[140px]" />
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid opacity-[0.03]" />
      </div>

      {/* Floating orbs */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary/10 blur-2xl"
          style={{
            width: 60 + i * 30,
            height: 60 + i * 30,
            top: `${15 + i * 18}%`,
            left: `${10 + i * 20}%`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            delay: i * 0.8,
          }}
        />
      ))}

      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex items-center gap-3"
        >
          <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-gradient-hero text-primary-foreground">
            <Brain className="h-6 w-6" />
            <span className="absolute -inset-1 -z-10 rounded-2xl bg-gradient-hero blur-lg opacity-40" />
          </span>
          <span className="text-2xl font-display font-bold tracking-tight text-foreground">
            EduAI
          </span>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Welcome */}
          {step === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-xl text-center"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 mb-6"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Admin Demo Access</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.1] tracking-tight"
              >
                Experience the
                <span className="text-gradient block mt-1">future of education</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="mt-5 text-lg text-muted-foreground max-w-md mx-auto"
              >
                Launch your admin demo in seconds. Explore AI-powered course management, analytics, and more.
              </motion.p>

              {/* Feature pills grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-3"
              >
                {platformFeatures.map((f, i) => (
                  <motion.div
                    key={f.label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + f.delay }}
                    whileHover={{ y: -3, scale: 1.02 }}
                    className="flex items-center gap-2.5 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm px-4 py-3 text-sm"
                  >
                    <div className="h-8 w-8 rounded-lg bg-primary/10 grid place-items-center flex-shrink-0">
                      <f.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-foreground/80 font-medium text-xs sm:text-sm">{f.label}</span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-10"
              >
                <Button
                  size="lg"
                  onClick={() => setStep("details")}
                  className="group bg-gradient-hero glow-primary text-primary-foreground px-10 h-14 text-base font-semibold rounded-2xl"
                >
                  <Rocket className="mr-2 h-5 w-5" />
                  Start Demo
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <p className="mt-4 text-xs text-muted-foreground">
                  No credit card required • Instant setup • Full admin access
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  Not an admin?{" "}
                  <Button
                    variant="link"
                    className="h-auto p-0 text-primary"
                    onClick={() => navigate("/signup")}
                  >
                    Create an account
                  </Button>
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* STEP 2: Details */}
          {step === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-md"
            >
              <div className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-xl p-8 sm:p-10 shadow-[var(--shadow-large)]">
                {/* Glow behind card */}
                <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 blur-2xl opacity-40" />

                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-hero text-primary-foreground mb-4"
                  >
                    <Rocket className="h-7 w-7" />
                  </motion.div>
                  <h2 className="text-2xl font-display font-bold">
                    Setup your demo
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Quick details to personalize your experience
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleLaunch();
                  }}
                  className="space-y-5"
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="name" className="text-sm font-medium">
                      Your Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-12 rounded-xl bg-background/60 border-border/50"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@school.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 rounded-xl bg-background/60 border-border/50"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="org" className="text-sm font-medium">
                      Organization{" "}
                      <span className="text-muted-foreground font-normal">(optional)</span>
                    </Label>
                    <Input
                      id="org"
                      placeholder="Westlake Academy"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="h-12 rounded-xl bg-background/60 border-border/50"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="pt-2 space-y-3"
                  >
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-gradient-hero glow-primary text-primary-foreground h-13 text-base font-semibold rounded-xl"
                    >
                      <Rocket className="mr-2 h-5 w-5" />
                      Launch Demo
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="w-full text-muted-foreground"
                      onClick={() => setStep("welcome")}
                    >
                      ← Back
                    </Button>
                  </motion.div>
                </form>

                {/* Trust indicators */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground"
                >
                  <span className="flex items-center gap-1.5">
                    <Shield className="h-3 w-3" />
                    Secure
                  </span>
                  <span className="h-3 w-px bg-border" />
                  <span className="flex items-center gap-1.5">
                    <Zap className="h-3 w-3" />
                    Instant
                  </span>
                  <span className="h-3 w-px bg-border" />
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3" />
                    Full access
                  </span>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Launching animation */}
          {step === "launching" && (
            <motion.div
              key="launching"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md text-center"
            >
              {/* Animated rocket */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-hero text-primary-foreground mb-8 shadow-[var(--shadow-glow-primary)]"
              >
                <Rocket className="h-10 w-10" />
              </motion.div>

              <h2 className="text-2xl font-display font-bold mb-3">
                Preparing your demo...
              </h2>

              {/* Progress steps */}
              <div className="mt-8 space-y-4 text-left max-w-xs mx-auto">
                {[
                  { label: "Setting up admin dashboard", delay: 0 },
                  { label: "Loading AI modules", delay: 0.6 },
                  { label: "Configuring analytics", delay: 1.2 },
                  { label: "Almost ready!", delay: 1.8 },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: item.delay }}
                    className="flex items-center gap-3"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: item.delay + 0.3 }}
                      className="h-6 w-6 rounded-full bg-primary/15 grid place-items-center flex-shrink-0"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    </motion.div>
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Login;
