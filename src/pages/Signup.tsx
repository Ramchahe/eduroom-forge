import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Brain,
  Briefcase,
  Check,
  User,
  Mail,
  Lock,
  Building2,
  Eye,
  EyeOff,
  Sparkles,
  Shield,
  Zap,
  BarChart3,
  Users,
  BookOpen,
  Rocket,
} from "lucide-react";
import { toast } from "sonner";

type Step = 1 | 2 | 3;

const steps = [
  { num: 1, label: "Account", desc: "Name, email & password" },
  { num: 2, label: "Organization", desc: "School or institution info" },
  { num: 3, label: "Launch", desc: "Review & activate" },
];

const perks = [
  { icon: BarChart3, text: "AI-powered analytics dashboard" },
  { icon: Users, text: "Unlimited student & teacher accounts" },
  { icon: BookOpen, text: "Course & assessment management" },
  { icon: Shield, text: "Enterprise-grade security" },
  { icon: Zap, text: "Live streaming & assignments" },
  { icon: Briefcase, text: "Full admin control panel" },
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -48 : 48, opacity: 0 }),
};

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [direction, setDirection] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

  // Step 1
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Step 2
  const [orgName, setOrgName] = useState("");
  const [orgSize, setOrgSize] = useState("");

  const validateStep1 = () => {
    if (!name.trim() || !email.trim() || !password) {
      toast.error("Please fill in all fields");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    const existing = storage.getAllUsers();
    if (existing.some((u) => u.email === email)) {
      toast.error("An account with this email already exists");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!orgName.trim()) {
      toast.error("Please enter your organization name");
      return false;
    }
    return true;
  };

  const goNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setDirection(1);
    setStep((s) => (s + 1) as Step);
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => (s - 1) as Step);
  };

  const handleCreateAccount = () => {
    setIsLaunching(true);
    setTimeout(() => {
      const newAdmin = {
        id: Date.now().toString(),
        name,
        email,
        role: "admin" as const,
        organization: orgName,
      };
      storage.addUser(newAdmin);
      storage.setCurrentUser(newAdmin);
      toast.success(`Welcome aboard, ${name}! Your admin account is ready 🚀`);
      navigate("/dashboard");
    }, 1200);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* ── Left branding panel ── */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-hero p-12 text-primary-foreground">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-0 h-64 w-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 flex items-center gap-3"
        >
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg">
            <Brain className="h-6 w-6" />
          </span>
          <span className="text-2xl font-display font-bold tracking-tight">EduAI</span>
        </motion.div>

        {/* Center content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative z-10 space-y-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm px-4 py-2 text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            Admin Onboarding
          </div>
          <h1 className="text-4xl xl:text-5xl font-display font-bold leading-[1.1] tracking-tight">
            Set up your institution's learning hub
          </h1>
          <p className="text-lg text-white/70 leading-relaxed max-w-sm">
            Create your admin account and gain full control over courses, teachers, students, and analytics.
          </p>

          {/* Perks */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {perks.map((p, i) => (
              <motion.div
                key={p.text}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                className="flex items-center gap-2.5 rounded-xl bg-white/10 backdrop-blur-sm px-3 py-2.5"
              >
                <p.icon className="h-4 w-4 text-white/80 flex-shrink-0" />
                <span className="text-xs text-white/85 font-medium">{p.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Step tracker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="relative z-10 space-y-3"
        >
          {steps.map((s) => {
            const isDone = step > s.num;
            const isCurrent = step === s.num;
            return (
              <div key={s.num} className={`flex items-center gap-3 transition-opacity duration-300 ${!isDone && !isCurrent ? "opacity-40" : ""}`}>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                  isDone ? "bg-white text-primary" : isCurrent ? "bg-white/30 ring-2 ring-white/60 text-white" : "bg-white/10 text-white/50"
                }`}>
                  {isDone ? <Check className="h-3.5 w-3.5" /> : s.num}
                </div>
                <div>
                  <p className={`text-sm font-medium ${isCurrent ? "text-white" : isDone ? "text-white/90" : "text-white/50"}`}>
                    {s.label}
                  </p>
                  <p className="text-xs text-white/45">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* ── Right form panel ── */}
      <div className="relative flex flex-col items-center justify-center px-5 py-12 sm:px-10 bg-background">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
        </div>

        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>

        {/* Mobile header */}
        <div className="mb-6 w-full max-w-md lg:hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-hero text-primary-foreground shadow-md">
                <Brain className="h-4 w-4" />
              </span>
              <span className="text-lg font-display font-bold text-foreground">EduAI</span>
            </div>
            <span className="text-xs text-muted-foreground font-medium">Step {step} of 3</span>
          </div>
          <div className="flex gap-1.5">
            {steps.map((s) => (
              <div
                key={s.num}
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s.num ? "bg-gradient-hero" : "bg-muted"}`}
              />
            ))}
          </div>
        </div>

        <div className="w-full max-w-md">
          {/* Heading */}
          <motion.div
            key={step + "-heading"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-7 space-y-1"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight">
              {step === 1 ? "Create admin account"
                : step === 2 ? "Your organization"
                : "Almost there!"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {step === 1 ? "Enter your details to get started"
                : step === 2 ? "Tell us about your institution"
                : "Review your details and launch your platform"}
            </p>
          </motion.div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="space-y-4"
            >
              {/* ── STEP 1: Account ── */}
              {step === 1 && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="h-12 pl-10 rounded-xl border-border/60 bg-card focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@yourschool.edu"
                        className="h-12 pl-10 rounded-xl border-border/60 bg-card focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="h-12 pl-10 pr-11 rounded-xl border-border/60 bg-card focus:border-primary transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* ── STEP 2: Organization ── */}
              {step === 2 && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="org" className="text-sm font-medium text-foreground">Organization Name</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="org"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        placeholder="Westlake Academy"
                        className="h-12 pl-10 rounded-xl border-border/60 bg-card focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="orgSize" className="text-sm font-medium text-foreground">
                      Institution Size{" "}
                      <span className="text-muted-foreground font-normal">(optional)</span>
                    </Label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {["1–50", "51–200", "201–500", "500+"].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setOrgSize(size)}
                          className={`h-11 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                            orgSize === size
                              ? "border-primary bg-primary/8 text-primary"
                              : "border-border bg-card text-foreground hover:border-primary/40"
                          }`}
                        >
                          {size} students
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex gap-3 items-start">
                    <Briefcase className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      Your account will have <strong>full admin access</strong> — you can add teachers, enroll students, manage courses, and configure everything from your dashboard.
                    </p>
                  </div>
                </>
              )}

              {/* ── STEP 3: Confirm ── */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-border/60 bg-card divide-y divide-border/60 overflow-hidden">
                    {[
                      { label: "Name", value: name },
                      { label: "Email", value: email },
                      { label: "Role", value: "Administrator" },
                      { label: "Organization", value: orgName },
                      ...(orgSize ? [{ label: "Institution Size", value: `${orgSize} students` }] : []),
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between px-4 py-3">
                        <span className="text-sm text-muted-foreground">{row.label}</span>
                        <span className="text-sm font-medium text-foreground">{row.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex gap-3 items-start">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      Everything looks good! Click <strong>Launch Platform</strong> to activate your admin dashboard.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* ── Navigation buttons ── */}
          <div className="mt-8 flex gap-3">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={goBack}
                disabled={isLaunching}
                className="flex-1 h-12 rounded-xl border-2 border-border hover:border-primary/40 font-medium"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button
                type="button"
                onClick={goNext}
                className="flex-1 h-12 rounded-xl bg-gradient-hero text-primary-foreground font-semibold shadow-md hover:opacity-90 transition-opacity"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleCreateAccount}
                disabled={isLaunching}
                className="flex-1 h-12 rounded-xl bg-gradient-hero text-primary-foreground font-semibold shadow-md hover:opacity-90 transition-opacity"
              >
                {isLaunching ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                    Launching…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Rocket className="h-4 w-4" />
                    Launch Platform
                  </span>
                )}
              </Button>
            )}
          </div>

          {step === 1 && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-semibold text-primary hover:underline underline-offset-4 transition-all"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
