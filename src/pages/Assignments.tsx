import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '@/lib/storage';
import { Assignment, Submission, Course, User } from '@/types';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, FileText, Calendar, Users, Eye, Trash2, Upload } from 'lucide-react';

export default function Assignments() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [maxMarks, setMaxMarks] = useState('100');
  const [allowLate, setAllowLate] = useState(true);
  const [attachments, setAttachments] = useState<any[]>([]);

  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (currentUser.role === 'student') {
      navigate('/student-assignments');
      return;
    }
    setUser(currentUser);
    loadData();
  }, [navigate]);

  const loadData = () => {
    const allAssignments = storage.getAssignments();
    const allCourses = storage.getCourses();
    const allSubmissions = storage.getSubmissions();
    const currentUser = storage.getCurrentUser();

    if (currentUser?.role === 'teacher') {
      const teacherCourses = allCourses.filter(c => c.createdBy === currentUser.id);
      setCourses(teacherCourses);
      const courseIds = teacherCourses.map(c => c.id);
      setAssignments(allAssignments.filter((a: Assignment) => courseIds.includes(a.courseId)));
    } else {
      setCourses(allCourses);
      setAssignments(allAssignments);
    }
    setSubmissions(allSubmissions);
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

  const handleCreateAssignment = () => {
    if (!selectedCourse || !title || !dueDate) {
      toast.error('Please fill all required fields');
      return;
    }

    const newAssignment: Assignment = {
      id: Date.now().toString(),
      title,
      description,
      courseId: selectedCourse,
      createdBy: user!.id,
      createdAt: new Date().toISOString(),
      dueDate,
      maxMarks: parseInt(maxMarks),
      attachments: attachments.length > 0 ? attachments : undefined,
      allowLateSubmission: allowLate,
    };

    storage.addAssignment(newAssignment);
    toast.success('Assignment created successfully');
    resetForm();
    setShowCreateDialog(false);
    loadData();
  };

  const resetForm = () => {
    setSelectedCourse('');
    setTitle('');
    setDescription('');
    setDueDate('');
    setMaxMarks('100');
    setAllowLate(true);
    setAttachments([]);
  };

  const handleDeleteAssignment = (id: string) => {
    if (confirm('Are you sure you want to delete this assignment?')) {
      storage.deleteAssignment(id);
      toast.success('Assignment deleted');
      loadData();
    }
  };

  const getSubmissionStats = (assignmentId: string) => {
    const assignmentSubmissions = submissions.filter((s: Submission) => s.assignmentId === assignmentId);
    const course = courses.find(c => 
      assignments.find((a: Assignment) => a.id === assignmentId)?.courseId === c.id
    );
    const totalStudents = course?.enrolledStudents.length || 0;
    return {
      submitted: assignmentSubmissions.length,
      pending: totalStudents - assignmentSubmissions.length,
      graded: assignmentSubmissions.filter((s: Submission) => s.grade !== undefined).length,
    };
  };

  if (!user) return null;

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <main className="flex-1 w-full p-6">
        <div className="flex items-center gap-4 mb-6">
          <SidebarTrigger />
          <h1 className="text-3xl font-bold text-foreground">Assignments</h1>
        </div>

        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">Manage and grade student assignments</p>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Assignment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Assignment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Course *</Label>
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map(course => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Title *</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Due Date *</Label>
                    <Input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                  </div>
                  <div>
                    <Label>Max Marks *</Label>
                    <Input type="number" value={maxMarks} onChange={(e) => setMaxMarks(e.target.value)} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="allowLate"
                    checked={allowLate}
                    onChange={(e) => setAllowLate(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="allowLate">Allow late submissions</Label>
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
                <Button onClick={handleCreateAssignment} className="w-full">
                  Create Assignment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {assignments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No assignments yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {assignments.map((assignment: Assignment) => {
              const course = courses.find(c => c.id === assignment.courseId);
              const stats = getSubmissionStats(assignment.id);
              const isPastDue = new Date(assignment.dueDate) < new Date();

              return (
                <Card key={assignment.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{assignment.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {course?.title}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/assignment-submissions/${assignment.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Submissions
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteAssignment(assignment.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{assignment.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Due Date</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(assignment.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Submitted</p>
                          <p className="text-sm text-muted-foreground">
                            {stats.submitted} / {stats.submitted + stats.pending}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Max Marks</p>
                        <p className="text-sm text-muted-foreground">{assignment.maxMarks}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Status</p>
                        <Badge variant={isPastDue ? 'destructive' : 'default'}>
                          {isPastDue ? 'Past Due' : 'Active'}
                        </Badge>
                      </div>
                    </div>
                    {assignment.attachments && assignment.attachments.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Attachments:</p>
                        <div className="flex flex-wrap gap-2">
                          {assignment.attachments.map(att => (
                            <Badge key={att.id} variant="outline">
                              <FileText className="h-3 w-3 mr-1" />
                              {att.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </SidebarProvider>
  );
}