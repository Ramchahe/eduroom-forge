import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { storage } from "@/lib/storage";
import { User, Course, Quiz } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, PlayCircle, Clock, FileText, CheckCircle2 } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const StudentCourseView = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attemptedQuizIds, setAttemptedQuizIds] = useState<Set<string>>(new Set());

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

    if (!courseId) return;

    const foundCourse = storage.getCourseById(courseId);
    if (!foundCourse) {
      navigate("/student-dashboard");
      return;
    }

    // Check if student is enrolled
    if (!foundCourse.enrolledStudents.includes(currentUser.id)) {
      navigate("/student-dashboard");
      return;
    }

    setUser(currentUser);
    setCourse(foundCourse);

    const allQuizzes = storage.getQuizzes();
    const courseQuizzes = allQuizzes.filter(q => foundCourse.quizzes.includes(q.id));
    setQuizzes(courseQuizzes);

    // Get attempted quizzes
    const allAttempts = storage.getAttempts();
    const userAttempts = allAttempts.filter(a => a.studentId === currentUser.id);
    const attempted = new Set(userAttempts.map(a => a.quizId));
    setAttemptedQuizIds(attempted);
  }, [courseId, navigate]);

  const handleStartQuiz = (quizId: string) => {
    window.open(`/quiz-preview/${quizId}`, '_blank');
  };

  if (!user || !course) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar user={user} />
        <div className="flex-1 flex flex-col">
          <header className="border-b bg-card shadow-sm sticky top-0 z-10">
            <div className="container mx-auto px-4 py-4 flex items-center gap-4">
              <SidebarTrigger />
              <Button variant="ghost" size="sm" onClick={() => navigate("/student-dashboard")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Courses
              </Button>
            </div>
          </header>

          <main className="flex-1 container mx-auto px-4 py-8">
            <div className="mb-8">
              {course.thumbnail && (
                <div className="rounded-lg overflow-hidden mb-6 h-64 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                </div>
              )}
              <h1 className="text-3xl font-bold tracking-tight mb-2">{course.title}</h1>
              <p className="text-muted-foreground text-lg">{course.description}</p>
              <div className="flex gap-3 mt-4">
                <Badge variant={course.planType === 'free' ? 'secondary' : 'default'}>
                  {course.planType === 'free' ? 'Free' : `₹${course.discountedPrice || course.price}`}
                </Badge>
                {course.category && <Badge variant="outline">{course.category}</Badge>}
                {course.level && <Badge variant="outline">{course.level}</Badge>}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Available Quizzes</h2>
              <p className="text-muted-foreground">
                {quizzes.length} {quizzes.length === 1 ? 'quiz' : 'quizzes'} available in this course
              </p>
            </div>

            {quizzes.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No quizzes available</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    Your instructor hasn't added any quizzes yet. Check back later!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {quizzes.map((quiz) => {
                  const isAttempted = attemptedQuizIds.has(quiz.id);
                  const totalMarks = quiz.questions.reduce((sum, q) => sum + q.marks, 0);

                  return (
                    <Card key={quiz.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <CardTitle>{quiz.title}</CardTitle>
                              {isAttempted && (
                                <Badge variant="outline" className="text-green-600 border-green-600">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Attempted
                                </Badge>
                              )}
                            </div>
                            <CardDescription>{quiz.description}</CardDescription>
                            <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <FileText className="h-4 w-4" />
                                {quiz.questions.length} Questions
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {quiz.duration} Minutes
                              </span>
                              <span>{totalMarks} Marks</span>
                            </div>
                            {quiz.supportedLanguages.length > 1 && (
                              <div className="mt-2">
                                <Badge variant="secondary" className="mr-2">
                                  Multi-language support
                                </Badge>
                                {quiz.supportedLanguages.map(lang => (
                                  <Badge key={lang} variant="outline" className="mr-1 text-xs">
                                    {lang}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <Button onClick={() => handleStartQuiz(quiz.id)}>
                            <PlayCircle className="h-4 w-4 mr-2" />
                            {isAttempted ? 'Retake' : 'Start'} Quiz
                          </Button>
                        </div>
                      </CardHeader>
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

export default StudentCourseView;
