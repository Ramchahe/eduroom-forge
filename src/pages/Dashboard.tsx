import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { storage } from "@/lib/storage";
import { User, Course } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/DashboardLayout";

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
      setCourses(allCourses.filter(c => c.enrolledStudents.includes(currentUser.id)));
    } else {
      setCourses(allCourses.filter(c => c.createdBy === currentUser.id));
    }
  };

  if (!user) return null;

  return (
    <DashboardLayout user={user} title={user.role === "student" ? "My Courses" : "Courses"}>
      <main className="flex-1 px-4 py-6 md:container md:mx-auto md:py-8">
        <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              {user.role === "student" ? "My Enrolled Courses" : "My Courses"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {user.role === "student" ? "View your enrolled courses" : "Manage your courses and quizzes"}
            </p>
          </div>
          {user.role !== "student" && (
            <Button onClick={() => navigate("/create-course")} size="sm" className="md:size-lg self-start">
              <PlusCircle className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              Create Course
            </Button>
          )}
        </div>

        {courses.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 md:py-16">
              <BookOpen className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg md:text-xl font-semibold mb-2">
                {user.role === "student" ? "No enrolled courses" : "No courses yet"}
              </h3>
              <p className="text-sm text-muted-foreground text-center mb-6 max-w-md">
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
          <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Card
                key={course.id}
                className="hover:shadow-lg transition-shadow cursor-pointer active:scale-[0.98]"
                onClick={() => {
                  if (user.role === 'student') {
                    navigate(`/student-course-view/${course.id}`);
                  } else {
                    navigate(`/course/${course.id}`);
                  }
                }}
              >
                <CardHeader className="p-4 md:p-6">
                  <div className="rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 h-24 md:h-32 mb-3 md:mb-4 flex items-center justify-center">
                    <BookOpen className="h-8 w-8 md:h-12 md:w-12 text-primary" />
                  </div>
                  <CardTitle className="line-clamp-1 text-base md:text-lg">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2 text-xs md:text-sm">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
                  <div className="flex items-center justify-between text-xs md:text-sm">
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
    </DashboardLayout>
  );
};

export default Dashboard;
