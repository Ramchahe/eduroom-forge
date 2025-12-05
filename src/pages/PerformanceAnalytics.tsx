import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "@/lib/storage";
import { User, QuizAttempt, Quiz, Course } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TrendingUp, Trophy, Target, BarChart3, Medal } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface StudentRanking {
  studentId: string;
  studentName: string;
  totalScore: number;
  totalAttempts: number;
  averagePercentage: number;
}

const PerformanceAnalytics = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [attempts, setAttempts] = useState<(QuizAttempt & { quiz: Quiz })[]>([]);
  const [allStudentRankings, setAllStudentRankings] = useState<StudentRanking[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [courses, setCourses] = useState<Course[]>([]);

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
    loadData(currentUser);
  }, [navigate]);

  const loadData = (currentUser: User) => {
    const allAttempts = storage.getAttempts();
    const allUsers = storage.getAllUsers();
    const allCourses = storage.getCourses();
    
    // Get enrolled courses for this student
    const enrolledCourses = allCourses.filter(c => c.enrolledStudents.includes(currentUser.id));
    setCourses(enrolledCourses);
    
    // Load user's attempts
    const userAttempts = allAttempts.filter(a => a.studentId === currentUser.id && a.submittedAt);
    const attemptsWithQuiz = userAttempts.map(attempt => {
      const quiz = storage.getQuizById(attempt.quizId);
      return { ...attempt, quiz: quiz! };
    }).filter(a => a.quiz);
    setAttempts(attemptsWithQuiz);
    
    // Calculate rankings for all students
    const studentMap = new Map<string, { scores: number[], totalMarks: number[] }>();
    
    allAttempts.filter(a => a.submittedAt).forEach(attempt => {
      const quiz = storage.getQuizById(attempt.quizId);
      if (!quiz) return;
      
      const totalMarks = quiz.questions.reduce((sum, q) => sum + q.marks, 0);
      const existing = studentMap.get(attempt.studentId) || { scores: [], totalMarks: [] };
      existing.scores.push(attempt.score || 0);
      existing.totalMarks.push(totalMarks);
      studentMap.set(attempt.studentId, existing);
    });
    
    const rankings: StudentRanking[] = [];
    studentMap.forEach((data, studentId) => {
      const student = allUsers.find(u => u.id === studentId);
      if (!student) return;
      
      const totalScore = data.scores.reduce((a, b) => a + b, 0);
      const totalPossible = data.totalMarks.reduce((a, b) => a + b, 0);
      const avgPercentage = totalPossible > 0 ? (totalScore / totalPossible) * 100 : 0;
      
      rankings.push({
        studentId,
        studentName: student.name,
        totalScore,
        totalAttempts: data.scores.length,
        averagePercentage: Math.round(avgPercentage),
      });
    });
    
    rankings.sort((a, b) => b.averagePercentage - a.averagePercentage);
    setAllStudentRankings(rankings);
  };

  if (!user) return null;

  // Filter attempts by selected course
  const filteredAttempts = selectedCourse === "all" 
    ? attempts 
    : attempts.filter(a => a.quiz.courseId === selectedCourse);

  // Progress over time data
  const progressData = filteredAttempts
    .sort((a, b) => new Date(a.submittedAt!).getTime() - new Date(b.submittedAt!).getTime())
    .map((attempt, index) => {
      const totalMarks = attempt.quiz.questions.reduce((sum, q) => sum + q.marks, 0);
      const percentage = Math.round(((attempt.score || 0) / totalMarks) * 100);
      return {
        name: `Quiz ${index + 1}`,
        score: percentage,
        date: new Date(attempt.submittedAt!).toLocaleDateString(),
      };
    });

  // Subject-wise performance
  const subjectPerformance = filteredAttempts.reduce((acc, attempt) => {
    const subject = attempt.quiz.title.split(" ")[0] || "General";
    const totalMarks = attempt.quiz.questions.reduce((sum, q) => sum + q.marks, 0);
    const percentage = ((attempt.score || 0) / totalMarks) * 100;
    
    if (!acc[subject]) {
      acc[subject] = { total: 0, count: 0 };
    }
    acc[subject].total += percentage;
    acc[subject].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const subjectData = Object.entries(subjectPerformance).map(([name, data]) => ({
    name,
    average: Math.round(data.total / data.count),
  }));

  // Score distribution (pie chart)
  const scoreDistribution = [
    { name: "Excellent (>80%)", value: filteredAttempts.filter(a => {
      const totalMarks = a.quiz.questions.reduce((sum, q) => sum + q.marks, 0);
      return ((a.score || 0) / totalMarks) * 100 > 80;
    }).length },
    { name: "Good (60-80%)", value: filteredAttempts.filter(a => {
      const totalMarks = a.quiz.questions.reduce((sum, q) => sum + q.marks, 0);
      const pct = ((a.score || 0) / totalMarks) * 100;
      return pct >= 60 && pct <= 80;
    }).length },
    { name: "Average (40-60%)", value: filteredAttempts.filter(a => {
      const totalMarks = a.quiz.questions.reduce((sum, q) => sum + q.marks, 0);
      const pct = ((a.score || 0) / totalMarks) * 100;
      return pct >= 40 && pct < 60;
    }).length },
    { name: "Needs Work (<40%)", value: filteredAttempts.filter(a => {
      const totalMarks = a.quiz.questions.reduce((sum, q) => sum + q.marks, 0);
      return ((a.score || 0) / totalMarks) * 100 < 40;
    }).length },
  ].filter(d => d.value > 0);

  const COLORS = ["hsl(142, 76%, 36%)", "hsl(188, 94%, 43%)", "hsl(38, 92%, 50%)", "hsl(0, 84%, 60%)"];

  // Stats
  const totalQuizzes = filteredAttempts.length;
  const avgScore = totalQuizzes > 0 
    ? Math.round(filteredAttempts.reduce((sum, a) => {
        const totalMarks = a.quiz.questions.reduce((s, q) => s + q.marks, 0);
        return sum + ((a.score || 0) / totalMarks) * 100;
      }, 0) / totalQuizzes)
    : 0;
  
  // Get current user's rank
  const userRank = allStudentRankings.findIndex(r => r.studentId === user.id) + 1;
  const top10 = allStudentRankings.slice(0, 10);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar user={user} />
        <div className="flex-1 flex flex-col">
          <header className="border-b bg-card shadow-sm sticky top-0 z-10">
            <div className="container mx-auto px-4 py-4 flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-bold">Performance Analytics</h1>
            </div>
          </header>

          <main className="flex-1 container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                  <BarChart3 className="h-8 w-8 text-primary" />
                  Your Performance
                </h2>
                <p className="text-muted-foreground mt-1">
                  Track your progress and see how you compare with others
                </p>
              </div>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {courses.map(course => (
                    <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Quizzes Taken</p>
                      <p className="text-2xl font-bold">{totalQuizzes}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-success/10 rounded-full">
                      <TrendingUp className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Average Score</p>
                      <p className="text-2xl font-bold">{avgScore}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-warning/10 rounded-full">
                      <Trophy className="h-6 w-6 text-warning" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Your Rank</p>
                      <p className="text-2xl font-bold">#{userRank || "-"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-accent/10 rounded-full">
                      <Medal className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Best Score</p>
                      <p className="text-2xl font-bold">
                        {filteredAttempts.length > 0 
                          ? Math.max(...filteredAttempts.map(a => {
                              const totalMarks = a.quiz.questions.reduce((s, q) => s + q.marks, 0);
                              return Math.round(((a.score || 0) / totalMarks) * 100);
                            }))
                          : 0}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Progress Over Time */}
              <Card>
                <CardHeader>
                  <CardTitle>Progress Over Time</CardTitle>
                  <CardDescription>Your quiz scores trend</CardDescription>
                </CardHeader>
                <CardContent>
                  {progressData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={progressData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" fontSize={12} />
                        <YAxis domain={[0, 100]} fontSize={12} />
                        <Tooltip 
                          formatter={(value: number) => [`${value}%`, "Score"]}
                          labelFormatter={(label) => {
                            const item = progressData.find(d => d.name === label);
                            return item ? `${label} - ${item.date}` : label;
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="score" 
                          stroke="hsl(233, 47%, 25%)" 
                          strokeWidth={2}
                          dot={{ fill: "hsl(233, 47%, 25%)" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                      No quiz data available
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Score Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Score Distribution</CardTitle>
                  <CardDescription>Breakdown of your performance</CardDescription>
                </CardHeader>
                <CardContent>
                  {scoreDistribution.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={scoreDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {scoreDistribution.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                      No quiz data available
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Subject Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Subject-wise Performance</CardTitle>
                  <CardDescription>Average scores by subject</CardDescription>
                </CardHeader>
                <CardContent>
                  {subjectData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={subjectData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" fontSize={12} />
                        <YAxis domain={[0, 100]} fontSize={12} />
                        <Tooltip formatter={(value: number) => [`${value}%`, "Average"]} />
                        <Bar dataKey="average" fill="hsl(188, 94%, 43%)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                      No subject data available
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Top 10 Leaderboard */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-warning" />
                    Top 10 Students
                  </CardTitle>
                  <CardDescription>Class leaderboard rankings</CardDescription>
                </CardHeader>
                <CardContent>
                  {top10.length > 0 ? (
                    <div className="space-y-2">
                      {top10.map((student, index) => (
                        <div 
                          key={student.studentId}
                          className={`flex items-center justify-between p-2 rounded-lg ${
                            student.studentId === user.id ? "bg-primary/10 border border-primary/20" : "bg-muted/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                              index === 0 ? "bg-yellow-500 text-white" :
                              index === 1 ? "bg-gray-400 text-white" :
                              index === 2 ? "bg-amber-700 text-white" :
                              "bg-muted text-muted-foreground"
                            }`}>
                              {index + 1}
                            </span>
                            <span className={student.studentId === user.id ? "font-semibold" : ""}>
                              {student.studentName}
                              {student.studentId === user.id && <Badge className="ml-2" variant="outline">You</Badge>}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold">{student.averagePercentage}%</span>
                            <span className="text-xs text-muted-foreground ml-2">({student.totalAttempts} quizzes)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                      No rankings available
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

export default PerformanceAnalytics;