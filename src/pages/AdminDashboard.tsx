import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "@/lib/storage";
import { User, SchoolClass } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, GraduationCap, Calendar, DollarSign, FileText, TrendingUp, School, Plus, Megaphone, ClipboardList } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    totalQuizzes: 0,
    totalClasses: 0,
    activeAssignments: 0,
    upcomingEvents: 0,
    pendingFees: 0,
    pendingFeesAmount: 0,
    recentAnnouncements: 0,
  });

  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    if (currentUser.role !== "admin") {
      navigate("/dashboard");
      return;
    }
    setUser(currentUser);
    loadStats();
  }, [navigate]);

  const loadStats = () => {
    const users = storage.getAllUsers();
    const courses = storage.getCourses();
    const quizzes = storage.getQuizzes();
    const assignments = storage.getAssignments();
    const events = storage.getCalendarEvents();
    const feeRecords = storage.getFeeRecords();
    const announcements = storage.getAnnouncements();
    const allClasses = storage.getClasses();

    setClasses(allClasses);

    const now = new Date();
    const upcomingEvents = events.filter(e => new Date(e.startDate) > now);
    const activeAssignments = assignments.filter(a => new Date(a.dueDate) > now);
    const pendingFees = feeRecords.filter((r: any) => r.status !== 'paid');
    const pendingFeesAmount = pendingFees.reduce((sum: number, r: any) => sum + (r.totalAmount - r.paidAmount), 0);
    const recentAnnouncements = announcements.filter((a: any) => {
      const created = new Date(a.createdAt);
      const daysDiff = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    });

    setStats({
      totalStudents: users.filter(u => u.role === 'student').length,
      totalTeachers: users.filter(u => u.role === 'teacher').length,
      totalCourses: courses.length,
      totalQuizzes: quizzes.length,
      totalClasses: allClasses.length,
      activeAssignments: activeAssignments.length,
      upcomingEvents: upcomingEvents.length,
      pendingFees: pendingFees.length,
      pendingFeesAmount,
      recentAnnouncements: recentAnnouncements.length,
    });
  };

  const getClassStudentCount = (classId: string) => {
    return storage.getAllUsers().filter(u => u.role === 'student' && u.classId === classId).length;
  };

  if (!user) return null;

  return (
    <DashboardLayout user={user} title="Admin Dashboard" notificationCount={stats.recentAnnouncements}>
      <main className="flex-1 px-4 py-6 md:container md:mx-auto md:py-8 space-y-6 md:space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">School Overview</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome back, {user.name}!
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/manage-classes')} variant="outline" size="sm" className="md:size-default">
              <School className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">Manage </span>Classes
            </Button>
            <Button onClick={() => navigate('/manage-users')} size="sm" className="md:size-default">
              <Users className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">Manage </span>Users
            </Button>
          </div>
        </div>

        {/* Key Metrics - scrollable on mobile */}
        <div className="flex gap-3 md:grid md:grid-cols-2 lg:grid-cols-5 md:gap-4 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow min-w-[140px] md:min-w-0 snap-start" onClick={() => navigate('/manage-classes')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Classes</CardTitle>
              <School className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-xl md:text-2xl font-bold">{stats.totalClasses}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">Academic</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow min-w-[140px] md:min-w-0 snap-start" onClick={() => navigate('/manage-users')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Students</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-xl md:text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">Enrolled</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow min-w-[140px] md:min-w-0 snap-start" onClick={() => navigate('/manage-users')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Teachers</CardTitle>
              <GraduationCap className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-xl md:text-2xl font-bold">{stats.totalTeachers}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">Staff</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow min-w-[140px] md:min-w-0 snap-start" onClick={() => navigate('/courses')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-xl md:text-2xl font-bold">{stats.totalCourses}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">Active</p>
            </CardContent>
          </Card>

          <Card className="min-w-[140px] md:min-w-0 snap-start">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Quizzes</CardTitle>
              <FileText className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-xl md:text-2xl font-bold">{stats.totalQuizzes}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">Assessments</p>
            </CardContent>
          </Card>
        </div>

        {/* Activity Overview */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/assignments')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Assignments</CardTitle>
              <ClipboardList className="h-4 w-4 text-cyan-500" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-xl md:text-2xl font-bold">{stats.activeAssignments}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">Active</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/calendar')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Events</CardTitle>
              <Calendar className="h-4 w-4 text-pink-500" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-xl md:text-2xl font-bold">{stats.upcomingEvents}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">Upcoming</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/fee-management')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Fees</CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-xl md:text-2xl font-bold">₹{stats.pendingFeesAmount.toLocaleString()}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">{stats.pendingFees} pending</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/announcements')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Announcements</CardTitle>
              <Megaphone className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-xl md:text-2xl font-bold">{stats.recentAnnouncements}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">Last 7 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Classes Overview */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base md:text-lg">Classes Overview</CardTitle>
                <CardDescription className="text-xs md:text-sm">Students distribution across classes</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/manage-classes')}>
                <Plus className="mr-1.5 h-4 w-4" />
                <span className="hidden sm:inline">Add </span>Class
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            {classes.length === 0 ? (
              <div className="text-center py-6 md:py-8">
                <School className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold mb-1.5 text-sm md:text-base">No classes created yet</h3>
                <p className="text-xs md:text-sm text-muted-foreground mb-4">Create classes to organize students and teachers</p>
                <Button onClick={() => navigate('/manage-classes')} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Class
                </Button>
              </div>
            ) : (
              <div className="grid gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-3">
                {classes.map((cls) => (
                  <div
                    key={cls.id}
                    className="p-3 md:p-4 border rounded-xl hover:bg-accent/50 cursor-pointer transition-colors active:scale-[0.98]"
                    onClick={() => navigate('/manage-classes')}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="font-semibold text-sm">{cls.name}</h4>
                      <Badge variant="secondary" className="text-[10px]">{getClassStudentCount(cls.id)} students</Badge>
                    </div>
                    {cls.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{cls.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-base md:text-lg">Quick Actions</CardTitle>
            <CardDescription className="text-xs md:text-sm">Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <Button onClick={() => navigate('/create-course')} className="w-full text-xs md:text-sm">
                <BookOpen className="mr-1.5 h-4 w-4" />
                Create Course
              </Button>
              <Button onClick={() => navigate('/announcements')} variant="outline" className="w-full text-xs md:text-sm">
                <Megaphone className="mr-1.5 h-4 w-4" />
                Announce
              </Button>
              <Button onClick={() => navigate('/fee-management')} variant="outline" className="w-full text-xs md:text-sm">
                <DollarSign className="mr-1.5 h-4 w-4" />
                Fees
              </Button>
              <Button onClick={() => navigate('/calendar')} variant="outline" className="w-full text-xs md:text-sm">
                <Calendar className="mr-1.5 h-4 w-4" />
                Add Event
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* School Information */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-base md:text-lg">School Information</CardTitle>
            <CardDescription className="text-xs md:text-sm">Key details about your institution</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-1 text-sm">Academic Structure</h3>
                <p className="text-xs text-muted-foreground">
                  {stats.totalClasses} classes with {stats.totalCourses} courses and {stats.totalQuizzes} assessments
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-sm">Staff & Students</h3>
                <p className="text-xs text-muted-foreground">
                  {stats.totalTeachers} teachers managing {stats.totalStudents} students
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-sm">Upcoming Activities</h3>
                <p className="text-xs text-muted-foreground">
                  {stats.upcomingEvents} events, {stats.activeAssignments} assignments pending
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-sm">Financial Status</h3>
                <p className="text-xs text-muted-foreground">
                  ₹{stats.pendingFeesAmount.toLocaleString()} pending across {stats.pendingFees} records
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </DashboardLayout>
  );
};

export default AdminDashboard;
