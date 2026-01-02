import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { storage } from "@/lib/storage";
import { UserRole } from "@/types";
import { toast } from "sonner";
import { 
  GraduationCap, 
  BookOpen, 
  Shield, 
  Sparkles,
  Rocket,
  Star,
  Zap,
  Crown,
  ArrowRight,
  User,
  Mail
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Floating particles for student mode
const StudentParticles = () => {
  const particles = useMemo(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 4,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
      emoji: ['🎓', '📚', '✨', '🚀', '⭐', '🎯', '💡', '🔥'][Math.floor(Math.random() * 8)]
    })), []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute text-2xl"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {p.emoji}
        </motion.div>
      ))}
    </div>
  );
};

// Elegant flowing lines for teacher/admin
const PremiumLines = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.path
          key={i}
          d={`M-10,${20 + i * 15} Q50,${30 + i * 10} 110,${15 + i * 18}`}
          fill="none"
          stroke="url(#premiumGradient)"
          strokeWidth="0.15"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.4 }}
          transition={{ duration: 2, delay: i * 0.3, ease: "easeOut" }}
        />
      ))}
      <defs>
        <linearGradient id="premiumGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

// Role card component
const RoleCard = ({ 
  role, 
  selected, 
  onClick, 
  icon: Icon, 
  title, 
  description, 
  theme 
}: { 
  role: UserRole;
  selected: boolean;
  onClick: () => void;
  icon: React.ElementType;
  title: string;
  description: string;
  theme: 'fun' | 'premium';
}) => {
  const funStyles = selected 
    ? "bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 border-cyan-400/50 shadow-lg shadow-cyan-500/20" 
    : "bg-background/40 border-border/40 hover:border-cyan-400/30 hover:bg-cyan-500/5";
  
  const premiumStyles = selected 
    ? "bg-gradient-to-br from-amber-500/10 via-primary/10 to-amber-500/10 border-amber-400/40 shadow-lg shadow-amber-500/10" 
    : "bg-background/40 border-border/40 hover:border-amber-400/30 hover:bg-amber-500/5";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`relative w-full p-4 rounded-xl border-2 text-left transition-all duration-300 ${
        theme === 'fun' ? funStyles : premiumStyles
      }`}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      <div className="flex items-start gap-3">
        <motion.div 
          className={`p-2.5 rounded-lg ${
            selected 
              ? theme === 'fun' 
                ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white' 
                : 'bg-gradient-to-br from-amber-500 to-amber-600 text-white'
              : 'bg-muted text-muted-foreground'
          }`}
          animate={selected ? { rotate: [0, -10, 10, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          <Icon className="w-5 h-5" />
        </motion.div>
        <div className="flex-1">
          <div className="font-semibold text-foreground flex items-center gap-2">
            {title}
            {selected && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-xs"
              >
                {theme === 'fun' ? '🎉' : '✨'}
              </motion.span>
            )}
          </div>
          <div className="text-sm text-muted-foreground mt-0.5">{description}</div>
        </div>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
          selected 
            ? theme === 'fun'
              ? 'border-cyan-400 bg-cyan-500'
              : 'border-amber-400 bg-amber-500'
            : 'border-muted-foreground/30'
        }`}>
          {selected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-2 h-2 bg-white rounded-full"
            />
          )}
        </div>
      </div>
    </motion.button>
  );
};

const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();

  const isPremium = role === 'teacher' || role === 'admin';

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
      const user = {
        id: Date.now().toString(),
        name,
        email,
        role,
      };

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

  const roleConfig = {
    student: {
      icon: GraduationCap,
      title: "Student",
      description: "Learn, explore & achieve your goals",
      theme: 'fun' as const,
    },
    teacher: {
      icon: BookOpen,
      title: "Teacher",
      description: "Create courses & inspire minds",
      theme: 'premium' as const,
    },
    admin: {
      icon: Shield,
      title: "Administrator",
      description: "Full platform control & oversight",
      theme: 'premium' as const,
    },
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-700 ${
      isPremium 
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' 
        : 'bg-gradient-to-br from-slate-900 via-cyan-950/30 to-slate-900'
    }`}>
      {/* Dynamic background based on role */}
      <AnimatePresence mode="wait">
        {!isPremium ? (
          <motion.div
            key="student-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <StudentParticles />
            {/* Colorful gradient orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          </motion.div>
        ) : (
          <motion.div
            key="premium-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <PremiumLines />
            {/* Subtle golden orbs */}
            <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Main card */}
      <motion.div
        className={`relative w-full max-w-md backdrop-blur-xl rounded-2xl border p-8 shadow-2xl transition-all duration-500 ${
          isPremium 
            ? 'bg-slate-900/60 border-amber-500/20 shadow-amber-500/5' 
            : 'bg-slate-900/60 border-cyan-500/20 shadow-cyan-500/10'
        }`}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div 
            className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
              isPremium 
                ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30' 
                : 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30'
            }`}
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            {isPremium ? (
              <Crown className={`w-8 h-8 text-amber-400`} />
            ) : (
              <Rocket className={`w-8 h-8 text-cyan-400`} />
            )}
          </motion.div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className={`text-2xl font-bold mb-2 ${
                isPremium 
                  ? 'bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 bg-clip-text text-transparent' 
                  : 'bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent'
              }`}>
                {isPremium ? 'Welcome Back' : "Let's Go! 🚀"}
              </h1>
              <p className="text-muted-foreground text-sm">
                {isPremium 
                  ? 'Sign in to access your professional dashboard' 
                  : 'Ready to learn something awesome today?'}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Name field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-foreground/80">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="name"
                placeholder={isPremium ? "Enter your full name" : "What's your name? ✍️"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`pl-10 h-12 bg-background/50 border-border/50 transition-all duration-300 ${
                  isPremium 
                    ? 'focus:border-amber-500/50 focus:ring-amber-500/20' 
                    : 'focus:border-cyan-500/50 focus:ring-cyan-500/20'
                }`}
                required
              />
            </div>
          </div>
          
          {/* Email field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground/80">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder={isPremium ? "your.email@institution.edu" : "your.email@example.com 📧"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`pl-10 h-12 bg-background/50 border-border/50 transition-all duration-300 ${
                  isPremium 
                    ? 'focus:border-amber-500/50 focus:ring-amber-500/20' 
                    : 'focus:border-cyan-500/50 focus:ring-cyan-500/20'
                }`}
                required
              />
            </div>
          </div>

          {/* Role selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground/80">
              I am a...
            </Label>
            <div className="space-y-2">
              {(Object.keys(roleConfig) as UserRole[]).map((r) => (
                <RoleCard
                  key={r}
                  role={r}
                  selected={role === r}
                  onClick={() => setRole(r)}
                  icon={roleConfig[r].icon}
                  title={roleConfig[r].title}
                  description={roleConfig[r].description}
                  theme={roleConfig[r].theme}
                />
              ))}
            </div>
          </div>

          {/* Submit button */}
          <motion.div
            onHoverStart={() => setIsHovering(true)}
            onHoverEnd={() => setIsHovering(false)}
          >
            <Button 
              type="submit" 
              className={`w-full h-12 text-base font-semibold relative overflow-hidden group ${
                isPremium 
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900' 
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white'
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isPremium ? 'Access Dashboard' : "Let's Start Learning"}
                <motion.span
                  animate={isHovering ? { x: [0, 5, 0] } : {}}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </span>
              
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                animate={isHovering ? { translateX: '200%' } : {}}
                transition={{ duration: 0.6 }}
              />
            </Button>
          </motion.div>

          {/* Footer links */}
          <div className="pt-4 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className={`font-medium transition-colors ${
                  isPremium 
                    ? 'text-amber-400 hover:text-amber-300' 
                    : 'text-cyan-400 hover:text-cyan-300'
                }`}
              >
                Sign up {isPremium ? '' : '🎯'}
              </Link>
            </p>
            <Link 
              to="/" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              ← Back to home
            </Link>
          </div>
        </form>

        {/* Decorative corner elements */}
        <div className={`absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 rounded-tr-2xl ${
          isPremium ? 'border-amber-500/20' : 'border-cyan-500/20'
        }`} />
        <div className={`absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 rounded-bl-2xl ${
          isPremium ? 'border-amber-500/20' : 'border-cyan-500/20'
        }`} />
      </motion.div>
    </div>
  );
};

export default Login;
