import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "@/lib/storage";
import { User, Course, SchoolClass } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Calendar, ClipboardList, DollarSign, Bell, Trophy, TrendingUp, Users } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [studentClass, setStudentClass] = useState<SchoolClass | null>(null);
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    completedQuizzes: 0,
    pendingAssignments: 0,
    upcomingEvents: 0,
    unreadAnnouncements: 0,
    averageScore: 0,
    totalQuizzes: 0,
    pendingFees: 0,
  });
  const [recentCourses, setRecentCourses] = useState<Course[]>([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState<any[]>([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<any[]>([]);

  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    if (currentUser.role !== "student") {
      navigate("/dashboard");
      return;
    }
    setUser(currentUser);
    loadDashboardData(currentUser);
  }, [navigate]);

  const loadDashboardData = (currentUser: User) => {
    // Get student's class
    if (currentUser.classId) {
      const classData = storage.getClassById(currentUser.classId);
      setStudentClass(classData || null);
    }

    // Get enrolled courses
    const allCourses = storage.getCourses();
    const enrolled = allCourses.filter(c => c.enrolledStudents.includes(currentUser.id));
    setRecentCourses(enrolled.slice(0, 3));

    // Get quiz attempts and scores
    const attempts = storage.getAttempts().filter(a => a.studentId === currentUser.id && a.submittedAt);
    const quizzes = storage.getQuizzes();
    const totalQuizzesInCourses = enrolled.reduce((sum, c) => sum + c.quizzes.length, 0);
    
    const scores = attempts.filter(a => a.score !== undefined).map(a => a.score as number);
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

    // Get assignments
    const assignments = storage.getAssignments();
    const submissions = storage.getSubmissions();
    const myAssignments = assignments.filter((a: any) => 
      enrolled.some(c => c.id === a.courseId) &&
      (!a.classId || a.classId === currentUser.classId)
    );
    const submittedIds = submissions
      .filter((s: any) => s.studentId === currentUser.id)
      .map((s: any) => s.assignmentId);
    const pendingAssignments = myAssignments.filter((a: any) => !submittedIds.includes(a.id));

    // Get upcoming events for student's class
    const events = storage.getCalendarEvents();
    const now = new Date();
    const upcoming = events.filter((e: any) => {
      const eventDate = new Date(e.startDate);
      const isUpcoming = eventDate > now;
      const isForClass = !e.targetClasses || e.targetClasses.length === 0 || 
        (currentUser.classId && e.targetClasses.includes(currentUser.classId));
      return isUpcoming && isForClass;
    }).slice(0, 5);

    // Get announcements
    const announcements = storage.getAnnouncements();
    const relevantAnnouncements = announcements.filter((a: any) => {
      const isForStudent = a.visibility === 'all' || a.visibility === 'student';
      const isForClass = !a.targetClasses || a.targetClasses.length === 0 || 
        (currentUser.classId && a.targetClasses.includes(currentUser.classId));
      return isForStudent && isForClass;
    });
    const unread = relevantAnnouncements.filter((a: any) => !a.readBy?.includes(currentUser.id));
    setRecentAnnouncements(relevantAnnouncements.slice(0, 3));

    // Get fee records
    const feeRecords = storage.getFeeRecords();
    const myFees = feeRecords.filter((f: any) => f.studentId === currentUser.id);
    const pendingFees = myFees.filter((f: any) => f.status !== 'paid')
      .reduce((sum: number, f: any) => sum + (f.totalAmount - f.paidAmount), 0);

    // Get upcoming deadlines (assignments + events)
    const deadlines = [
      ...pendingAssignments.map((a: any) => ({
        id: a.id,
        title: a.title,
        date: a.dueDate,
        type: 'assignment'
      })),
      ...upcoming.map((e: any) => ({
        id: e.id,
        title: e.title,
        date: e.startDate,
        type: e.type
      }))
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 5);
    setUpcomingDeadlines(deadlines);

    setStats({
      enrolledCourses: enrolled.length,
      completedQuizzes: attempts.length,
      pendingAssignments: pendingAssignments.length,
      upcomingEvents: upcoming.length,
      unreadAnnouncements: unread.length,
      averageScore: Math.round(avgScore),
      totalQuizzes: totalQuizzesInCourses,
      pendingFees,
    });
  };

  if (!user) return null;

  const quizProgress = stats.totalQuizzes > 0 
    ? (stats.completedQuizzes / stats.totalQuizzes) * 100 
    : 0;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar user={user} />
        <div className="flex-1 flex flex-col">
          <header className="border-b bg-card shadow-sm sticky top-0 z-10">
            <div className="container mx-auto px-4 py-4 flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-bold">Student Dashboard</h1>
            </div>
          </header>

          <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user.name}!</h2>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-muted-foreground">
                    {studentClass ? `Class: ${studentClass.name}` : 'No class assigned'}
                  </p>
                  {studentClass && (
                    <Badge variant="secondary">{studentClass.name}</Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => navigate('/my-results')} variant="outline">
                  <Trophy className="mr-2 h-4 w-4" />
                  View Results
                </Button>
                <Button onClick={() => navigate('/my-fees')}>
                  <DollarSign className="mr-2 h-4 w-4" />
                  Fee Payment
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/student-dashboard')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
                  <BookOpen className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.enrolledCourses}</div>
                  <p className="text-xs text-muted-foreground">Active courses</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/my-results')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Quiz Progress</CardTitle>
                  <FileText className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.completedQuizzes}/{stats.totalQuizzes}</div>
                  <Progress value={quizProgress} className="mt-2 h-2" />
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/student-assignments')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
                  <ClipboardList className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingAssignments}</div>
                  <p className="text-xs text-muted-foreground">Due soon</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.averageScore}%</div>
                  <p className="text-xs text-muted-foreground">Across all quizzes</p>
                </CardContent>
              </Card>
            </div>

            {/* Second Row Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/announcements')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Announcements</CardTitle>
                  <Bell className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.unreadAnnouncements}</div>
                  <p className="text-xs text-muted-foreground">Unread notifications</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/calendar')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                  <Calendar className="h-4 w-4 text-pink-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
                  <p className="text-xs text-muted-foreground">Events this month</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/my-fees')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
                  <DollarSign className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{stats.pendingFees.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Outstanding amount</p>
                </CardContent>
              </Card>
            </div>

            {/* Content Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* My Courses */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>My Courses</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/student-dashboard')}>
                      View All
                    </Button>
                  </div>
                  <CardDescription>Continue learning</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentCourses.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No courses enrolled</p>
                  ) : (
                    <div className="space-y-4">
                      {recentCourses.map((course) => (
                        <div 
                          key={course.id}
                          className="flex items-center gap-4 p-3 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors"
                          onClick={() => navigate(`/student-course-view/${course.id}`)}
                        >
                          <div className="rounded-lg bg-primary/10 p-2">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{course.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {course.quizzes.length} quizzes
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Upcoming Deadlines */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Deadlines</CardTitle>
                  <CardDescription>Don't miss important dates</CardDescription>
                </CardHeader>
                <CardContent>
                  {upcomingDeadlines.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No upcoming deadlines</p>
                  ) : (
                    <div className="space-y-4">
                      {upcomingDeadlines.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg border">
                          <div className={`rounded-lg p-2 ${
                            item.type === 'assignment' ? 'bg-orange-100 dark:bg-orange-900/30' :
                            item.type === 'exam' ? 'bg-red-100 dark:bg-red-900/30' :
                            'bg-blue-100 dark:bg-blue-900/30'
                          }`}>
                            {item.type === 'assignment' ? (
                              <ClipboardList className="h-5 w-5 text-orange-600" />
                            ) : (
                              <Calendar className="h-5 w-5 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{item.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(item.date).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                          <Badge variant={item.type === 'assignment' ? 'default' : 'secondary'}>
                            {item.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Announcements */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Announcements</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/announcements')}>
                      View All
                    </Button>
                  </div>
                  <CardDescription>Stay updated with school news</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentAnnouncements.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No announcements</p>
                  ) : (
                    <div className="space-y-4">
                      {recentAnnouncements.map((announcement) => (
                        <div key={announcement.id} className="p-4 rounded-lg border">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">{announcement.title}</h4>
                                {announcement.priority === 'urgent' && (
                                  <Badge variant="destructive">Urgent</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {announcement.content}
                              </p>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {new Date(announcement.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default StudentDashboard;