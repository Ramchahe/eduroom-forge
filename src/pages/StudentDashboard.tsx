import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "@/lib/storage";
import { User, Course, SchoolClass } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Calendar, ClipboardList, DollarSign, Bell, Trophy, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DashboardLayout } from "@/components/DashboardLayout";

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
    if (currentUser.classId) {
      const classData = storage.getClassById(currentUser.classId);
      setStudentClass(classData || null);
    }

    const allCourses = storage.getCourses();
    const enrolled = allCourses.filter(c => c.enrolledStudents.includes(currentUser.id));
    setRecentCourses(enrolled.slice(0, 3));

    const attempts = storage.getAttempts().filter(a => a.studentId === currentUser.id && a.submittedAt);
    const totalQuizzesInCourses = enrolled.reduce((sum, c) => sum + c.quizzes.length, 0);
    const scores = attempts.filter(a => a.score !== undefined).map(a => a.score as number);
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

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

    const events = storage.getCalendarEvents();
    const now = new Date();
    const upcoming = events.filter((e: any) => {
      const eventDate = new Date(e.startDate);
      const isUpcoming = eventDate > now;
      const isForClass = !e.targetClasses || e.targetClasses.length === 0 ||
        (currentUser.classId && e.targetClasses.includes(currentUser.classId));
      return isUpcoming && isForClass;
    }).slice(0, 5);

    const announcements = storage.getAnnouncements();
    const relevantAnnouncements = announcements.filter((a: any) => {
      const isForStudent = a.visibility === 'all' || a.visibility === 'student';
      const isForClass = !a.targetClasses || a.targetClasses.length === 0 ||
        (currentUser.classId && a.targetClasses.includes(currentUser.classId));
      return isForStudent && isForClass;
    });
    const unread = relevantAnnouncements.filter((a: any) => !a.readBy?.includes(currentUser.id));
    setRecentAnnouncements(relevantAnnouncements.slice(0, 3));

    const feeRecords = storage.getFeeRecords();
    const myFees = feeRecords.filter((f: any) => f.studentId === currentUser.id);
    const pendingFeesAmount = myFees.filter((f: any) => f.status !== 'paid')
      .reduce((sum: number, f: any) => sum + (f.totalAmount - f.paidAmount), 0);

    const deadlines = [
      ...pendingAssignments.map((a: any) => ({
        id: a.id, title: a.title, date: a.dueDate, type: 'assignment'
      })),
      ...upcoming.map((e: any) => ({
        id: e.id, title: e.title, date: e.startDate, type: e.type
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
      pendingFees: pendingFeesAmount,
    });
  };

  if (!user) return null;

  const quizProgress = stats.totalQuizzes > 0
    ? (stats.completedQuizzes / stats.totalQuizzes) * 100
    : 0;

  return (
    <DashboardLayout user={user} title="Student Dashboard" notificationCount={stats.unreadAnnouncements}>
      <main className="flex-1 px-4 py-6 md:container md:mx-auto md:py-8 space-y-6 md:space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome back, {user.name}!</h2>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-muted-foreground">
                {studentClass ? `Class: ${studentClass.name}` : 'No class assigned'}
              </p>
              {studentClass && (
                <Badge variant="secondary" className="text-xs">{studentClass.name}</Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/my-results')} variant="outline" size="sm" className="md:size-default">
              <Trophy className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">View </span>Results
            </Button>
            <Button onClick={() => navigate('/my-fees')} size="sm" className="md:size-default">
              <DollarSign className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">Fee </span>Payment
            </Button>
          </div>
        </div>

        {/* Stats Cards - 2 cols on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/student-dashboard')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Enrolled Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-xl md:text-2xl font-bold">{stats.enrolledCourses}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">Active courses</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/my-results')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Quiz Progress</CardTitle>
              <FileText className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-xl md:text-2xl font-bold">{stats.completedQuizzes}/{stats.totalQuizzes}</div>
              <Progress value={quizProgress} className="mt-1.5 md:mt-2 h-1.5 md:h-2" />
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/student-assignments')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Pending Tasks</CardTitle>
              <ClipboardList className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-xl md:text-2xl font-bold">{stats.pendingAssignments}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">Due soon</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Avg Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-xl md:text-2xl font-bold">{stats.averageScore}%</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">All quizzes</p>
            </CardContent>
          </Card>
        </div>

        {/* Second Row Stats - scrollable on mobile */}
        <div className="flex gap-3 md:grid md:grid-cols-3 md:gap-4 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow min-w-[160px] md:min-w-0 snap-start" onClick={() => navigate('/announcements')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Announcements</CardTitle>
              <Bell className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-xl md:text-2xl font-bold">{stats.unreadAnnouncements}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">Unread</p>
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

          <Card className="cursor-pointer hover:shadow-lg transition-shadow min-w-[160px] md:min-w-0 snap-start" onClick={() => navigate('/my-fees')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Pending Fees</CardTitle>
              <DollarSign className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-xl md:text-2xl font-bold">₹{stats.pendingFees.toLocaleString()}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">Outstanding</p>
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
          {/* My Courses */}
          <Card>
            <CardHeader className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base md:text-lg">My Courses</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/student-dashboard')}>
                  View All
                </Button>
              </div>
              <CardDescription className="text-xs md:text-sm">Continue learning</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
              {recentCourses.length === 0 ? (
                <p className="text-muted-foreground text-center py-4 text-sm">No courses enrolled</p>
              ) : (
                <div className="space-y-3">
                  {recentCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center gap-3 p-3 rounded-xl border hover:bg-accent/50 cursor-pointer transition-colors active:scale-[0.98]"
                      onClick={() => navigate(`/student-course-view/${course.id}`)}
                    >
                      <div className="rounded-lg bg-primary/10 p-2 shrink-0">
                        <BookOpen className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-sm">{course.title}</p>
                        <p className="text-xs text-muted-foreground">{course.quizzes.length} quizzes</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-base md:text-lg">Upcoming Deadlines</CardTitle>
              <CardDescription className="text-xs md:text-sm">Don't miss important dates</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
              {upcomingDeadlines.length === 0 ? (
                <p className="text-muted-foreground text-center py-4 text-sm">No upcoming deadlines</p>
              ) : (
                <div className="space-y-3">
                  {upcomingDeadlines.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border">
                      <div className={`rounded-lg p-2 shrink-0 ${
                        item.type === 'assignment' ? 'bg-orange-100 dark:bg-orange-900/30' :
                        item.type === 'exam' ? 'bg-red-100 dark:bg-red-900/30' :
                        'bg-blue-100 dark:bg-blue-900/30'
                      }`}>
                        {item.type === 'assignment' ? (
                          <ClipboardList className="h-4 w-4 text-orange-600" />
                        ) : (
                          <Calendar className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.date).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </p>
                      </div>
                      <Badge variant={item.type === 'assignment' ? 'default' : 'secondary'} className="text-[10px] shrink-0">
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
            <CardHeader className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base md:text-lg">Recent Announcements</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/announcements')}>
                  View All
                </Button>
              </div>
              <CardDescription className="text-xs md:text-sm">Stay updated with school news</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
              {recentAnnouncements.length === 0 ? (
                <p className="text-muted-foreground text-center py-4 text-sm">No announcements</p>
              ) : (
                <div className="space-y-3">
                  {recentAnnouncements.map((announcement) => (
                    <div key={announcement.id} className="p-3 md:p-4 rounded-xl border">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold text-sm">{announcement.title}</h4>
                            {announcement.priority === 'urgent' && (
                              <Badge variant="destructive" className="text-[10px]">Urgent</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {announcement.content}
                          </p>
                        </div>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
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
    </DashboardLayout>
  );
};

export default StudentDashboard;
