import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { storage } from "@/lib/storage";
import { User, Quiz, QuizAttempt } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy, Target, TrendingUp, Award } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const StudentResults = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [rank, setRank] = useState<number>(0);
  const [totalStudents, setTotalStudents] = useState<number>(0);

  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setUser(currentUser);

    if (quizId) {
      const quizData = storage.getQuizById(quizId);
      if (quizData) {
        setQuiz(quizData);
        
        const userAttempt = storage.getAttempts()
          .filter(a => a.quizId === quizId && a.studentId === currentUser.id && a.submittedAt)
          .sort((a, b) => (b.score || 0) - (a.score || 0))[0];
        
        if (userAttempt) {
          setAttempt(userAttempt);
          
          const allAttempts = storage.getAttempts()
            .filter(a => a.quizId === quizId && a.submittedAt)
            .sort((a, b) => (b.score || 0) - (a.score || 0));
          
          const userRank = allAttempts.findIndex(a => a.id === userAttempt.id) + 1;
          setRank(userRank);
          setTotalStudents(allAttempts.length);
        }
      }
    }
  }, [navigate, quizId]);

  if (!user || !quiz || !attempt) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar user={user!} />
          <div className="flex-1 flex items-center justify-center">
            <Card>
              <CardContent className="py-16 px-8 text-center">
                <p className="text-muted-foreground">No results found for this quiz</p>
                <Button onClick={() => navigate(-1)} className="mt-4">
                  Go Back
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  const totalMarks = quiz.questions.reduce((sum, q) => sum + q.marks, 0);
  const percentage = ((attempt.score || 0) / totalMarks * 100).toFixed(2);
  const isPassed = parseFloat(percentage) >= 40;
  const correctAnswers = quiz.questions.filter(q => {
    const userAnswer = attempt.answers[q.id];
    if (q.type === 'single-correct') {
      return userAnswer === q.correctAnswer;
    } else if (q.type === 'multi-correct') {
      const correct = q.correctAnswer as string[];
      return JSON.stringify(userAnswer?.sort()) === JSON.stringify(correct.sort());
    } else if (q.type === 'numerical') {
      return parseFloat(userAnswer) === q.correctAnswer;
    }
    return false;
  }).length;

  const getRankBadge = () => {
    if (rank === 1) return <Badge className="text-lg px-4 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600">🏆 1st Place</Badge>;
    if (rank === 2) return <Badge className="text-lg px-4 py-1 bg-gradient-to-r from-gray-300 to-gray-500">🥈 2nd Place</Badge>;
    if (rank === 3) return <Badge className="text-lg px-4 py-1 bg-gradient-to-r from-orange-400 to-orange-600">🥉 3rd Place</Badge>;
    return <Badge className="text-lg px-4 py-1" variant="secondary">Rank #{rank}</Badge>;
  };

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
              <h1 className="text-xl font-bold">Quiz Results</h1>
            </div>
          </header>

          <main className="flex-1 container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto space-y-6">
              <Card className="border-2 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader className="text-center pb-2">
                  <div className="flex justify-center mb-4">
                    {isPassed ? (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                        <Trophy className="h-12 w-12 text-white" />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                        <Target className="h-12 w-12 text-white" />
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-3xl mb-2">{quiz.title}</CardTitle>
                  <CardDescription className="text-lg">
                    {isPassed ? '🎉 Congratulations! You passed!' : '📚 Keep practicing to improve!'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  <div className="flex justify-center">
                    {getRankBadge()}
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-6 bg-background rounded-lg border-2">
                      <div className="text-4xl font-bold text-primary mb-2">
                        {attempt.score}/{totalMarks}
                      </div>
                      <p className="text-sm text-muted-foreground">Your Score</p>
                    </div>
                    
                    <div className="p-6 bg-background rounded-lg border-2">
                      <div className="text-4xl font-bold text-primary mb-2">
                        {percentage}%
                      </div>
                      <p className="text-sm text-muted-foreground">Percentage</p>
                    </div>
                    
                    <div className="p-6 bg-background rounded-lg border-2">
                      <div className="text-4xl font-bold text-primary mb-2">
                        {rank}/{totalStudents}
                      </div>
                      <p className="text-sm text-muted-foreground">Your Rank</p>
                    </div>
                  </div>

                  <div className="p-6 bg-background rounded-lg border">
                    <div className="flex items-center justify-center gap-8 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span>Correct: {correctAnswers}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span>Wrong: {attempt.attemptedQuestions.length - correctAnswers}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-400" />
                        <span>Unattempted: {quiz.questions.length - attempt.attemptedQuestions.length}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Questions Attempted</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {attempt.attemptedQuestions.length}/{quiz.questions.length}
                    </div>
                    <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${(attempt.attemptedQuestions.length / quiz.questions.length) * 100}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {attempt.attemptedQuestions.length > 0 
                        ? ((correctAnswers / attempt.attemptedQuestions.length) * 100).toFixed(1)
                        : 0}%
                    </div>
                    <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{ 
                          width: attempt.attemptedQuestions.length > 0 
                            ? `${(correctAnswers / attempt.attemptedQuestions.length) * 100}%` 
                            : '0%' 
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Performance Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {parseFloat(percentage) >= 80 && (
                    <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                      <p className="font-medium text-green-900 dark:text-green-100">Outstanding Performance! 🌟</p>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        You've demonstrated excellent understanding of the material. Keep up the great work!
                      </p>
                    </div>
                  )}
                  
                  {parseFloat(percentage) >= 60 && parseFloat(percentage) < 80 && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <p className="font-medium text-blue-900 dark:text-blue-100">Good Job! 👏</p>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        You have a solid grasp of the concepts. Review the missed questions to improve further.
                      </p>
                    </div>
                  )}
                  
                  {parseFloat(percentage) >= 40 && parseFloat(percentage) < 60 && (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <p className="font-medium text-yellow-900 dark:text-yellow-100">Room for Improvement 📈</p>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                        You passed, but there's potential to score higher. Focus on understanding weak areas.
                      </p>
                    </div>
                  )}
                  
                  {parseFloat(percentage) < 40 && (
                    <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="font-medium text-red-900 dark:text-red-100">Keep Practicing! 💪</p>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                        Don't give up! Review the material thoroughly and try again. Success comes with practice.
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Completed on: {new Date(attempt.submittedAt!).toLocaleString()}
                    </p>
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

export default StudentResults;
