import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen, GraduationCap, Award, Users } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
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
      <section className="py-20 lg:py-32 bg-secondary/30">
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
    </div>
  );
};

export default Home;
