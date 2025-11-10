import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "@/lib/storage";
import { User, QuizAttempt, Quiz } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle2, XCircle, Clock } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const MyResults = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [attempts, setAttempts] = useState<(QuizAttempt & { quiz: Quiz })[]>([]);

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
    loadAttempts(currentUser);
  }, [navigate]);

  const loadAttempts = (currentUser: User) => {
    const allAttempts = storage.getAttempts();
    const userAttempts = allAttempts.filter(a => a.studentId === currentUser.id);
    
    const attemptsWithQuiz = userAttempts.map(attempt => {
      const quiz = storage.getQuizById(attempt.quizId);
      return { ...attempt, quiz: quiz! };
    }).filter(a => a.quiz);

    setAttempts(attemptsWithQuiz);
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
              <h1 className="text-xl font-bold">My Results</h1>
            </div>
          </header>

          <main className="flex-1 container mx-auto px-4 py-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight">My Quiz Results</h2>
              <p className="text-muted-foreground mt-1">
                View your performance across all attempted quizzes
              </p>
            </div>

            {attempts.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No results yet</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    You haven't completed any quizzes yet. Start taking quizzes to see your results here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {attempts.map((attempt) => {
                  const totalMarks = attempt.quiz.questions.reduce((sum, q) => sum + q.marks, 0);
                  const percentage = attempt.score ? Math.round((attempt.score / totalMarks) * 100) : 0;
                  const isCompleted = !!attempt.submittedAt;

                  return (
                    <Card key={attempt.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="mb-1">{attempt.quiz.title}</CardTitle>
                            <CardDescription>{attempt.quiz.description}</CardDescription>
                            <div className="flex gap-4 mt-3 text-sm">
                              <span className="text-muted-foreground">
                                Attempted: {new Date(attempt.startedAt).toLocaleDateString()}
                              </span>
                              {isCompleted && attempt.submittedAt && (
                                <span className="text-muted-foreground">
                                  Submitted: {new Date(attempt.submittedAt).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            {isCompleted ? (
                              <>
                                <div className="text-3xl font-bold text-primary">
                                  {percentage}%
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">
                                  {attempt.score}/{totalMarks} marks
                                </div>
                                <Badge 
                                  variant={percentage >= 70 ? "default" : percentage >= 50 ? "secondary" : "destructive"}
                                  className="mt-2"
                                >
                                  {percentage >= 70 ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                                  {percentage >= 70 ? "Passed" : percentage >= 50 ? "Average" : "Failed"}
                                </Badge>
                              </>
                            ) : (
                              <Badge variant="outline">
                                <Clock className="h-3 w-3 mr-1" />
                                In Progress
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground mb-1">Total Questions</div>
                            <div className="font-medium">{attempt.quiz.questions.length}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground mb-1">Attempted</div>
                            <div className="font-medium">{attempt.attemptedQuestions.length}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground mb-1">Marked for Review</div>
                            <div className="font-medium">{attempt.markedForReview.length}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MyResults;
