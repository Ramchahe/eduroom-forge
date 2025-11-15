import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '@/lib/storage';
import { Announcement, User } from '@/types';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Megaphone, Trash2, AlertCircle, FileText, Download, Eye } from 'lucide-react';

export default function Announcements() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');
  const [visibility, setVisibility] = useState<Announcement['visibility']>('all');
  const [attachments, setAttachments] = useState<any[]>([]);

  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    loadAnnouncements(currentUser);
  }, [navigate]);

  const loadAnnouncements = (currentUser: User) => {
    const allAnnouncements = storage.getAnnouncements();
    const filtered = allAnnouncements.filter((a: Announcement) => 
      a.visibility === 'all' || a.visibility === currentUser.role
    ).sort((a: Announcement, b: Announcement) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setAnnouncements(filtered);
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

  const handleCreateAnnouncement = () => {
    if (!title || !content) {
      toast.error('Please fill all required fields');
      return;
    }

    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      title,
      content,
      createdBy: user!.id,
      createdAt: new Date().toISOString(),
      priority,
      visibility,
      attachments: attachments.length > 0 ? attachments : undefined,
      readBy: [],
    };

    storage.addAnnouncement(newAnnouncement);
    toast.success('Announcement created successfully');
    resetForm();
    setShowCreateDialog(false);
    loadAnnouncements(user!);
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setPriority('normal');
    setVisibility('all');
    setAttachments([]);
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      storage.deleteAnnouncement(id);
      toast.success('Announcement deleted');
      loadAnnouncements(user!);
    }
  };

  const handleMarkAsRead = (announcement: Announcement) => {
    if (!announcement.readBy.includes(user!.id)) {
      storage.updateAnnouncement(announcement.id, {
        readBy: [...announcement.readBy, user!.id]
      });
      loadAnnouncements(user!);
    }
  };

  const downloadFile = (file: any) => {
    const link = document.createElement('a');
    link.href = file.data;
    link.download = file.name;
    link.click();
  };

  const canManageAnnouncements = user?.role === 'admin' || user?.role === 'teacher';
  const creator = (id: string) => storage.getAllUsers().find(u => u.id === id);

  if (!user) return null;

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <main className="flex-1 w-full p-6">
        <div className="flex items-center gap-4 mb-6">
          <SidebarTrigger />
          <h1 className="text-3xl font-bold text-foreground">Announcements</h1>
        </div>

        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">School-wide notices and important updates</p>
          {canManageAnnouncements && (
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Announcement
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Announcement</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Title *</Label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>
                  <div>
                    <Label>Content *</Label>
                    <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Priority</Label>
                      <Select value={priority} onValueChange={(val) => setPriority(val as any)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Visible To</Label>
                      <Select value={visibility} onValueChange={(val) => setVisibility(val as any)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Everyone</SelectItem>
                          <SelectItem value="student">Students Only</SelectItem>
                          <SelectItem value="teacher">Teachers Only</SelectItem>
                          <SelectItem value="admin">Admins Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
                  <Button onClick={handleCreateAnnouncement} className="w-full">
                    Create Announcement
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {announcements.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Megaphone className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No announcements yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement: Announcement) => {
              const isUnread = !announcement.readBy.includes(user.id);
              const creatorUser = creator(announcement.createdBy);

              return (
                <Card 
                  key={announcement.id}
                  className={`${isUnread ? 'border-primary' : ''} ${announcement.priority === 'urgent' ? 'border-l-4 border-l-destructive' : ''}`}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle>{announcement.title}</CardTitle>
                          {announcement.priority === 'urgent' && (
                            <Badge variant="destructive">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Urgent
                            </Badge>
                          )}
                          {isUnread && (
                            <Badge variant="default">New</Badge>
                          )}
                        </div>
                        <CardDescription>
                          Posted by {creatorUser?.name} • {new Date(announcement.createdAt).toLocaleString()}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {isUnread && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAsRead(announcement)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Mark as Read
                          </Button>
                        )}
                        {canManageAnnouncements && announcement.createdBy === user.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAnnouncement(announcement.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground whitespace-pre-wrap">{announcement.content}</p>
                    {announcement.attachments && announcement.attachments.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Attachments:</p>
                        <div className="flex flex-wrap gap-2">
                          {announcement.attachments.map(att => (
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
                    <div className="mt-4 flex items-center gap-2">
                      <Badge variant="secondary">{announcement.visibility === 'all' ? 'Everyone' : `${announcement.visibility}s`}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {announcement.readBy.length} read
                      </span>
                    </div>
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