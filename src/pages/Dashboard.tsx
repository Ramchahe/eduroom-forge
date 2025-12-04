import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { storage } from "@/lib/storage";
import { User, Course } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    
    // Only redirect from /dashboard, not from /courses
    if (location.pathname === "/dashboard") {
      if (currentUser.role === "student") {
        navigate("/student-dashboard");
        return;
      }
      if (currentUser.role === "admin") {
        navigate("/admin-dashboard");
        return;
      }
      if (currentUser.role === "teacher") {
        navigate("/teacher-dashboard");
        return;
      }
    }
    
    // For /courses page, load courses for all roles
    if (location.pathname === "/courses") {
      setUser(currentUser);
      loadCourses(currentUser);
      return;
    }
    
    setUser(currentUser);
    loadCourses(currentUser);
  }, [navigate, location.pathname]);

  const loadCourses = (currentUser: User) => {
    const allCourses = storage.getCourses();
    if (currentUser.role === "admin") {
      setCourses(allCourses);
    } else if (currentUser.role === "student") {
      // Students see only enrolled courses
      setCourses(allCourses.filter(c => c.enrolledStudents.includes(currentUser.id)));
    } else {
      // Teachers see courses they created
      setCourses(allCourses.filter(c => c.createdBy === currentUser.id));
    }
  };

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar user={user} />
        <div className="flex-1 flex flex-col">
          <header className="border-b bg-card shadow-sm sticky top-0 z-10">
            <div className="container mx-auto px-4 py-4 flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-bold">Dashboard</h1>
            </div>
          </header>

          <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {user.role === "student" ? "My Enrolled Courses" : "My Courses"}
            </h2>
            <p className="text-muted-foreground mt-1">
              {user.role === "student" ? "View your enrolled courses" : "Manage your courses and quizzes"}
            </p>
          </div>
          {user.role !== "student" && (
            <Button onClick={() => navigate("/create-course")} size="lg">
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Course
            </Button>
          )}
        </div>

        {courses.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {user.role === "student" ? "No enrolled courses" : "No courses yet"}
              </h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                {user.role === "student" 
                  ? "You are not enrolled in any courses yet. Please contact your teacher or admin to get enrolled."
                  : "Get started by creating your first course. You can add quizzes and questions to help students learn."
                }
              </p>
              {user.role !== "student" && (
                <Button onClick={() => navigate("/create-course")}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Your First Course
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Card 
                key={course.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  // Students go to student course view, others go to admin/teacher view
                  if (user.role === 'student') {
                    navigate(`/student-course-view/${course.id}`);
                  } else {
                    navigate(`/course/${course.id}`);
                  }
                }}
              >
                <CardHeader>
                  <div className="rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 h-32 mb-4 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-primary" />
                  </div>
                  <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {course.quizzes.length} {course.quizzes.length === 1 ? 'Quiz' : 'Quizzes'}
                    </span>
                    <span className="text-muted-foreground">
                      {course.enrolledStudents.length} Students
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
