import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "@/lib/storage";
import { User, QuizAttempt, Quiz, Course } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Award, CheckCircle, Lock } from "lucide-react";
import Certificate from "@/components/Certificate";

interface CourseProgress {
  course: Course;
  totalQuizzes: number;
  completedQuizzes: number;
  averageScore: number;
  isEligible: boolean;
  instructorName: string;
}

const Certificates = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseProgress | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);

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
    loadProgress(currentUser);
  }, [navigate]);

  const loadProgress = (currentUser: User) => {
    const allCourses = storage.getCourses();
    const allQuizzes = storage.getQuizzes();
    const allAttempts = storage.getAttempts();
    const allUsers = storage.getAllUsers();

    // Get enrolled courses
    const enrolledCourses = allCourses.filter(c => c.enrolledStudents.includes(currentUser.id));

    const progress: CourseProgress[] = enrolledCourses.map(course => {
      // Get quizzes for this course
      const courseQuizzes = allQuizzes.filter(q => q.courseId === course.id);
      
      // Get completed attempts for this course
      const completedAttempts = allAttempts.filter(
        a => a.studentId === currentUser.id && 
        a.submittedAt && 
        courseQuizzes.some(q => q.id === a.quizId)
      );

      // Calculate unique completed quizzes
      const completedQuizIds = new Set(completedAttempts.map(a => a.quizId));
      
      // Calculate average score
      let totalScore = 0;
      let totalMarks = 0;
      completedAttempts.forEach(attempt => {
        const quiz = courseQuizzes.find(q => q.id === attempt.quizId);
        if (quiz) {
          totalScore += attempt.score || 0;
          totalMarks += quiz.questions.reduce((sum, q) => sum + q.marks, 0);
        }
      });
      
      const averageScore = totalMarks > 0 ? Math.round((totalScore / totalMarks) * 100) : 0;
      
      // Certificate eligibility: completed all quizzes with avg score >= 50%
      const isEligible = courseQuizzes.length > 0 && 
                         completedQuizIds.size >= courseQuizzes.length && 
                         averageScore >= 50;

      // Get instructor name
      const instructor = allUsers.find(u => u.id === course.createdBy);

      return {
        course,
        totalQuizzes: courseQuizzes.length,
        completedQuizzes: completedQuizIds.size,
        averageScore,
        isEligible,
        instructorName: instructor?.name || "Course Instructor",
      };
    });

    setCourseProgress(progress);
  };

  const handleViewCertificate = (progress: CourseProgress) => {
    setSelectedCourse(progress);
    setShowCertificate(true);
  };

  if (!user) return null;

  const eligibleCount = courseProgress.filter(p => p.isEligible).length;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar user={user} />
        <div className="flex-1 flex flex-col">
          <header className="border-b bg-card shadow-sm sticky top-0 z-10">
            <div className="container mx-auto px-4 py-4 flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-bold">Certificates</h1>
            </div>
          </header>

          <main className="flex-1 container mx-auto px-4 py-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Award className="h-8 w-8 text-warning" />
                My Certificates
              </h2>
              <p className="text-muted-foreground mt-1">
                Complete all quizzes in a course with at least 50% average to earn a certificate
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-primary">{eligibleCount}</p>
                    <p className="text-sm text-muted-foreground mt-1">Certificates Earned</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-warning">{courseProgress.length - eligibleCount}</p>
                    <p className="text-sm text-muted-foreground mt-1">In Progress</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-accent">{courseProgress.length}</p>
                    <p className="text-sm text-muted-foreground mt-1">Total Courses</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Course List */}
            {courseProgress.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Award className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No courses enrolled</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    Enroll in courses and complete quizzes to earn certificates.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courseProgress.map(progress => (
                  <Card key={progress.course.id} className={progress.isEligible ? "border-success/50 bg-success/5" : ""}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{progress.course.title}</CardTitle>
                          <CardDescription className="mt-1">{progress.course.description}</CardDescription>
                        </div>
                        {progress.isEligible ? (
                          <Badge className="bg-success text-success-foreground">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Earned
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <Lock className="h-3 w-3 mr-1" />
                            Locked
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Progress bar */}
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Quiz Progress</span>
                            <span className="font-medium">{progress.completedQuizzes}/{progress.totalQuizzes}</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all"
                              style={{ width: `${progress.totalQuizzes > 0 ? (progress.completedQuizzes / progress.totalQuizzes) * 100 : 0}%` }}
                            />
                          </div>
                        </div>

                        {/* Average score */}
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Average Score</span>
                          <Badge variant={progress.averageScore >= 50 ? "default" : "destructive"}>
                            {progress.averageScore}%
                          </Badge>
                        </div>

                        {/* Requirements */}
                        {!progress.isEligible && (
                          <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                            {progress.completedQuizzes < progress.totalQuizzes && (
                              <p>• Complete {progress.totalQuizzes - progress.completedQuizzes} more quiz(es)</p>
                            )}
                            {progress.averageScore < 50 && progress.completedQuizzes > 0 && (
                              <p>• Achieve at least 50% average score</p>
                            )}
                          </div>
                        )}

                        {/* Action button */}
                        <Button 
                          className="w-full" 
                          variant={progress.isEligible ? "default" : "secondary"}
                          disabled={!progress.isEligible}
                          onClick={() => handleViewCertificate(progress)}
                        >
                          {progress.isEligible ? (
                            <>
                              <Award className="h-4 w-4 mr-2" />
                              View Certificate
                            </>
                          ) : (
                            <>
                              <Lock className="h-4 w-4 mr-2" />
                              Complete to Unlock
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Certificate Dialog */}
      <Dialog open={showCertificate} onOpenChange={setShowCertificate}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Course Completion Certificate</DialogTitle>
          </DialogHeader>
          {selectedCourse && (
            <Certificate
              studentName={user.name}
              courseName={selectedCourse.course.title}
              completionDate={new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              score={selectedCourse.averageScore}
              instructorName={selectedCourse.instructorName}
            />
          )}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default Certificates;