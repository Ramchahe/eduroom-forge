import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "@/lib/storage";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";
import {
  Brain,
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Sparkles,
  BarChart3,
  Users,
  BookOpen,
  Zap,
  Shield,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const features = [
  { icon: BookOpen, text: "AI-Powered Courses" },
  { icon: BarChart3, text: "Smart Analytics" },
  { icon: Users, text: "Student Management" },
  { icon: Video, text: "Live Streaming" },
  { icon: Shield, text: "Enterprise Security" },
  { icon: Zap, text: "Instant Assessments" },
];

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your email and password");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const user = storage.getUserByEmail(email);
      if (!user) {
        toast.error("No account found with this email");
        setIsLoading(false);
        return;
      }

      storage.setCurrentUser(user);
      toast.success(`Welcome back, ${user.name}!`);

      if (user.role === "student") {
        navigate("/student-dashboard");
      } else if (user.role === "teacher") {
        navigate("/teacher-dashboard");
      } else {
        navigate("/dashboard");
      }

      setIsLoading(false);
    }, 800);
  };

  const handleDemoAdmin = () => {
    setIsLoading(true);
    setTimeout(() => {
      const demoUser = {
        id: "demo-admin-" + Date.now(),
        name: "Demo Admin",
        email: "demo@eduai.com",
        role: "admin" as const,
      };
      storage.setCurrentUser(demoUser);
      const existing = storage.getUserByEmail("demo@eduai.com");
      if (!existing) storage.addUser(demoUser);
      toast.success("Entered admin demo — explore the full platform!");
      navigate("/dashboard");
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* ── Left branding panel ── */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-hero p-12 text-primary-foreground">
        {/* Decorative blobs */}
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-white/5 blur-[80px] pointer-events-none" />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 flex items-center gap-3"
        >
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg">
            <Brain className="h-6 w-6" />
          </span>
          <span className="text-2xl font-display font-bold tracking-tight">EduAI</span>
        </motion.div>

        {/* Center hero text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative z-10 space-y-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm px-4 py-2 text-sm">
            <Sparkles className="h-4 w-4" />
            AI-Powered Education Platform
          </div>
          <h1 className="text-4xl xl:text-5xl font-display font-bold leading-[1.1] tracking-tight">
            The future of learning starts here
          </h1>
          <p className="text-lg text-white/70 leading-relaxed max-w-sm">
            Sign in to manage courses, track students, and unlock powerful AI-driven insights.
          </p>

          {/* Feature grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {features.map((f, i) => (
              <motion.div
                key={f.text}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                className="flex items-center gap-2.5 rounded-xl bg-white/10 backdrop-blur-sm px-3 py-2.5"
              >
                <f.icon className="h-4 w-4 text-white/80 flex-shrink-0" />
                <span className="text-sm text-white/85 font-medium">{f.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom trust */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 flex items-center gap-6 text-sm text-white/60"
        >
          <span>🔒 SOC 2 Compliant</span>
          <span>⚡ 99.9% Uptime</span>
          <span>🎓 500+ Institutions</span>
        </motion.div>
      </div>

      {/* ── Right form panel ── */}
      <div className="relative flex flex-col items-center justify-center px-5 py-12 sm:px-10 bg-background">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
        </div>

        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>

        {/* Mobile logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 flex items-center gap-2.5 lg:hidden"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-hero text-primary-foreground shadow-md">
            <Brain className="h-5 w-5" />
          </span>
          <span className="text-xl font-display font-bold text-foreground">EduAI</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-md"
        >
          {/* Heading */}
          <div className="mb-8 space-y-1.5">
            <h2 className="text-3xl font-display font-bold text-foreground tracking-tight">
              Welcome back
            </h2>
            <p className="text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-12 pl-10 rounded-xl border-border/60 bg-card focus:border-primary transition-colors"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-12 pl-10 pr-11 rounded-xl border-border/60 bg-card focus:border-primary transition-colors"
                  autoComplete="current-password"
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

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-gradient-hero text-primary-foreground font-semibold text-base shadow-md hover:opacity-90 transition-opacity"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                  Signing in…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-medium">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Demo admin button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleDemoAdmin}
            disabled={isLoading}
            className="w-full h-12 rounded-xl border-2 border-primary/30 bg-primary/5 text-primary font-semibold hover:bg-primary/10 hover:border-primary/60 transition-all"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Try Admin Demo — No Sign-Up Required
          </Button>

          <p className="mt-3 text-center text-xs text-muted-foreground">
            Instant access • Full admin dashboard • No credit card
          </p>

          {/* Sign up link */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="font-semibold text-primary hover:underline underline-offset-4 transition-all"
            >
              Create one for free
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
