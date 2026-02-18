import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "@/lib/storage";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Upload,
  Brain,
  GraduationCap,
  BookOpen,
  Briefcase,
  Check,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Camera,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

type SignupStep = 1 | 2 | 3;

const steps = [
  { num: 1, label: "Account" },
  { num: 2, label: "Details" },
  { num: 3, label: "Profile" },
];

const roleCards = [
  {
    value: "student" as UserRole,
    icon: GraduationCap,
    title: "Student",
    desc: "Access courses & take tests",
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-500",
  },
  {
    value: "teacher" as UserRole,
    icon: BookOpen,
    title: "Teacher",
    desc: "Create & manage courses",
    gradient: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-500",
  },
  {
    value: "admin" as UserRole,
    icon: Briefcase,
    title: "Admin",
    desc: "Full platform control",
    gradient: "from-violet-500/20 to-purple-500/20",
    iconColor: "text-violet-500",
  },
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -48 : 48, opacity: 0 }),
};

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<SignupStep>(1);
  const [direction, setDirection] = useState(1);
  const [role, setRole] = useState<UserRole>("student");
  const [showPassword, setShowPassword] = useState(false);

  // Step 1
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Step 2
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  // Step 3
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

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
    if (!dateOfBirth || !phoneNumber) {
      toast.error("Date of birth and phone number are required");
      return false;
    }
    return true;
  };

  const goNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setDirection(1);
    setStep((s) => (s + 1) as SignupStep);
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => (s - 1) as SignupStep);
  };

  const handleSignup = () => {
    if (role === "student" && !enrollmentNumber.trim()) {
      toast.error("Please enter your enrollment number");
      return;
    }
    if (role === "teacher" && !department.trim()) {
      toast.error("Please enter your department");
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      role,
      profilePhoto,
      dateOfBirth,
      phoneNumber,
      address,
      ...(role === "student" && { enrollmentNumber }),
      ...(role === "teacher" && { department }),
    };

    storage.addUser(newUser);
    storage.setCurrentUser(newUser);
    toast.success("Account created! Welcome to EduAI 🎉");

    if (role === "student") navigate("/student-dashboard");
    else if (role === "teacher") navigate("/teacher-dashboard");
    else navigate("/dashboard");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* ── Left branding panel ── */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-hero p-12 text-primary-foreground">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />

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
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm px-4 py-2 text-sm">
            <Sparkles className="h-4 w-4" />
            Join 50,000+ learners & educators
          </div>
          <h1 className="text-4xl xl:text-5xl font-display font-bold leading-[1.1] tracking-tight">
            Start your learning journey today
          </h1>
          <p className="text-lg text-white/70 leading-relaxed max-w-sm">
            Create your free account in under 2 minutes and access AI-powered education tools instantly.
          </p>

          {/* Step progress */}
          <div className="space-y-4 pt-4">
            {steps.map((s) => {
              const isDone = step > s.num;
              const isCurrent = step === s.num;
              return (
                <motion.div
                  key={s.num}
                  className="flex items-center gap-4"
                  animate={{ opacity: isCurrent || isDone ? 1 : 0.4 }}
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                      isDone
                        ? "bg-white text-primary"
                        : isCurrent
                          ? "bg-white/30 ring-2 ring-white/70 text-white"
                          : "bg-white/10 text-white/50"
                    }`}
                  >
                    {isDone ? <Check className="h-4 w-4" /> : s.num}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isCurrent ? "text-white" : isDone ? "text-white/90" : "text-white/50"}`}>
                      Step {s.num}: {s.label}
                    </p>
                    <p className="text-xs text-white/50">
                      {s.num === 1 ? "Choose role, name & email"
                        : s.num === 2 ? "Personal contact details"
                        : "Profile photo & specifics"}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 text-sm text-white/50"
        >
          🔒 Your data is encrypted and never shared.
        </motion.p>
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
          {/* Mobile progress */}
          <div className="flex gap-1.5">
            {steps.map((s) => (
              <div
                key={s.num}
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  step >= s.num ? "bg-gradient-hero" : "bg-muted"
                }`}
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
              {step === 1 ? "Create your account"
                : step === 2 ? "Personal details"
                : "Complete your profile"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {step === 1 ? "Choose your role and enter your basics"
                : step === 2 ? "Help us personalize your experience"
                : "Add a photo and role-specific info"}
            </p>
          </motion.div>

          {/* Step content */}
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
              {/* ── STEP 1 ── */}
              {step === 1 && (
                <>
                  {/* Role selector */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">I am a</Label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {roleCards.map((r) => {
                        const isActive = role === r.value;
                        return (
                          <button
                            key={r.value}
                            type="button"
                            onClick={() => setRole(r.value)}
                            className={`relative flex flex-col items-center gap-2.5 rounded-xl border-2 p-3.5 transition-all duration-200 ${
                              isActive
                                ? "border-primary bg-primary/8 shadow-sm shadow-primary/20"
                                : "border-border bg-card hover:border-primary/40 hover:bg-card"
                            }`}
                          >
                            {isActive && (
                              <span className="absolute top-2 right-2 h-4 w-4 rounded-full bg-primary grid place-items-center">
                                <Check className="h-2.5 w-2.5 text-primary-foreground" />
                              </span>
                            )}
                            <div className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${r.gradient}`}>
                              <r.icon className={`h-5 w-5 ${isActive ? "text-primary" : r.iconColor}`} />
                            </div>
                            <div className="text-center">
                              <p className={`text-xs font-semibold ${isActive ? "text-primary" : "text-foreground"}`}>
                                {r.title}
                              </p>
                              <p className="text-[10px] text-muted-foreground leading-tight mt-0.5 hidden sm:block">
                                {r.desc}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-sm font-medium text-foreground">
                      Full Name
                    </Label>
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
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email Address
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

              {/* ── STEP 2 ── */}
              {step === 2 && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="dob" className="text-sm font-medium text-foreground">
                      Date of Birth
                    </Label>
                    <Input
                      id="dob"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="h-12 rounded-xl border-border/60 bg-card focus:border-primary transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="phone"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="h-12 pl-10 rounded-xl border-border/60 bg-card focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="address" className="text-sm font-medium text-foreground">
                      Address{" "}
                      <span className="text-muted-foreground font-normal">(optional)</span>
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Textarea
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="123 Main St, City, Country"
                        rows={3}
                        className="pl-10 rounded-xl border-border/60 bg-card focus:border-primary transition-colors resize-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* ── STEP 3 ── */}
              {step === 3 && (
                <>
                  {/* Photo upload */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-foreground">
                      <Camera className="mr-1.5 inline h-3.5 w-3.5" />
                      Profile Photo
                    </Label>
                    <div className="flex items-center gap-5 p-4 rounded-xl border border-border/60 bg-card">
                      <Avatar className="h-20 w-20 border-2 border-dashed border-primary/40">
                        <AvatarImage src={profilePhoto} />
                        <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                          {name.charAt(0).toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Input
                          id="photo"
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById("photo")?.click()}
                          className="rounded-lg border-border hover:border-primary hover:text-primary"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload photo
                        </Button>
                        <p className="mt-2 text-xs text-muted-foreground">
                          JPG or PNG, max 2MB
                        </p>
                      </div>
                    </div>
                  </div>

                  {role === "student" && (
                    <div className="space-y-1.5">
                      <Label htmlFor="enrollment" className="text-sm font-medium text-foreground">
                        Enrollment Number
                      </Label>
                      <Input
                        id="enrollment"
                        value={enrollmentNumber}
                        onChange={(e) => setEnrollmentNumber(e.target.value)}
                        placeholder="ENR123456"
                        className="h-12 rounded-xl border-border/60 bg-card focus:border-primary transition-colors"
                      />
                    </div>
                  )}

                  {role === "teacher" && (
                    <div className="space-y-1.5">
                      <Label htmlFor="department" className="text-sm font-medium text-foreground">
                        Department
                      </Label>
                      <Input
                        id="department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="e.g. Computer Science"
                        className="h-12 rounded-xl border-border/60 bg-card focus:border-primary transition-colors"
                      />
                    </div>
                  )}

                  {role === "admin" && (
                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex gap-3">
                      <Briefcase className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground/80">
                        As an <strong>admin</strong>, you'll have full control over all courses, users, analytics, and platform settings.
                      </p>
                    </div>
                  )}
                </>
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
                onClick={handleSignup}
                className="flex-1 h-12 rounded-xl bg-gradient-hero text-primary-foreground font-semibold shadow-md hover:opacity-90 transition-opacity"
              >
                Create Account
                <ArrowRight className="ml-2 h-4 w-4" />
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
