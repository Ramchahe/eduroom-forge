import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "@/lib/storage";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Save, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setUser(currentUser);
    setName(currentUser.name);
    setEmail(currentUser.email);
    setPhoneNumber(currentUser.phoneNumber || "");
    setAddress(currentUser.address || "");
    setDateOfBirth(currentUser.dateOfBirth || "");
    setEnrollmentNumber(currentUser.enrollmentNumber || "");
    setDepartment(currentUser.department || "");
    setProfilePhoto(currentUser.profilePhoto || "");
  }, [navigate]);

  const handleSave = () => {
    if (!user) return;

    const updates: Partial<User> = {
      name,
      phoneNumber,
      address,
      dateOfBirth,
      profilePhoto,
    };

    if (user.role === 'student') {
      updates.enrollmentNumber = enrollmentNumber;
    } else if (user.role === 'teacher' || user.role === 'admin') {
      updates.department = department;
    }

    storage.updateUser(user.id, updates);
    setUser({ ...user, ...updates });
    toast.success("Profile updated successfully!");
  };

  const handleImagePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (event) => {
            setProfilePhoto(event.target?.result as string);
          };
          reader.readAsDataURL(blob);
        }
      }
    }
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
              <h1 className="text-xl font-bold">My Profile</h1>
            </div>
          </header>

          <main className="flex-1 container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto space-y-6">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Profile Settings</h2>
                <p className="text-muted-foreground mt-1">
                  Manage your account information and preferences
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profilePhoto} />
                      <AvatarFallback className="text-2xl">
                        {name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Label>Profile Photo</Label>
                      <Input 
                        value={profilePhoto}
                        onChange={(e) => setProfilePhoto(e.target.value)}
                        onPaste={handleImagePaste}
                        placeholder="Paste image or enter URL"
                        className="mt-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        You can paste an image directly or enter an image URL
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Full Name *</Label>
                      <Input 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label>Email Address *</Label>
                      <Input 
                        value={email} 
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Phone Number</Label>
                      <Input 
                        value={phoneNumber} 
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <Label>Date of Birth</Label>
                      <Input 
                        type="date"
                        value={dateOfBirth} 
                        onChange={(e) => setDateOfBirth(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Address</Label>
                    <Input 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your address"
                    />
                  </div>

                  {user.role === 'student' && (
                    <div>
                      <Label>Enrollment Number</Label>
                      <Input 
                        value={enrollmentNumber} 
                        onChange={(e) => setEnrollmentNumber(e.target.value)}
                        placeholder="Enter your enrollment number"
                      />
                    </div>
                  )}

                  {(user.role === 'teacher' || user.role === 'admin') && (
                    <div>
                      <Label>Department</Label>
                      <Input 
                        value={department} 
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="Enter your department"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Your account details and role</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <UserIcon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Account Role</p>
                        <p className="text-sm text-muted-foreground">Your access level in the system</p>
                      </div>
                    </div>
                    <Badge className="capitalize" variant={
                      user.role === 'admin' ? 'default' : 
                      user.role === 'teacher' ? 'secondary' : 'outline'
                    }>
                      {user.role}
                    </Badge>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Member since: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Button onClick={handleSave} size="lg" className="w-full">
                <Save className="mr-2 h-5 w-5" />
                Save Changes
              </Button>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Profile;
