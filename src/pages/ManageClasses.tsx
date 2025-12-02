import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "@/lib/storage";
import { User, SchoolClass } from "@/types";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Users, GraduationCap, School } from "lucide-react";
import { toast } from "sonner";

const ManageClasses = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<SchoolClass | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      navigate("/login");
      return;
    }
    setUser(currentUser);
    loadData();
  }, [navigate]);

  const loadData = () => {
    setClasses(storage.getClasses());
    const allUsers = storage.getAllUsers();
    setStudents(allUsers.filter(u => u.role === 'student'));
    setTeachers(allUsers.filter(u => u.role === 'teacher'));
  };

  const handleCreateClass = () => {
    if (!formData.name.trim()) {
      toast.error("Class name is required");
      return;
    }

    const newClass: SchoolClass = {
      id: `class_${Date.now()}`,
      name: formData.name,
      description: formData.description,
      createdBy: user!.id,
      createdAt: new Date().toISOString(),
    };

    storage.addClass(newClass);
    toast.success("Class created successfully");
    setIsCreateOpen(false);
    setFormData({ name: '', description: '' });
    loadData();
  };

  const handleEditClass = () => {
    if (!selectedClass || !formData.name.trim()) return;

    storage.updateClass(selectedClass.id, {
      name: formData.name,
      description: formData.description,
    });
    toast.success("Class updated successfully");
    setIsEditOpen(false);
    setSelectedClass(null);
    setFormData({ name: '', description: '' });
    loadData();
  };

  const handleDeleteClass = (classId: string) => {
    if (!confirm("Are you sure? This will unassign all students and teachers from this class.")) return;

    // Unassign students from this class
    students.filter(s => s.classId === classId).forEach(s => {
      storage.updateUser(s.id, { classId: undefined });
    });

    // Remove class from teachers
    teachers.forEach(t => {
      if (t.classes?.includes(classId)) {
        storage.updateUser(t.id, { classes: t.classes.filter(c => c !== classId) });
      }
    });

    storage.deleteClass(classId);
    toast.success("Class deleted successfully");
    loadData();
  };

  const handleAssignStudent = (studentId: string, classId: string) => {
    storage.updateUser(studentId, { classId: classId || undefined });
    toast.success("Student assigned successfully");
    loadData();
  };

  const handleToggleTeacherClass = (teacherId: string, classId: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) return;

    const currentClasses = teacher.classes || [];
    const newClasses = currentClasses.includes(classId)
      ? currentClasses.filter(c => c !== classId)
      : [...currentClasses, classId];

    storage.updateUser(teacherId, { classes: newClasses });
    toast.success("Teacher assignment updated");
    loadData();
  };

  const getClassStudentCount = (classId: string) => {
    return students.filter(s => s.classId === classId).length;
  };

  const getClassTeacherCount = (classId: string) => {
    return teachers.filter(t => t.classes?.includes(classId)).length;
  };

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar user={user} />
        <div className="flex-1 flex flex-col">
          <header className="border-b bg-card shadow-sm sticky top-0 z-10">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <h1 className="text-xl font-bold">Manage Classes</h1>
              </div>
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Class
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Class</DialogTitle>
                    <DialogDescription>Add a new class to your school</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Class Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Class 1, Grade 10-A"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Optional description"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateClass}>Create Class</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </header>

          <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                  <School className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{classes.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{students.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
                  <GraduationCap className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{teachers.length}</div>
                </CardContent>
              </Card>
            </div>

            {/* Classes List */}
            <Card>
              <CardHeader>
                <CardTitle>All Classes</CardTitle>
                <CardDescription>Manage your school classes</CardDescription>
              </CardHeader>
              <CardContent>
                {classes.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No classes created yet. Create your first class to get started.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Class Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Teachers</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {classes.map((cls) => (
                        <TableRow key={cls.id}>
                          <TableCell className="font-medium">{cls.name}</TableCell>
                          <TableCell className="text-muted-foreground">{cls.description || '-'}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{getClassStudentCount(cls.id)} students</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{getClassTeacherCount(cls.id)} teachers</Badge>
                          </TableCell>
                          <TableCell>{new Date(cls.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedClass(cls);
                                  setFormData({ name: cls.name, description: cls.description || '' });
                                  setIsEditOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteClass(cls.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Student Assignments */}
            <Card>
              <CardHeader>
                <CardTitle>Student Class Assignments</CardTitle>
                <CardDescription>Assign students to classes (each student can belong to one class)</CardDescription>
              </CardHeader>
              <CardContent>
                {students.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No students registered yet.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Current Class</TableHead>
                        <TableHead>Assign Class</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>
                            {student.classId ? (
                              <Badge>{classes.find(c => c.id === student.classId)?.name || 'Unknown'}</Badge>
                            ) : (
                              <span className="text-muted-foreground">Not assigned</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={student.classId || "none"}
                              onValueChange={(value) => handleAssignStudent(student.id, value === "none" ? "" : value)}
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue placeholder="Select class" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">No Class</SelectItem>
                                {classes.map((cls) => (
                                  <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Teacher Assignments */}
            <Card>
              <CardHeader>
                <CardTitle>Teacher Class Assignments</CardTitle>
                <CardDescription>Assign teachers to classes (teachers can belong to multiple classes)</CardDescription>
              </CardHeader>
              <CardContent>
                {teachers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No teachers registered yet.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Teacher Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Assigned Classes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teachers.map((teacher) => (
                        <TableRow key={teacher.id}>
                          <TableCell className="font-medium">{teacher.name}</TableCell>
                          <TableCell>{teacher.email}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-2">
                              {classes.map((cls) => (
                                <Badge
                                  key={cls.id}
                                  variant={teacher.classes?.includes(cls.id) ? "default" : "outline"}
                                  className="cursor-pointer"
                                  onClick={() => handleToggleTeacherClass(teacher.id, cls.id)}
                                >
                                  {cls.name}
                                </Badge>
                              ))}
                              {classes.length === 0 && (
                                <span className="text-muted-foreground">No classes available</span>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Class</DialogTitle>
                  <DialogDescription>Update class details</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-name">Class Name *</Label>
                    <Input
                      id="edit-name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                  <Button onClick={handleEditClass}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ManageClasses;