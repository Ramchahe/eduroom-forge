import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "@/lib/storage";
import { User } from "@/types";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, GraduationCap, Calendar, DollarSign, FileText, TrendingUp } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    totalQuizzes: 0,
    activeAssignments: 0,
    upcomingEvents: 0,
    pendingFees: 0,
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

    const now = new Date();
    const upcomingEvents = events.filter(e => new Date(e.startDate) > now);
    const activeAssignments = assignments.filter(a => new Date(a.dueDate) > now);
    const pendingFees = feeRecords.filter((r: any) => r.status !== 'paid');
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
      activeAssignments: activeAssignments.length,
      upcomingEvents: upcomingEvents.length,
      pendingFees: pendingFees.length,
      recentAnnouncements: recentAnnouncements.length,
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
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </div>
          </header>

          <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">School Overview</h2>
              <p className="text-muted-foreground mt-1">
                Welcome back, {user.name}! Here's what's happening in your school.
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalStudents}</div>
                  <p className="text-xs text-muted-foreground">Enrolled in school</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
                  <GraduationCap className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalTeachers}</div>
                  <p className="text-xs text-muted-foreground">Teaching staff</p>
                </CardContent>
              </Card>

              <Card>
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
                  <p className="text-xs text-muted-foreground">Assessments created</p>
                </CardContent>
              </Card>
            </div>

            {/* Activity Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
                  <TrendingUp className="h-4 w-4 text-cyan-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeAssignments}</div>
                  <p className="text-xs text-muted-foreground">Pending submissions</p>
                </CardContent>
              </Card>

              <Card>
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
                  <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
                  <DollarSign className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingFees}</div>
                  <p className="text-xs text-muted-foreground">Fee records</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recent Announcements</CardTitle>
                  <FileText className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.recentAnnouncements}</div>
                  <p className="text-xs text-muted-foreground">Last 7 days</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>School Information</CardTitle>
                <CardDescription>Key details about your institution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Academic Performance</h3>
                      <p className="text-sm text-muted-foreground">
                        {stats.totalQuizzes} assessments conducted with {stats.totalCourses} active courses
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Staff & Students</h3>
                      <p className="text-sm text-muted-foreground">
                        {stats.totalTeachers} teachers managing {stats.totalStudents} students
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Upcoming Activities</h3>
                      <p className="text-sm text-muted-foreground">
                        {stats.upcomingEvents} events scheduled, {stats.activeAssignments} assignments pending
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Financial Status</h3>
                      <p className="text-sm text-muted-foreground">
                        {stats.pendingFees} pending fee records to process
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
