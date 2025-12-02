import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "@/lib/storage";
import { User, SchoolClass } from "@/types";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Users, Calendar, TrendingUp, DollarSign, School, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [assignedClasses, setAssignedClasses] = useState<SchoolClass[]>([]);
  const [stats, setStats] = useState({
    myCourses: 0,
    myQuizzes: 0,
    totalStudents: 0,
    myAssignments: 0,
    pendingGrading: 0,
    upcomingEvents: 0,
    mySalary: 0,
    myClassesCount: 0,
  });

  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    if (currentUser.role !== "teacher") {
      navigate("/dashboard");
      return;
    }
    setUser(currentUser);
    loadStats(currentUser);
  }, [navigate]);

  const loadStats = (currentUser: User) => {
    const courses = storage.getCourses().filter(c => c.createdBy === currentUser.id);
    const quizzes = storage.getQuizzes().filter(q => q.createdBy === currentUser.id);
    const assignments = storage.getAssignments().filter((a: any) => a.createdBy === currentUser.id);
    const submissions = storage.getSubmissions();
    const events = storage.getCalendarEvents();
    const salaries = storage.getSalariesByUser(currentUser.id);
    const allClasses = storage.getClasses();

    // Get teacher's assigned classes
    const teacherClasses = allClasses.filter(c => currentUser.classes?.includes(c.id));
    setAssignedClasses(teacherClasses);

    // Get students from assigned classes
    const allUsers = storage.getAllUsers();
    const classStudents = allUsers.filter(u => 
      u.role === 'student' && 
      u.classId && 
      currentUser.classes?.includes(u.classId)
    );

    const pendingGrading = submissions.filter((s: any) => 
      assignments.some((a: any) => a.id === s.assignmentId) && !s.grade
    ).length;

    const now = new Date();
    const upcomingEvents = events.filter(e => new Date(e.startDate) > now);

    const lastSalary = salaries.length > 0 ? salaries[salaries.length - 1] : null;

    setStats({
      myCourses: courses.length,
      myQuizzes: quizzes.length,
      totalStudents: classStudents.length,
      myAssignments: assignments.length,
      pendingGrading,
      upcomingEvents: upcomingEvents.length,
      mySalary: lastSalary ? lastSalary.netPay : 0,
      myClassesCount: teacherClasses.length,
    });
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
              <h1 className="text-xl font-bold">Teacher Dashboard</h1>
            </div>
          </header>

          <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user.name}!</h2>
              <p className="text-muted-foreground mt-1">
                Here's an overview of your teaching activities
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/dashboard')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">My Courses</CardTitle>
                  <BookOpen className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.myCourses}</div>
                  <p className="text-xs text-muted-foreground">Courses teaching</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">My Quizzes</CardTitle>
                  <FileText className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.myQuizzes}</div>
                  <p className="text-xs text-muted-foreground">Assessments created</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalStudents}</div>
                  <p className="text-xs text-muted-foreground">Enrolled students</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/assignments')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">My Assignments</CardTitle>
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.myAssignments}</div>
                  <p className="text-xs text-muted-foreground">Created assignments</p>
                </CardContent>
              </Card>
            </div>

            {/* Activity Overview */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Grading</CardTitle>
                  <FileText className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingGrading}</div>
                  <p className="text-xs text-muted-foreground">Submissions to grade</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/calendar')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                  <Calendar className="h-4 w-4 text-pink-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
                  <p className="text-xs text-muted-foreground">Scheduled events</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Last Salary</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{stats.mySalary.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Recent payment</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your teaching activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <Button onClick={() => navigate('/create-course')} className="w-full">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Create New Course
                  </Button>
                  <Button onClick={() => navigate('/assignments')} variant="outline" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Manage Assignments
                  </Button>
                  <Button onClick={() => navigate('/announcements')} variant="outline" className="w-full">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Post Announcement
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* My Classes */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <School className="h-5 w-5" />
                      My Assigned Classes
                    </CardTitle>
                    <CardDescription>Classes you are teaching</CardDescription>
                  </div>
                  <Badge variant="secondary">{stats.myClassesCount} classes</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {assignedClasses.length === 0 ? (
                  <div className="text-center py-8">
                    <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">No classes assigned yet</h3>
                    <p className="text-muted-foreground">
                      Contact your administrator to be assigned to classes
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {assignedClasses.map((cls) => {
                      const classStudents = storage.getStudentsByClass(cls.id);
                      return (
                        <div key={cls.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{cls.name}</h4>
                            <Badge variant="outline">{classStudents.length} students</Badge>
                          </div>
                          {cls.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">{cls.description}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Teaching Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Your Teaching Overview</CardTitle>
                <CardDescription>Summary of your teaching activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Course Management</h3>
                      <p className="text-sm text-muted-foreground">
                        Teaching {stats.myCourses} courses with {stats.myQuizzes} assessments created
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Student Engagement</h3>
                      <p className="text-sm text-muted-foreground">
                        Reaching {stats.totalStudents} students across all your courses
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Pending Work</h3>
                      <p className="text-sm text-muted-foreground">
                        {stats.pendingGrading} submissions waiting for grading
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Schedule</h3>
                      <p className="text-sm text-muted-foreground">
                        {stats.upcomingEvents} upcoming events to attend
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TeacherDashboard;
