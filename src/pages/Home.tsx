import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { 
  BookOpen, GraduationCap, Award, Users, CheckCircle2, Menu, X,
  Brain, Sparkles, Video, MessageCircle, BarChart3, Shield, 
  Zap, Globe, Clock, ArrowRight, Play, Star, Send, Mail, Phone, MapPin
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";

// Import generated images
import heroDashboard from "@/assets/hero-dashboard.png";
import aiShapes from "@/assets/ai-shapes.png";
import virtualClassroom from "@/assets/virtual-classroom.png";
import aiBrain from "@/assets/ai-brain.png";

const Home = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  
  const heroInView = useInView(heroRef, { once: true });
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });

  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.3]);

  useEffect(() => {
    document.title = 'EduAI - AI-Powered Online Teaching Management Platform';
    const desc = 'Transform education with AI-powered course creation, live streaming, smart assessments, and real-time analytics. The future of online teaching is here.';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', desc);

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "EduAI",
      "description": desc,
      "url": window.location.origin,
      "offers": {
        "@type": "Offer",
        "category": "AI Educational Platform"
      }
    };
    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you! We'll get back to you soon.");
    setContactForm({ name: '', email: '', phone: '', message: '' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const } }
  };

  const features = [
    { icon: Brain, title: "AI-Powered Learning", desc: "Smart algorithms personalize learning paths for each student", color: "primary" },
    { icon: Video, title: "Live Streaming", desc: "HD live classes with real-time interaction and chat", color: "accent" },
    { icon: BarChart3, title: "Smart Analytics", desc: "Deep insights into student performance and engagement", color: "primary" },
    { icon: MessageCircle, title: "Community Hub", desc: "Collaborative spaces for discussions and peer learning", color: "accent" },
    { icon: Shield, title: "Secure Platform", desc: "Enterprise-grade security for your educational data", color: "primary" },
    { icon: Zap, title: "Instant Feedback", desc: "AI-graded assessments with immediate results", color: "accent" },
  ];

  const stats = [
    { value: "50K+", label: "Active Students", icon: Users },
    { value: "1000+", label: "Expert Teachers", icon: GraduationCap },
    { value: "5000+", label: "Courses Created", icon: BookOpen },
    { value: "99.9%", label: "Uptime", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      {/* Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 glass-strong"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
                <Brain className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="absolute -inset-1 bg-gradient-hero rounded-xl blur opacity-40 -z-10" />
            </div>
            <span className="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">EduAI</span>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Solutions', 'Pricing', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-hero group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className="text-muted-foreground hover:text-foreground">
              Sign In
            </Button>
            <Button 
              size="sm" 
              onClick={() => navigate('/login')}
              className="bg-gradient-hero hover:opacity-90 transition-opacity glow-primary"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-border"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {['Features', 'Solutions', 'Pricing', 'Contact'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`} 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <Button onClick={() => navigate('/login')} className="bg-gradient-hero w-full">
                Get Started
              </Button>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-20">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <motion.div 
              style={{ y, opacity }}
              className="space-y-8 relative z-10"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm text-primary font-medium">Powered by Advanced AI</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-tight"
              >
                The Future of{' '}
                <span className="text-gradient">Online Teaching</span>{' '}
                is Here
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
                className="text-lg sm:text-xl text-muted-foreground max-w-xl"
              >
                Transform education with AI-powered course creation, live streaming classes, 
                intelligent assessments, and real-time analytics. One platform, unlimited possibilities.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                <Button 
                  size="lg" 
                  onClick={() => navigate('/login')}
                  className="bg-gradient-hero hover:opacity-90 transition-all glow-primary text-base group"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-border/50 hover:bg-secondary/50 text-base group"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Watch Demo
                </Button>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={heroInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.7 }}
                className="flex items-center gap-6 pt-4"
              >
                <div className="flex -space-x-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-hero border-2 border-background flex items-center justify-center text-xs font-bold text-primary-foreground">
                      {['A', 'B', 'C', 'D'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-warning">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">Trusted by 50,000+ educators</p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative"
            >
              <div className="relative z-10">
                <motion.img 
                  src={heroDashboard} 
                  alt="AI-Powered Education Dashboard" 
                  className="rounded-2xl shadow-2xl border border-border/50"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                
                {/* Floating Elements */}
                <motion.div 
                  className="absolute -top-6 -right-6 glass rounded-xl p-4 shadow-lg"
                  animate={{ y: [0, -15, 0], rotate: [0, 2, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Performance</p>
                      <p className="text-lg font-bold text-success">+45%</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="absolute -bottom-6 -left-6 glass rounded-xl p-4 shadow-lg"
                  animate={{ y: [0, -10, 0], rotate: [0, -2, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Live Students</p>
                      <p className="text-lg font-bold">1,234</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-hero rounded-2xl blur-3xl opacity-20 -z-10 scale-110" />
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-primary rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 relative">
        <div className="container mx-auto px-4">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                variants={itemVariants}
                className="glass rounded-2xl p-6 text-center hover:border-primary/50 transition-colors group"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-3xl lg:text-4xl font-display font-bold text-gradient">{stat.value}</h3>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full glass text-sm text-primary font-medium mb-4">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
              Everything You Need to{' '}
              <span className="text-gradient">Transform Education</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A comprehensive AI-powered platform designed to revolutionize how you teach and learn
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature, i) => (
              <motion.div 
                key={i}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="glass rounded-2xl p-8 hover:border-primary/50 transition-all group cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-xl ${feature.color === 'primary' ? 'bg-primary/10' : 'bg-accent/10'} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`h-7 w-7 ${feature.color === 'primary' ? 'text-primary' : 'text-accent'}`} />
                </div>
                <h3 className="text-xl font-display font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-2 rounded-full glass text-sm text-accent font-medium mb-4">
                Live Streaming
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-6">
                Teach Live with{' '}
                <span className="text-gradient">Crystal Clear</span> Quality
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Stream your classes in HD with real-time interaction. Students can chat, 
                ask questions, and participate from anywhere in the world.
              </p>
              <ul className="space-y-4">
                {['HD video streaming up to 4K', 'Real-time chat and reactions', 'Screen sharing and whiteboard', 'Automatic recording and replay'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <img 
                src={virtualClassroom} 
                alt="Virtual Classroom" 
                className="rounded-2xl shadow-2xl border border-border/50"
              />
              <div className="absolute inset-0 bg-gradient-accent rounded-2xl blur-3xl opacity-10 -z-10 scale-110" />
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mt-32">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative lg:order-2"
            >
              <span className="inline-block px-4 py-2 rounded-full glass text-sm text-primary font-medium mb-4">
                AI Analytics
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-6">
                Deep Insights with{' '}
                <span className="text-gradient">AI Analytics</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Understand every student's learning journey. Our AI analyzes performance 
                patterns and provides actionable insights to improve outcomes.
              </p>
              <ul className="space-y-4">
                {['Student performance tracking', 'Predictive analytics', 'Custom reports and dashboards', 'Automated progress alerts'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative lg:order-1"
            >
              <img 
                src={aiBrain} 
                alt="AI Analytics Brain" 
                className="rounded-2xl shadow-2xl border border-border/50 mx-auto max-w-md"
              />
              <div className="absolute inset-0 bg-gradient-hero rounded-2xl blur-3xl opacity-10 -z-10 scale-110" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full glass text-sm text-primary font-medium mb-4">
              Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
              Simple, <span className="text-gradient">Transparent</span> Pricing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start free and scale as you grow. No hidden fees.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {[
              { 
                name: 'Starter', 
                price: 'Free', 
                desc: 'Perfect for students',
                features: ['Access all courses', 'Take unlimited quizzes', 'View your results', 'Community access'],
                popular: false
              },
              { 
                name: 'Professional', 
                price: '₹999', 
                period: '/month',
                desc: 'For educators',
                features: ['Create unlimited courses', 'Advanced quiz builder', 'Live streaming', 'Analytics dashboard', 'Priority support'],
                popular: true
              },
              { 
                name: 'Enterprise', 
                price: 'Custom', 
                desc: 'For institutions',
                features: ['Everything in Pro', 'Custom branding', 'SSO integration', 'Dedicated support', 'SLA guarantee'],
                popular: false
              },
            ].map((plan, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass rounded-2xl p-8 relative ${plan.popular ? 'border-primary/50 ring-1 ring-primary/30' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-hero text-sm font-medium text-primary-foreground">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-2xl font-display font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                  </div>
                  <p className="text-muted-foreground mt-2">{plan.desc}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${plan.popular ? 'bg-gradient-hero hover:opacity-90' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => navigate('/login')}
                >
                  Get Started
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full glass text-sm text-accent font-medium mb-4">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
              Loved by <span className="text-gradient">Educators Worldwide</span>
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              { name: 'Dr. Sarah Johnson', role: 'Professor, Stanford', quote: 'EduAI has transformed how I teach. The AI-powered analytics help me understand each student\'s needs.' },
              { name: 'Michael Chen', role: 'EdTech Director', quote: 'The live streaming quality is incredible. Our engagement rates have increased by 200% since switching.' },
              { name: 'Priya Sharma', role: 'Online Educator', quote: 'The community features help my students collaborate like never before. It\'s a game-changer.' },
            ].map((testimonial, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-8"
              >
                <div className="flex gap-1 mb-4 text-warning">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 relative">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full glass text-sm text-primary font-medium mb-4">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
          </motion.div>

          <Accordion type="single" collapsible className="space-y-4">
            {[
              { q: 'How does the AI personalization work?', a: 'Our AI analyzes student behavior, quiz results, and learning patterns to create personalized learning paths. It adapts in real-time to each student\'s pace and style.' },
              { q: 'Can I stream live classes to multiple classes at once?', a: 'Yes! Teachers can broadcast to multiple classes simultaneously. Students from any selected class can join, participate in chat, and ask questions in real-time.' },
              { q: 'Is my data secure?', a: 'Absolutely. We use enterprise-grade encryption, comply with GDPR and other privacy regulations, and never share your data with third parties.' },
              { q: 'Can I try before I buy?', a: 'Yes! Our Starter plan is completely free and includes access to all basic features. You can upgrade anytime as your needs grow.' },
            ].map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="glass rounded-xl border-border/50 px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-2 rounded-full glass text-sm text-accent font-medium mb-4">
                Get in Touch
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
                Let's <span className="text-gradient">Connect</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold">hello@eduai.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-semibold">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-semibold">Bangalore, India</p>
                  </div>
                </div>
              </div>

              <img 
                src={aiShapes} 
                alt="AI Decorative" 
                className="mt-12 rounded-2xl max-w-xs opacity-80"
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-8"
            >
              <h3 className="text-2xl font-display font-bold mb-6">Send us a Message</h3>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Full Name</label>
                    <Input 
                      placeholder="John Doe" 
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="bg-secondary/50 border-border/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <Input 
                      type="email"
                      placeholder="john@example.com" 
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="bg-secondary/50 border-border/50"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Phone Number</label>
                  <Input 
                    placeholder="+91 98765 43210" 
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="bg-secondary/50 border-border/50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Message</label>
                  <Textarea 
                    placeholder="Tell us about your needs..." 
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="bg-secondary/50 border-border/50 min-h-[150px]"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-hero hover:opacity-90 transition-opacity"
                  size="lg"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-hero opacity-90" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02ek0yNCAzOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')]" />
            
            <div className="relative px-8 py-16 lg:py-24 text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-primary-foreground mb-6">
                Ready to Transform Your Teaching?
              </h2>
              <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                Join thousands of educators already using EduAI to create engaging learning experiences.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button 
                  size="lg"
                  variant="secondary"
                  onClick={() => navigate('/login')}
                  className="text-base"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-base"
                >
                  Contact Sales
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
                  <Brain className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-display font-bold">EduAI</span>
              </div>
              <p className="text-muted-foreground">
                The future of online education, powered by artificial intelligence.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#contact" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 pt-8 text-center text-muted-foreground text-sm">
            <p>&copy; {new Date().getFullYear()} EduAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
