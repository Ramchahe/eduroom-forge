import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "@/lib/storage";
import { User, SchoolClass } from "@/types";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, GraduationCap, Calendar, DollarSign, FileText, TrendingUp, School, Plus, Megaphone, ClipboardList } from "lucide-react";

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
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar user={user} />
        <div className="flex-1 flex flex-col">
          <header className="border-b bg-card shadow-sm sticky top-0 z-10">
            <div className="container mx-auto px-4 py-4 flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </div>
          </header>

          <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">School Overview</h2>
                <p className="text-muted-foreground mt-1">
                  Welcome back, {user.name}! Here's what's happening in your school.
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => navigate('/manage-classes')} variant="outline">
                  <School className="mr-2 h-4 w-4" />
                  Manage Classes
                </Button>
                <Button onClick={() => navigate('/manage-users')}>
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </Button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/manage-classes')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                  <School className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalClasses}</div>
                  <p className="text-xs text-muted-foreground">Academic classes</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/manage-users')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalStudents}</div>
                  <p className="text-xs text-muted-foreground">Enrolled students</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/manage-users')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
                  <GraduationCap className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalTeachers}</div>
                  <p className="text-xs text-muted-foreground">Teaching staff</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/courses')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                  <BookOpen className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCourses}</div>
                  <p className="text-xs text-muted-foreground">Active courses</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
                  <FileText className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalQuizzes}</div>
                  <p className="text-xs text-muted-foreground">Assessments</p>
                </CardContent>
              </Card>
            </div>

            {/* Activity Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/assignments')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
                  <ClipboardList className="h-4 w-4 text-cyan-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeAssignments}</div>
                  <p className="text-xs text-muted-foreground">Pending submissions</p>
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

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/fee-management')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
                  <DollarSign className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{stats.pendingFeesAmount.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">{stats.pendingFees} records</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/announcements')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recent Announcements</CardTitle>
                  <Megaphone className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.recentAnnouncements}</div>
                  <p className="text-xs text-muted-foreground">Last 7 days</p>
                </CardContent>
              </Card>
            </div>

            {/* Classes Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Classes Overview</CardTitle>
                    <CardDescription>Students distribution across classes</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate('/manage-classes')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Class
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {classes.length === 0 ? (
                  <div className="text-center py-8">
                    <School className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">No classes created yet</h3>
                    <p className="text-muted-foreground mb-4">Create classes to organize students and teachers</p>
                    <Button onClick={() => navigate('/manage-classes')}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create First Class
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {classes.map((cls) => (
                      <div
                        key={cls.id}
                        className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                        onClick={() => navigate('/manage-classes')}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{cls.name}</h4>
                          <Badge variant="secondary">{getClassStudentCount(cls.id)} students</Badge>
                        </div>
                        {cls.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{cls.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <Button onClick={() => navigate('/create-course')} className="w-full">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Create Course
                  </Button>
                  <Button onClick={() => navigate('/announcements')} variant="outline" className="w-full">
                    <Megaphone className="mr-2 h-4 w-4" />
                    Post Announcement
                  </Button>
                  <Button onClick={() => navigate('/fee-management')} variant="outline" className="w-full">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Manage Fees
                  </Button>
                  <Button onClick={() => navigate('/calendar')} variant="outline" className="w-full">
                    <Calendar className="mr-2 h-4 w-4" />
                    Add Event
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* School Information */}
            <Card>
              <CardHeader>
                <CardTitle>School Information</CardTitle>
                <CardDescription>Key details about your institution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Academic Structure</h3>
                      <p className="text-sm text-muted-foreground">
                        {stats.totalClasses} classes with {stats.totalCourses} courses and {stats.totalQuizzes} assessments
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Staff & Students</h3>
                      <p className="text-sm text-muted-foreground">
                        {stats.totalTeachers} teachers managing {stats.totalStudents} students across all classes
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Upcoming Activities</h3>
                      <p className="text-sm text-muted-foreground">
                        {stats.upcomingEvents} events scheduled, {stats.activeAssignments} assignments pending
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Financial Status</h3>
                      <p className="text-sm text-muted-foreground">
                        ₹{stats.pendingFeesAmount.toLocaleString()} pending across {stats.pendingFees} fee records
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

export default AdminDashboard;