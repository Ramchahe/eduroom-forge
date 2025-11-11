import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { storage } from "@/lib/storage";
import { User, Quiz, QuizAttempt } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, Users, Award, BarChart3 } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const QuizReport = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);

  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    if (currentUser.role === "student") {
      navigate("/student-dashboard");
      return;
    }
    setUser(currentUser);

    if (quizId) {
      const quizData = storage.getQuizById(quizId);
      if (quizData) {
        setQuiz(quizData);
        const allAttempts = storage.getAttempts().filter(a => a.quizId === quizId && a.submittedAt);
        setAttempts(allAttempts);
      }
    }
  }, [navigate, quizId]);

  if (!user || !quiz) return null;

  const totalAttempts = attempts.length;
  const averageScore = totalAttempts > 0 
    ? (attempts.reduce((sum, a) => sum + (a.score || 0), 0) / totalAttempts).toFixed(2)
    : '0';
  const maxScore = Math.max(...attempts.map(a => a.score || 0), 0);
  const totalMarks = quiz.questions.reduce((sum, q) => sum + q.marks, 0);
  const passRate = totalAttempts > 0 
    ? ((attempts.filter(a => (a.score || 0) >= totalMarks * 0.4).length / totalAttempts) * 100).toFixed(1)
    : 0;

  const scoreDistribution = [
    { range: '0-20%', count: attempts.filter(a => (a.score || 0) / totalMarks <= 0.2).length },
    { range: '21-40%', count: attempts.filter(a => {
      const pct = (a.score || 0) / totalMarks;
      return pct > 0.2 && pct <= 0.4;
    }).length },
    { range: '41-60%', count: attempts.filter(a => {
      const pct = (a.score || 0) / totalMarks;
      return pct > 0.4 && pct <= 0.6;
    }).length },
    { range: '61-80%', count: attempts.filter(a => {
      const pct = (a.score || 0) / totalMarks;
      return pct > 0.6 && pct <= 0.8;
    }).length },
    { range: '81-100%', count: attempts.filter(a => {
      const pct = (a.score || 0) / totalMarks;
      return pct > 0.8;
    }).length },
  ];

  const topPerformers = attempts
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 10)
    .map(attempt => {
      const student = storage.getAllUsers().find(u => u.id === attempt.studentId);
      return { attempt, student };
    });

  const questionAnalysis = quiz.questions.map((question, index) => {
    const questionAttempts = attempts.filter(a => 
      a.attemptedQuestions.includes(question.id)
    );
    const correctAttempts = attempts.filter(a => {
      const userAnswer = a.answers[question.id];
      if (question.type === 'single-correct') {
        return userAnswer === question.correctAnswer;
      } else if (question.type === 'multi-correct') {
        const correct = question.correctAnswer as string[];
        return JSON.stringify(userAnswer?.sort()) === JSON.stringify(correct.sort());
      } else if (question.type === 'numerical') {
        return parseFloat(userAnswer) === question.correctAnswer;
      }
      return false;
    });

    const accuracy = questionAttempts.length > 0 
      ? ((correctAttempts.length / questionAttempts.length) * 100).toFixed(1)
      : '0';

    return {
      questionNum: index + 1,
      attempts: questionAttempts.length,
      accuracy: parseFloat(accuracy),
      difficulty: question.difficultyLevel,
    };
  });

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar user={user} />
        <div className="flex-1 flex flex-col">
          <header className="border-b bg-card shadow-sm sticky top-0 z-10">
            <div className="container mx-auto px-4 py-4 flex items-center gap-4">
              <SidebarTrigger />
              <Button variant="ghost" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <h1 className="text-xl font-bold">{quiz.title} - Report</h1>
            </div>
          </header>

          <main className="flex-1 container mx-auto px-4 py-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Quiz Analytics & Report</h2>
                <p className="text-muted-foreground mt-1">
                  Comprehensive analysis of quiz performance
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalAttempts}</div>
                    <p className="text-xs text-muted-foreground">Students completed</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{averageScore}/{totalMarks}</div>
                    <p className="text-xs text-muted-foreground">
                      {((parseFloat(averageScore.toString()) / totalMarks) * 100).toFixed(1)}% average
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{maxScore}/{totalMarks}</div>
                    <p className="text-xs text-muted-foreground">
                      {((maxScore / totalMarks) * 100).toFixed(1)}% top performance
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{passRate}%</div>
                    <p className="text-xs text-muted-foreground">Based on 40% passing</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Score Distribution</CardTitle>
                  <CardDescription>Number of students in each score range</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {scoreDistribution.map((dist, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-24 text-sm font-medium">{dist.range}</div>
                        <div className="flex-1 h-8 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-500"
                            style={{ width: totalAttempts > 0 ? `${(dist.count / totalAttempts) * 100}%` : '0%' }}
                          />
                        </div>
                        <div className="w-16 text-sm text-right">
                          {dist.count} ({totalAttempts > 0 ? ((dist.count / totalAttempts) * 100).toFixed(0) : 0}%)
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Question-wise Analysis</CardTitle>
                  <CardDescription>Performance breakdown by question</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {questionAnalysis.map((qa, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="flex items-center gap-2 min-w-[100px]">
                          <Badge variant="outline">Q{qa.questionNum}</Badge>
                          <Badge variant={
                            qa.difficulty === 'easy' ? 'secondary' : 
                            qa.difficulty === 'hard' ? 'destructive' : 'default'
                          }>
                            {qa.difficulty}
                          </Badge>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-500 ${
                                  qa.accuracy >= 70 ? 'bg-green-500' :
                                  qa.accuracy >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${qa.accuracy}%` }}
                              />
                            </div>
                            <div className="w-20 text-sm font-medium text-right">
                              {qa.accuracy}%
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {qa.attempts} attempts
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Performers</CardTitle>
                  <CardDescription>Highest scoring students</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topPerformers.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">No attempts yet</p>
                    ) : (
                      topPerformers.map((item, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 border rounded-lg">
                          <div className="flex items-center gap-3 min-w-[60px]">
                            <Badge variant={i < 3 ? 'default' : 'outline'}>#{i + 1}</Badge>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{item.student?.name || 'Unknown Student'}</p>
                            <p className="text-sm text-muted-foreground">{item.student?.email}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">{item.attempt.score}/{totalMarks}</p>
                            <p className="text-xs text-muted-foreground">
                              {((item.attempt.score || 0) / totalMarks * 100).toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default QuizReport;
