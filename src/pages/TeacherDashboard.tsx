import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "@/lib/storage";
import { User, SchoolClass } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Users, Calendar, TrendingUp, DollarSign, School, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/DashboardLayout";

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

    const teacherClasses = allClasses.filter(c => currentUser.classes?.includes(c.id));
    setAssignedClasses(teacherClasses);

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
    <DashboardLayout user={user} title="Teacher Dashboard">
      <main className="flex-1 px-4 py-6 md:container md:mx-auto md:py-8 space-y-6 md:space-y-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome back, {user.name}!</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Here's an overview of your teaching activities
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/dashboard')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">My Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-xl md:text-2xl font-bold">{stats.myCourses}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">Courses teaching</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">My Quizzes</CardTitle>
              <FileText className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-xl md:text-2xl font-bold">{stats.myQuizzes}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">Assessments created</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Students</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-xl md:text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">Enrolled</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/assignments')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Assignments</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-xl md:text-2xl font-bold">{stats.myAssignments}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">Created</p>
            </CardContent>
          </Card>
        </div>

        {/* Activity Overview - scrollable on mobile */}
        <div className="flex gap-3 md:grid md:grid-cols-3 md:gap-4 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory">
          <Card className="min-w-[160px] md:min-w-0 snap-start">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Pending Grading</CardTitle>
              <FileText className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-xl md:text-2xl font-bold">{stats.pendingGrading}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">To grade</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow min-w-[160px] md:min-w-0 snap-start" onClick={() => navigate('/calendar')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Events</CardTitle>
              <Calendar className="h-4 w-4 text-pink-500" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-xl md:text-2xl font-bold">{stats.upcomingEvents}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">Upcoming</p>
            </CardContent>
          </Card>

          <Card className="min-w-[160px] md:min-w-0 snap-start">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Last Salary</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-xl md:text-2xl font-bold">₹{stats.mySalary.toLocaleString()}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">Recent pay</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-base md:text-lg">Quick Actions</CardTitle>
            <CardDescription className="text-xs md:text-sm">Manage your teaching activities</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
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
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <School className="h-4 w-4 md:h-5 md:w-5" />
                  My Assigned Classes
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">Classes you are teaching</CardDescription>
              </div>
              <Badge variant="secondary" className="text-xs">{stats.myClassesCount} classes</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            {assignedClasses.length === 0 ? (
              <div className="text-center py-6 md:py-8">
                <GraduationCap className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold mb-1.5 text-sm md:text-base">No classes assigned yet</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Contact your administrator to be assigned to classes
                </p>
              </div>
            ) : (
              <div className="grid gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-3">
                {assignedClasses.map((cls) => {
                  const classStudents = storage.getStudentsByClass(cls.id);
                  return (
                    <div key={cls.id} className="p-3 md:p-4 border rounded-xl hover:bg-accent/50 transition-colors active:scale-[0.98]">
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="font-semibold text-sm">{cls.name}</h4>
                        <Badge variant="outline" className="text-[10px]">{classStudents.length} students</Badge>
                      </div>
                      {cls.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">{cls.description}</p>
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
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-base md:text-lg">Your Teaching Overview</CardTitle>
            <CardDescription className="text-xs md:text-sm">Summary of your teaching activities</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-1 text-sm">Course Management</h3>
                <p className="text-xs text-muted-foreground">
                  Teaching {stats.myCourses} courses with {stats.myQuizzes} assessments created
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-sm">Student Engagement</h3>
                <p className="text-xs text-muted-foreground">
                  Reaching {stats.totalStudents} students across all your courses
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-sm">Pending Work</h3>
                <p className="text-xs text-muted-foreground">
                  {stats.pendingGrading} submissions waiting for grading
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-sm">Schedule</h3>
                <p className="text-xs text-muted-foreground">
                  {stats.upcomingEvents} upcoming events to attend
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
