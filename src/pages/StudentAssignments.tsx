import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '@/lib/storage';
import { Assignment, Submission, Course, User } from '@/types';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { FileText, Calendar, Upload, CheckCircle, Clock, AlertCircle, Download } from 'lucide-react';

export default function StudentAssignments() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<any[]>([]);

  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (currentUser.role !== 'student') {
      navigate('/assignments');
      return;
    }
    setUser(currentUser);
    loadData(currentUser);
  }, [navigate]);

  const loadData = (currentUser: User) => {
    const allCourses = storage.getCourses();
    const enrolledCourses = allCourses.filter((c: Course) => 
      c.enrolledStudents.includes(currentUser.id)
    );
    setCourses(enrolledCourses);

    const allAssignments = storage.getAssignments();
    const courseIds = enrolledCourses.map(c => c.id);
    const studentAssignments = allAssignments.filter((a: Assignment) => 
      courseIds.includes(a.courseId)
    );
    setAssignments(studentAssignments);

    const allSubmissions = storage.getSubmissions();
    const studentSubmissions = allSubmissions.filter((s: Submission) => 
      s.studentId === currentUser.id
    );
    setSubmissions(studentSubmissions);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: any[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      
      await new Promise((resolve) => {
        reader.onload = () => {
          newAttachments.push({
            id: Date.now().toString() + i,
            name: file.name,
            type: file.type,
            data: reader.result as string,
            size: file.size,
          });
          resolve(null);
        };
        reader.readAsDataURL(file);
      });
    }
    setAttachments([...attachments, ...newAttachments]);
  };

  const handleSubmit = () => {
    if (!selectedAssignment || !content.trim()) {
      toast.error('Please add submission content');
      return;
    }

    const submittedAt = new Date();
    const dueDate = new Date(selectedAssignment.dueDate);
    const isLate = submittedAt > dueDate;

    if (isLate && !selectedAssignment.allowLateSubmission) {
      toast.error('Late submissions are not allowed for this assignment');
      return;
    }

    const newSubmission: Submission = {
      id: Date.now().toString(),
      assignmentId: selectedAssignment.id,
      studentId: user!.id,
      submittedAt: submittedAt.toISOString(),
      isLate,
      content,
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    storage.addSubmission(newSubmission);
    toast.success(isLate ? 'Late submission recorded' : 'Assignment submitted successfully');
    setShowSubmitDialog(false);
    setSelectedAssignment(null);
    setContent('');
    setAttachments([]);
    loadData(user!);
  };

  const getSubmissionStatus = (assignment: Assignment) => {
    const submission = submissions.find((s: Submission) => s.assignmentId === assignment.id);
    const dueDate = new Date(assignment.dueDate);
    const now = new Date();

    if (submission) {
      if (submission.grade !== undefined) {
        return { status: 'graded', label: 'Graded', color: 'default', icon: CheckCircle };
      }
      return { status: 'submitted', label: 'Submitted', color: 'secondary', icon: CheckCircle };
    }

    if (now > dueDate) {
      return { status: 'overdue', label: 'Overdue', color: 'destructive', icon: AlertCircle };
    }

    return { status: 'pending', label: 'Pending', color: 'outline', icon: Clock };
  };

  const downloadFile = (file: any) => {
    const link = document.createElement('a');
    link.href = file.data;
    link.download = file.name;
    link.click();
  };

  if (!user) return null;

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <main className="flex-1 w-full p-6">
        <div className="flex items-center gap-4 mb-6">
          <SidebarTrigger />
          <h1 className="text-3xl font-bold text-foreground">My Assignments</h1>
        </div>

        {assignments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No assignments available</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {assignments.map((assignment: Assignment) => {
              const course = courses.find(c => c.id === assignment.courseId);
              const submission = submissions.find((s: Submission) => s.assignmentId === assignment.id);
              const status = getSubmissionStatus(assignment);
              const StatusIcon = status.icon;

              return (
                <Card key={assignment.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {assignment.title}
                          <Badge variant={status.color as any}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status.label}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {course?.title}
                        </CardDescription>
                      </div>
                      {!submission && (
                        <Button
                          onClick={() => {
                            setSelectedAssignment(assignment);
                            setShowSubmitDialog(true);
                          }}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Submit
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{assignment.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Due Date</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(assignment.dueDate).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Max Marks</p>
                        <p className="text-sm text-muted-foreground">{assignment.maxMarks}</p>
                      </div>
                      {submission?.grade !== undefined && (
                        <div>
                          <p className="text-sm font-medium">Your Grade</p>
                          <p className="text-sm font-semibold text-primary">
                            {submission.grade} / {assignment.maxMarks}
                          </p>
                        </div>
                      )}
                    </div>
                    {assignment.attachments && assignment.attachments.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Assignment Files:</p>
                        <div className="flex flex-wrap gap-2">
                          {assignment.attachments.map(att => (
                            <Button
                              key={att.id}
                              variant="outline"
                              size="sm"
                              onClick={() => downloadFile(att)}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              {att.name}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    {submission?.feedback && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium mb-1">Teacher Feedback:</p>
                        <p className="text-sm text-muted-foreground">{submission.feedback}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Submit Assignment: {selectedAssignment?.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Your Answer *</Label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  placeholder="Write your answer here..."
                />
              </div>
              <div>
                <Label>Attachments</Label>
                <Input type="file" multiple onChange={handleFileUpload} />
                {attachments.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {attachments.map(att => (
                      <div key={att.id} className="text-sm text-muted-foreground flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {att.name} ({(att.size / 1024).toFixed(2)} KB)
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button onClick={handleSubmit} className="w-full">
                Submit Assignment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </SidebarProvider>
  );
}