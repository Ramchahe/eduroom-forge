import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { storage } from "@/lib/storage";
import { UserRole } from "@/types";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";
import {
  Brain,
  ArrowRight,
  BookOpen,
  Users,
  BarChart3,
  Shield,
  GraduationCap,
  Briefcase,
} from "lucide-react";

const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email) {
      toast.error("Please fill in all fields");
      return;
    }

    const existingUser = storage.getUserByEmail(email);

    if (existingUser) {
      storage.setCurrentUser(existingUser);
      toast.success(`Welcome back, ${existingUser.name}!`);
      if (existingUser.role === "admin" || existingUser.role === "teacher") {
        navigate("/dashboard");
      } else {
        navigate("/student-dashboard");
      }
    } else {
      const user = { id: Date.now().toString(), name, email, role };
      storage.setCurrentUser(user);
      storage.addUser(user);
      toast.success(`Welcome, ${name}!`);
      if (role === "admin" || role === "teacher") {
        navigate("/dashboard");
      } else {
        navigate("/student-dashboard");
      }
    }
  };

  const features = [
    { icon: BookOpen, label: "200+ Courses" },
    { icon: Users, label: "10k+ Students" },
    { icon: BarChart3, label: "AI Analytics" },
    { icon: Shield, label: "Enterprise-grade" },
  ];

  const roleOptions = [
    {
      value: "student" as UserRole,
      icon: GraduationCap,
      title: "Student",
      desc: "Access courses & tests",
    },
    {
      value: "teacher" as UserRole,
      icon: BookOpen,
      title: "Teacher",
      desc: "Create & manage courses",
    },
    {
      value: "admin" as UserRole,
      icon: Briefcase,
      title: "Admin",
      desc: "Full platform control",
    },
  ];

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel — branding */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-hero p-10 text-primary-foreground">
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute top-1/2 left-1/3 h-40 w-40 rounded-full bg-white/5 blur-xl" />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10 flex items-center gap-3"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/20 backdrop-blur-sm">
            <Brain className="h-5 w-5" />
          </span>
          <span className="text-xl font-display font-semibold tracking-tight">
            EduAI
          </span>
        </motion.div>

        {/* Center content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 space-y-6"
        >
          <h1 className="text-4xl font-display font-bold leading-tight xl:text-5xl">
            Transform the way
            <br />
            you learn & teach
          </h1>
          <p className="max-w-md text-lg text-white/80">
            An AI-powered education platform built for the modern classroom.
            Engage, track, and grow — all in one place.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 pt-2">
            {features.map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur-sm"
              >
                <f.icon className="h-4 w-4" />
                {f.label}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom testimonial */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm"
        >
          <p className="text-sm italic text-white/80">
            "EduAI reduced our admin workload by 60% while boosting student
            engagement across every course."
          </p>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-white/25" />
            <div>
              <p className="text-xs font-medium">Sarah Mitchell</p>
              <p className="text-xs text-white/60">Dean, Westlake Academy</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right panel — form */}
      <div className="relative flex flex-col items-center justify-center px-4 py-10 sm:px-8">
        {/* Theme toggle */}
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>

        {/* Mobile logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center gap-2.5 lg:hidden"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-hero text-primary-foreground">
            <Brain className="h-4.5 w-4.5" />
          </span>
          <span className="text-lg font-display font-semibold text-foreground">
            EduAI
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-display font-bold text-foreground">
              Welcome back
            </h2>
            <p className="text-muted-foreground">
              Enter your details to access the platform
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-11"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>

            {/* Role select — compact cards */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Your Role</Label>
              <RadioGroup
                value={role}
                onValueChange={(v) => setRole(v as UserRole)}
                className="grid grid-cols-3 gap-3"
              >
                {roleOptions.map((r) => {
                  const isActive = role === r.value;
                  return (
                    <Label
                      key={r.value}
                      htmlFor={r.value}
                      className={`relative flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border-2 p-3 text-center transition-all ${
                        isActive
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-primary/40 hover:bg-muted/50"
                      }`}
                    >
                      <RadioGroupItem
                        value={r.value}
                        id={r.value}
                        className="sr-only"
                      />
                      <r.icon
                        className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                      />
                      <span
                        className={`text-xs font-medium ${isActive ? "text-primary" : "text-foreground"}`}
                      >
                        {r.title}
                      </span>
                    </Label>
                  );
                })}
              </RadioGroup>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-gradient-hero glow-primary text-base"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Button
              variant="link"
              className="h-auto p-0 text-primary"
              onClick={() => navigate("/signup")}
            >
              Create one
            </Button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
