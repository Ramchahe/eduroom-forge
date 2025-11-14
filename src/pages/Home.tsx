import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, GraduationCap, Award, Users, CheckCircle2, Menu } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Course Platform - Transform Learning with Interactive Courses & Tests';
    const desc = 'Create engaging courses, build quizzes, and track student progress. Powerful platform for educators and learners with role-based access and analytics.';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', desc);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.origin);

    // JSON-LD structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Course Platform",
      "description": desc,
      "url": window.location.origin,
      "offers": {
        "@type": "Offer",
        "category": "Educational Platform"
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

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Course Platform</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm hover:text-primary transition-colors">Features</a>
            <a href="#testimonials" className="text-sm hover:text-primary transition-colors">Testimonials</a>
            <a href="#pricing" className="text-sm hover:text-primary transition-colors">Pricing</a>
            <a href="#faq" className="text-sm hover:text-primary transition-colors">FAQ</a>
            <Button variant="outline" size="sm" onClick={() => navigate('/login')}>Sign In</Button>
            <Button size="sm" onClick={() => navigate('/login')}>Get Started</Button>
          </div>
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02ek0yNCAzOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        
        <div className="container relative mx-auto px-4 py-20 lg:py-32">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Transform Learning with Interactive Courses & Tests
              </h1>
              <p className="text-lg text-primary-foreground/90 sm:text-xl">
                Create engaging courses, build comprehensive quizzes, and track student progress all in one powerful platform.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => navigate('/login')}
                  className="text-base"
                >
                  Get Started
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="rounded-2xl bg-card/10 backdrop-blur-sm p-8 shadow-2xl border border-primary-foreground/20">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-primary-foreground/10 p-6 text-center backdrop-blur">
                    <Users className="mx-auto h-8 w-8 mb-2" />
                    <div className="text-2xl font-bold">1000+</div>
                    <div className="text-sm opacity-90">Active Students</div>
                  </div>
                  <div className="rounded-lg bg-primary-foreground/10 p-6 text-center backdrop-blur">
                    <BookOpen className="mx-auto h-8 w-8 mb-2" />
                    <div className="text-2xl font-bold">500+</div>
                    <div className="text-sm opacity-90">Courses</div>
                  </div>
                  <div className="rounded-lg bg-primary-foreground/10 p-6 text-center backdrop-blur">
                    <GraduationCap className="mx-auto h-8 w-8 mb-2" />
                    <div className="text-2xl font-bold">50+</div>
                    <div className="text-sm opacity-90">Expert Teachers</div>
                  </div>
                  <div className="rounded-lg bg-primary-foreground/10 p-6 text-center backdrop-blur">
                    <Award className="mx-auto h-8 w-8 mb-2" />
                    <div className="text-2xl font-bold">5000+</div>
                    <div className="text-sm opacity-90">Tests Conducted</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Everything You Need for Online Education
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A comprehensive platform designed for educators and learners
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl bg-card p-8 shadow-md hover:shadow-lg transition-shadow border">
              <div className="rounded-lg bg-accent/10 w-12 h-12 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Course Creation</h3>
              <p className="text-muted-foreground">
                Build comprehensive courses with rich content and interactive materials
              </p>
            </div>

            <div className="rounded-xl bg-card p-8 shadow-md hover:shadow-lg transition-shadow border">
              <div className="rounded-lg bg-accent/10 w-12 h-12 flex items-center justify-center mb-4">
                <GraduationCap className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quiz Builder</h3>
              <p className="text-muted-foreground">
                Create various types of questions including MCQs, numerical, and subjective
              </p>
            </div>

            <div className="rounded-xl bg-card p-8 shadow-md hover:shadow-lg transition-shadow border">
              <div className="rounded-lg bg-accent/10 w-12 h-12 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Online Testing</h3>
              <p className="text-muted-foreground">
                Conduct tests with real-time tracking and comprehensive result analysis
              </p>
            </div>

            <div className="rounded-xl bg-card p-8 shadow-md hover:shadow-lg transition-shadow border">
              <div className="rounded-lg bg-accent/10 w-12 h-12 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Role-Based Access</h3>
              <p className="text-muted-foreground">
                Separate portals for admins, teachers, and students with appropriate permissions
              </p>
            </div>

            <div className="rounded-xl bg-card p-8 shadow-md hover:shadow-lg transition-shadow border">
              <div className="rounded-lg bg-accent/10 w-12 h-12 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rich Text Editor</h3>
              <p className="text-muted-foreground">
                Advanced editor with support for images, formatting, and mathematical expressions
              </p>
            </div>

            <div className="rounded-xl bg-card p-8 shadow-md hover:shadow-lg transition-shadow border">
              <div className="rounded-lg bg-accent/10 w-12 h-12 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
              <p className="text-muted-foreground">
                Monitor student performance with detailed analytics and insights
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Trusted by educators and students worldwide
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl bg-card p-8 shadow-md border">
              <div className="flex items-center gap-1 mb-4 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Award key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "This platform revolutionized how I create and manage my courses. The quiz builder is incredibly intuitive and saves me hours every week."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Dr. Sarah Johnson</div>
                  <div className="text-sm text-muted-foreground">Professor, Computer Science</div>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-card p-8 shadow-md border">
              <div className="flex items-center gap-1 mb-4 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Award key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "The analytics dashboard gives me deep insights into student performance. I can identify struggling students early and provide targeted help."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Michael Chen</div>
                  <div className="text-sm text-muted-foreground">Math Teacher</div>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-card p-8 shadow-md border">
              <div className="flex items-center gap-1 mb-4 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Award key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "As a student, I love how organized everything is. The multilingual support and real-time test feedback help me learn more effectively."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Priya Sharma</div>
                  <div className="text-sm text-muted-foreground">Engineering Student</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 lg:py-32 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that works best for you
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            <div className="rounded-xl bg-card p-8 shadow-md border">
              <div className="mb-4">
                <h3 className="text-2xl font-bold mb-2">Student</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">Free</span>
                </div>
              </div>
              <p className="text-muted-foreground mb-6">Perfect for learners</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Enroll in unlimited courses</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Take quizzes and tests</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Track your progress</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>View detailed results</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline" onClick={() => navigate('/login')}>
                Start Learning
              </Button>
            </div>

            <div className="rounded-xl bg-card p-8 shadow-md border-2 border-primary relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <div className="mb-4">
                <h3 className="text-2xl font-bold mb-2">Teacher</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">₹999</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </div>
              <p className="text-muted-foreground mb-6">For educators</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Create unlimited courses</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Advanced quiz builder</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Question bank access</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Student analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Multi-language support</span>
                </li>
              </ul>
              <Button className="w-full" onClick={() => navigate('/login')}>
                Start Teaching
              </Button>
            </div>

            <div className="rounded-xl bg-card p-8 shadow-md border">
              <div className="mb-4">
                <h3 className="text-2xl font-bold mb-2">Institution</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">Custom</span>
                </div>
              </div>
              <p className="text-muted-foreground mb-6">For organizations</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Everything in Teacher</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>User management</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Salary management</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Custom branding</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline" onClick={() => navigate('/login')}>
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions about our platform
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I create my first course?</AccordionTrigger>
              <AccordionContent>
                After signing up as a teacher or admin, navigate to "Create Course" from your dashboard. Fill in the course details, add a thumbnail, and start building your curriculum with quizzes and materials.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can I create different types of questions?</AccordionTrigger>
              <AccordionContent>
                Yes! Our quiz builder supports single-correct MCQs, multi-correct MCQs, numerical questions, and subjective questions. You can also add images and format text using our rich text editor.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is multilingual support available?</AccordionTrigger>
              <AccordionContent>
                Absolutely! You can create questions in multiple languages (currently English and Hindi). Students can switch between languages during tests for better comprehension.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>How does the analytics dashboard work?</AccordionTrigger>
              <AccordionContent>
                Teachers and admins get detailed insights including student performance, question-wise analysis, completion rates, and score distributions. You can track individual student progress and identify areas needing attention.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Can I reuse questions across multiple quizzes?</AccordionTrigger>
              <AccordionContent>
                Yes! The Question Bank feature lets you save questions for reuse. Simply add questions to your bank and import them into any quiz, saving time and ensuring consistency.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl bg-gradient-to-r from-accent to-accent/80 p-12 text-center text-accent-foreground shadow-xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of educators and students already using our platform to create and experience better learning.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/login')}
              className="text-base"
            >
              Start Your Journey Today
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary/30 border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">Course Platform</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering education through technology. Create, learn, and grow together.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Testimonials</a></li>
                <li><a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Course Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
