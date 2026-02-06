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
  Phone,
  MapPin,
  Camera,
} from "lucide-react";
import { toast } from "sonner";

type SignupStep = 1 | 2 | 3;

const steps = [
  { num: 1, label: "Basics" },
  { num: 2, label: "Details" },
  { num: 3, label: "Profile" },
];

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<SignupStep>(1);
  const [role, setRole] = useState<UserRole>("student");

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
    if (!name || !email || !password) {
      toast.error("Please fill all fields");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    const existingUsers = storage.getAllUsers();
    if (existingUsers.some((u) => u.email === email)) {
      toast.error("Email already registered");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!dateOfBirth || !phoneNumber) {
      toast.error("Please fill all required fields");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSignup = () => {
    if (role === "student" && !enrollmentNumber) {
      toast.error("Please enter enrollment number");
      return;
    }
    if (role === "teacher" && !department) {
      toast.error("Please enter department");
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
    toast.success("Account created successfully!");

    if (role === "student") {
      navigate("/student-dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  const roleCards = [
    {
      value: "student" as UserRole,
      icon: GraduationCap,
      title: "Student",
      desc: "Access courses & take tests",
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      value: "teacher" as UserRole,
      icon: BookOpen,
      title: "Teacher",
      desc: "Create & manage courses",
      color: "from-emerald-500/20 to-teal-500/20",
    },
    {
      value: "admin" as UserRole,
      icon: Briefcase,
      title: "Admin",
      desc: "Full platform control",
      color: "from-violet-500/20 to-purple-500/20",
    },
  ];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: direction > 0 ? -60 : 60,
      opacity: 0,
    }),
  };

  const [direction, setDirection] = useState(1);

  const goNext = () => {
    setDirection(1);
    handleNextStep();
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => (s - 1) as SignupStep);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-5">
      {/* Left branding panel — takes 2/5 on large screens */}
      <div className="relative hidden lg:flex lg:col-span-2 flex-col justify-between overflow-hidden bg-gradient-hero p-10 text-primary-foreground">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-20 left-10 h-52 w-52 rounded-full bg-white/10 blur-2xl" />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 flex items-center gap-3"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/20 backdrop-blur-sm">
            <Brain className="h-5 w-5" />
          </span>
          <span className="text-xl font-display font-semibold">EduAI</span>
        </motion.div>

        {/* Center content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 space-y-4"
        >
          <h1 className="text-3xl font-display font-bold leading-tight xl:text-4xl">
            Join thousands of learners & educators
          </h1>
          <p className="text-white/75">
            Create your account in under 2 minutes and get started with
            AI-powered education.
          </p>
        </motion.div>

        {/* Progress indicator on left */}
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
              <div key={s.num} className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all ${
                    isDone
                      ? "bg-white text-primary"
                      : isCurrent
                        ? "bg-white/30 text-white ring-2 ring-white/60"
                        : "bg-white/10 text-white/50"
                  }`}
                >
                  {isDone ? <Check className="h-4 w-4" /> : s.num}
                </div>
                <span
                  className={`text-sm ${isCurrent ? "text-white font-medium" : isDone ? "text-white/90" : "text-white/40"}`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Right form panel — 3/5 */}
      <div className="relative flex flex-col items-center justify-center px-4 py-10 sm:px-8 lg:col-span-3">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>

        {/* Mobile logo + progress */}
        <div className="mb-6 w-full max-w-lg lg:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-hero text-primary-foreground">
                <Brain className="h-4.5 w-4.5" />
              </span>
              <span className="text-lg font-display font-semibold text-foreground">
                EduAI
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              Step {step} of 3
            </span>
          </div>

          {/* Mobile progress bar */}
          <div className="mt-4 flex gap-2">
            {steps.map((s) => (
              <div
                key={s.num}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  step >= s.num ? "bg-gradient-hero" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="w-full max-w-lg">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 space-y-1"
          >
            <h2 className="text-2xl font-display font-bold text-foreground sm:text-3xl">
              {step === 1
                ? "Create your account"
                : step === 2
                  ? "Personal details"
                  : "Complete your profile"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {step === 1
                ? "Choose your role and fill in your basic information"
                : step === 2
                  ? "Help us personalize your experience"
                  : "Add a photo and role-specific details"}
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
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              {step === 1 && (
                <>
                  {/* Role selector */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">I am a</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {roleCards.map((r) => {
                        const isActive = role === r.value;
                        return (
                          <button
                            key={r.value}
                            type="button"
                            onClick={() => setRole(r.value)}
                            className={`relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                              isActive
                                ? "border-primary bg-primary/5 shadow-sm"
                                : "border-border hover:border-primary/40 hover:bg-muted/50"
                            }`}
                          >
                            <div
                              className={`grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br ${r.color}`}
                            >
                              <r.icon
                                className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                              />
                            </div>
                            <span
                              className={`text-xs font-medium ${isActive ? "text-primary" : "text-foreground"}`}
                            >
                              {r.title}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      <User className="mr-1.5 inline h-3.5 w-3.5" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="h-11"
                    />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="dob" className="text-sm font-medium">
                      Date of Birth
                    </Label>
                    <Input
                      id="dob"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      <Phone className="mr-1.5 inline h-3.5 w-3.5" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium">
                      <MapPin className="mr-1.5 inline h-3.5 w-3.5" />
                      Address{" "}
                      <span className="text-muted-foreground">(optional)</span>
                    </Label>
                    <Textarea
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 Main St, City, Country"
                      rows={3}
                    />
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  {/* Photo upload */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      <Camera className="mr-1.5 inline h-3.5 w-3.5" />
                      Profile Photo
                    </Label>
                    <div className="flex items-center gap-5">
                      <Avatar className="h-20 w-20 border-2 border-dashed border-border">
                        <AvatarImage src={profilePhoto} />
                        <AvatarFallback className="bg-muted text-muted-foreground text-xl">
                          {name.charAt(0).toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
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
                          onClick={() =>
                            document.getElementById("photo")?.click()
                          }
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload
                        </Button>
                        <p className="mt-1.5 text-xs text-muted-foreground">
                          JPG or PNG, max 2MB
                        </p>
                      </div>
                    </div>
                  </div>

                  {role === "student" && (
                    <div className="space-y-2">
                      <Label
                        htmlFor="enrollment"
                        className="text-sm font-medium"
                      >
                        Enrollment Number
                      </Label>
                      <Input
                        id="enrollment"
                        value={enrollmentNumber}
                        onChange={(e) => setEnrollmentNumber(e.target.value)}
                        placeholder="ENR123456"
                        className="h-11"
                      />
                    </div>
                  )}

                  {role === "teacher" && (
                    <div className="space-y-2">
                      <Label
                        htmlFor="department"
                        className="text-sm font-medium"
                      >
                        Department
                      </Label>
                      <Input
                        id="department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="Computer Science"
                        className="h-11"
                      />
                    </div>
                  )}

                  {role === "admin" && (
                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                      <p className="text-sm text-muted-foreground">
                        As an admin, you'll have full access to all courses,
                        users, and analytics.
                      </p>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Actions */}
          <div className="mt-8 flex gap-3">
            {step > 1 && (
              <Button variant="outline" onClick={goBack} className="flex-1">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button
                onClick={goNext}
                className="flex-1 bg-gradient-hero glow-primary"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSignup}
                className="flex-1 bg-gradient-hero glow-primary"
              >
                Create Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>

          {step === 1 && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button
                variant="link"
                className="h-auto p-0 text-primary"
                onClick={() => navigate("/login")}
              >
                Sign in
              </Button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
