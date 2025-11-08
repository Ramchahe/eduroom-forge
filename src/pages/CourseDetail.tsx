import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { storage } from "@/lib/storage";
import { Course, Quiz } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, PlusCircle, Eye, Edit, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [deleteQuizId, setDeleteQuizId] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;
    
    const user = storage.getCurrentUser();
    if (!user) {
      navigate("/login");
      return;
    }

    const foundCourse = storage.getCourseById(courseId);
    if (!foundCourse) {
      toast.error("Course not found");
      navigate("/dashboard");
      return;
    }

    setCourse(foundCourse);
    
    const allQuizzes = storage.getQuizzes();
    const courseQuizzes = allQuizzes.filter(q => foundCourse.quizzes.includes(q.id));
    setQuizzes(courseQuizzes);
  }, [courseId, navigate]);

  const handleDeleteQuiz = (quizId: string) => {
    if (!course) return;
    
    storage.deleteQuiz(quizId);
    const updatedQuizzes = course.quizzes.filter(id => id !== quizId);
    storage.updateCourse(course.id, { quizzes: updatedQuizzes });
    
    setQuizzes(quizzes.filter(q => q.id !== quizId));
    setCourse({ ...course, quizzes: updatedQuizzes });
    setDeleteQuizId(null);
    toast.success("Quiz deleted successfully");
  };

  const handlePreviewQuiz = (quizId: string) => {
    window.open(`/quiz-preview/${quizId}`, '_blank');
  };

  if (!course) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">{course.title}</h1>
          <p className="text-muted-foreground">{course.description}</p>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Quizzes</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {quizzes.length} {quizzes.length === 1 ? 'quiz' : 'quizzes'} in this course
            </p>
          </div>
          <Button onClick={() => navigate(`/create-quiz/${courseId}`)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Quiz
          </Button>
        </div>

        {quizzes.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No quizzes yet</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Create your first quiz to start testing your students
              </p>
              <Button onClick={() => navigate(`/create-quiz/${courseId}`)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create First Quiz
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="mb-1">{quiz.title}</CardTitle>
                      <CardDescription>{quiz.description}</CardDescription>
                      <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
                        <span>{quiz.questions.length} Questions</span>
                        <span>{quiz.duration} Minutes</span>
                        <span>
                          {quiz.questions.reduce((acc, q) => acc + q.marks, 0)} Marks
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreviewQuiz(quiz.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/edit-quiz/${quiz.id}`)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteQuizId(quiz.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </main>

      <AlertDialog open={!!deleteQuizId} onOpenChange={() => setDeleteQuizId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the quiz and all its questions. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteQuizId && handleDeleteQuiz(deleteQuizId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CourseDetail;
