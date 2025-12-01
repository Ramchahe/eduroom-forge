import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { storage } from "@/lib/storage";
import { Course, Quiz, User, CourseMaterial } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, PlusCircle, Eye, Edit, Trash2, FileText, UserPlus, BarChart, Upload, Link as LinkIcon, Download } from "lucide-react";
import { toast } from "sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
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
  const [user, setUser] = useState<User | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [deleteQuizId, setDeleteQuizId] = useState<string | null>(null);
  const [showEnrollDialog, setShowEnrollDialog] = useState(false);
  const [showMaterialDialog, setShowMaterialDialog] = useState(false);
  const [students, setStudents] = useState<User[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  
  // Material upload state
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialDescription, setMaterialDescription] = useState('');
  const [materialType, setMaterialType] = useState<'pdf' | 'document' | 'video' | 'link'>('pdf');
  const [materialUrl, setMaterialUrl] = useState('');
  const [materialFile, setMaterialFile] = useState<File | null>(null);

  useEffect(() => {
    if (!courseId) return;
    
    const currentUser = storage.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setUser(currentUser);

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

    const allUsers = storage.getAllUsers();
    const allStudents = allUsers.filter(u => u.role === 'student');
    setStudents(allStudents);
    setSelectedStudents(foundCourse.enrolledStudents);

    // Load materials
    const allMaterials = storage.getMaterials();
    const courseMaterials = allMaterials.filter((m: any) => m.courseId === courseId);
    setMaterials(courseMaterials);
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

  const toggleStudentEnrollment = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const saveEnrollment = () => {
    if (!course) return;
    storage.updateCourse(course.id, { enrolledStudents: selectedStudents });
    setCourse({ ...course, enrolledStudents: selectedStudents });
    setShowEnrollDialog(false);
    toast.success("Enrollment updated successfully");
  };

  const handleUploadMaterial = async () => {
    if (!course || !user || !materialTitle) {
      toast.error('Please fill required fields');
      return;
    }

    let fileData = null;
    if (materialFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newMaterial: CourseMaterial = {
          id: Date.now().toString(),
          courseId: course.id,
          title: materialTitle,
          description: materialDescription,
          type: materialType,
          file: materialType !== 'link' ? {
            id: Date.now().toString(),
            name: materialFile!.name,
            type: materialFile!.type,
            data: e.target!.result as string,
            size: materialFile!.size,
          } : undefined,
          url: materialType === 'link' ? materialUrl : undefined,
          uploadedBy: user.id,
          uploadedAt: new Date().toISOString(),
        };
        
        storage.addMaterial(newMaterial);
        setMaterials([...materials, newMaterial]);
        toast.success('Material uploaded successfully');
        setShowMaterialDialog(false);
        resetMaterialForm();
      };
      reader.readAsDataURL(materialFile);
    } else if (materialType === 'link' && materialUrl) {
      const newMaterial: CourseMaterial = {
        id: Date.now().toString(),
        courseId: course.id,
        title: materialTitle,
        description: materialDescription,
        type: materialType,
        url: materialUrl,
        uploadedBy: user.id,
        uploadedAt: new Date().toISOString(),
      };
      storage.addMaterial(newMaterial);
      setMaterials([...materials, newMaterial]);
      toast.success('Link added successfully');
      setShowMaterialDialog(false);
      resetMaterialForm();
    } else {
      toast.error('Please provide a file or link');
    }
  };

  const resetMaterialForm = () => {
    setMaterialTitle('');
    setMaterialDescription('');
    setMaterialType('pdf');
    setMaterialUrl('');
    setMaterialFile(null);
  };

  const handleDeleteMaterial = (materialId: string) => {
    storage.deleteMaterial(materialId);
    setMaterials(materials.filter(m => m.id !== materialId));
    toast.success('Material deleted');
  };

  if (!course || !user) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar user={user} />
        <div className="flex-1 flex flex-col">
          <header className="border-b bg-card shadow-sm sticky top-0 z-10">
            <div className="container mx-auto px-4 py-4 flex items-center gap-4">
              <SidebarTrigger />
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </div>
          </header>

          <main className="flex-1 container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight mb-2">{course.title}</h1>
              <p className="text-muted-foreground">{course.description}</p>
              <div className="flex gap-2 mt-3">
                <Badge variant="outline">{course.enrolledStudents.length} Students Enrolled</Badge>
                {course.category && <Badge variant="outline">{course.category}</Badge>}
                {course.level && <Badge variant="outline">{course.level}</Badge>}
              </div>
            </div>

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Quizzes</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {quizzes.length} {quizzes.length === 1 ? 'quiz' : 'quizzes'} in this course
                </p>
              </div>
              <div className="flex gap-2">
                <Dialog open={showEnrollDialog} onOpenChange={setShowEnrollDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Manage Enrollment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Manage Student Enrollment</DialogTitle>
                      <DialogDescription>Select students to enroll in this course</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      {students.map((student) => (
                        <div key={student.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50">
                          <Checkbox
                            checked={selectedStudents.includes(student.id)}
                            onCheckedChange={() => toggleStudentEnrollment(student.id)}
                          />
                          <div className="flex-1">
                            <div className="font-medium">{student.name}</div>
                            <div className="text-sm text-muted-foreground">{student.email}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button onClick={saveEnrollment} className="w-full">Save Enrollment</Button>
                  </DialogContent>
                </Dialog>
                <Button onClick={() => navigate(`/create-quiz/${courseId}`)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Quiz
                </Button>
              </div>
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
                            onClick={() => navigate(`/quiz-report/${quiz.id}`)}
                          >
                            <BarChart className="h-4 w-4 mr-1" />
                            Report
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

            {/* Course Materials Section */}
            <div className="mt-12">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">Course Materials</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload PDFs, documents, videos or add links
                  </p>
                </div>
                <Dialog open={showMaterialDialog} onOpenChange={setShowMaterialDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Upload className="mr-2 h-4 w-4" />
                      Add Material
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Course Material</DialogTitle>
                      <DialogDescription>Upload files or add links for students</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Title *</Label>
                        <Input value={materialTitle} onChange={(e) => setMaterialTitle(e.target.value)} />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea value={materialDescription} onChange={(e) => setMaterialDescription(e.target.value)} />
                      </div>
                      <div>
                        <Label>Type</Label>
                        <Select value={materialType} onValueChange={(val: any) => setMaterialType(val)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="document">Document</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="link">Link</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {materialType === 'link' ? (
                        <div>
                          <Label>URL *</Label>
                          <Input type="url" value={materialUrl} onChange={(e) => setMaterialUrl(e.target.value)} placeholder="https://..." />
                        </div>
                      ) : (
                        <div>
                          <Label>File *</Label>
                          <Input type="file" onChange={(e) => setMaterialFile(e.target.files?.[0] || null)} />
                        </div>
                      )}
                      <Button onClick={handleUploadMaterial} className="w-full">
                        {materialType === 'link' ? 'Add Link' : 'Upload Material'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {materials.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No materials uploaded yet</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {materials.map((material) => (
                    <Card key={material.id}>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            {material.type === 'link' ? <LinkIcon className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                            {material.title}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteMaterial(material.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </CardTitle>
                        {material.description && (
                          <CardDescription>{material.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="text-xs text-muted-foreground">
                          Uploaded: {new Date(material.uploadedAt).toLocaleDateString()}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

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
      </SidebarProvider>
    );
  };

export default CourseDetail;
