import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "@/lib/storage";
import { User, UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, UserCog, Users as UsersIcon, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const ManageUsers = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  // New user form state
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState<UserRole>("student");
  const [newUserPhone, setNewUserPhone] = useState("");
  const [newUserDOB, setNewUserDOB] = useState("");
  const [newUserDepartment, setNewUserDepartment] = useState("");
  const [newUserEnrollment, setNewUserEnrollment] = useState("");

  useEffect(() => {
    const user = storage.getCurrentUser();
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "admin") {
      navigate("/dashboard");
      toast.error("Access denied");
      return;
    }
    setCurrentUser(user);
    loadUsers();
  }, [navigate]);

  const loadUsers = () => {
    const allUsers = storage.getAllUsers();
    setUsers(allUsers);
    setFilteredUsers(allUsers);
  };

  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter(u => u.role === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, users]);

  const getRoleBadgeVariant = (role: UserRole) => {
    switch(role) {
      case 'admin': return 'destructive';
      case 'teacher': return 'default';
      case 'student': return 'secondary';
    }
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      storage.deleteUser(userId);
      toast.success(`${userName} has been deleted`);
      loadUsers();
    }
  };

  const handleChangeRole = (userId: string, newRole: UserRole) => {
    storage.updateUser(userId, { role: newRole });
    toast.success("User role updated");
    loadUsers();
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const resetForm = () => {
    setNewUserName("");
    setNewUserEmail("");
    setNewUserPassword("");
    setNewUserRole("student");
    setNewUserPhone("");
    setNewUserDOB("");
    setNewUserDepartment("");
    setNewUserEnrollment("");
  };

  const handleAddUser = () => {
    // Validation
    if (!newUserName.trim()) {
      toast.error("Please enter user name");
      return;
    }
    if (!newUserEmail.trim()) {
      toast.error("Please enter email address");
      return;
    }
    if (!validateEmail(newUserEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!newUserPassword || newUserPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // Check for duplicate email
    const existingUser = storage.getUserByEmail(newUserEmail);
    if (existingUser) {
      toast.error("A user with this email already exists");
      return;
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name: newUserName.trim(),
      email: newUserEmail.trim().toLowerCase(),
      role: newUserRole,
      phoneNumber: newUserPhone.trim() || undefined,
      dateOfBirth: newUserDOB || undefined,
      department: newUserDepartment.trim() || undefined,
      enrollmentNumber: newUserEnrollment.trim() || undefined,
    };

    storage.addUser(newUser);
    toast.success(`${newUser.name} has been added as ${newUser.role}`);
    loadUsers();
    resetForm();
    setShowAddDialog(false);
  };

  if (!currentUser) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar user={currentUser} />
        <div className="flex-1 flex flex-col">
          <header className="border-b bg-card shadow-sm sticky top-0 z-10">
            <div className="container mx-auto px-4 py-4 flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-bold">Manage Users</h1>
            </div>
          </header>

          <main className="flex-1 container mx-auto px-4 py-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
                <p className="text-muted-foreground mt-1">
                  Manage all platform users and their roles
                </p>
              </div>
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button size="lg">
                    <UserPlus className="mr-2 h-5 w-5" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                      Create a new user account. All required fields must be filled.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          placeholder="Enter full name"
                          value={newUserName}
                          onChange={(e) => setNewUserName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="email@example.com"
                          value={newUserEmail}
                          onChange={(e) => setNewUserEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="password">Password *</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Min 6 characters"
                          value={newUserPassword}
                          onChange={(e) => setNewUserPassword(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role *</Label>
                        <Select value={newUserRole} onValueChange={(v: UserRole) => setNewUserRole(v)}>
                          <SelectTrigger id="role">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="teacher">Teacher</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="(Optional)"
                          value={newUserPhone}
                          onChange={(e) => setNewUserPhone(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input
                          id="dob"
                          type="date"
                          value={newUserDOB}
                          onChange={(e) => setNewUserDOB(e.target.value)}
                        />
                      </div>
                    </div>

                    {newUserRole === 'teacher' && (
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          placeholder="e.g., Computer Science"
                          value={newUserDepartment}
                          onChange={(e) => setNewUserDepartment(e.target.value)}
                        />
                      </div>
                    )}

                    {newUserRole === 'student' && (
                      <div className="space-y-2">
                        <Label htmlFor="enrollment">Enrollment Number</Label>
                        <Input
                          id="enrollment"
                          placeholder="e.g., 2024001"
                          value={newUserEnrollment}
                          onChange={(e) => setNewUserEnrollment(e.target.value)}
                        />
                      </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                      <Button variant="outline" onClick={() => {
                        resetForm();
                        setShowAddDialog(false);
                      }}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddUser}>
                        Create User
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="mb-6 flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={(v: any) => setRoleFilter(v)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4">
              {filteredUsers.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <UsersIcon className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No users found</h3>
                    <p className="text-muted-foreground text-center max-w-md">
                      Try adjusting your search or filter criteria
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredUsers.map((user) => (
                  <Card key={user.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={user.profilePhoto} alt={user.name} />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="mb-1">{user.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={getRoleBadgeVariant(user.role)}>
                            {user.role}
                          </Badge>
                          {user.role !== 'admin' && (
                            <>
                              <Select value={user.role} onValueChange={(newRole: UserRole) => handleChangeRole(user.id, newRole)}>
                                <SelectTrigger className="w-[120px] h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="student">Student</SelectItem>
                                  <SelectItem value="teacher">Teacher</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteUser(user.id, user.name)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        {user.phoneNumber && (
                          <div>
                            <div className="text-muted-foreground mb-1">Phone</div>
                            <div className="font-medium">{user.phoneNumber}</div>
                          </div>
                        )}
                        {user.dateOfBirth && (
                          <div>
                            <div className="text-muted-foreground mb-1">Date of Birth</div>
                            <div className="font-medium">{new Date(user.dateOfBirth).toLocaleDateString()}</div>
                          </div>
                        )}
                        {user.enrollmentNumber && (
                          <div>
                            <div className="text-muted-foreground mb-1">Enrollment #</div>
                            <div className="font-medium">{user.enrollmentNumber}</div>
                          </div>
                        )}
                        {user.department && (
                          <div>
                            <div className="text-muted-foreground mb-1">Department</div>
                            <div className="font-medium">{user.department}</div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ManageUsers;
