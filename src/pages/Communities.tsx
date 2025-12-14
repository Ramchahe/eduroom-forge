import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { storage } from "@/lib/storage";
import { User, Community, CommunityPost, PostComment, SchoolClass, FileAttachment } from "@/types";
import { toast } from "sonner";
import { 
  Users, 
  MessageSquare, 
  Heart, 
  Send, 
  Plus,
  ArrowLeft,
  Shield,
  MoreVertical,
  Trash2,
  Paperclip,
  Image,
  FileText,
  X,
  Download
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from 'date-fns';

const Communities = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newCommunity, setNewCommunity] = useState({
    name: '',
    description: '',
    targetClasses: [] as string[],
    moderators: [] as string[]
  });
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostAttachments, setNewPostAttachments] = useState<FileAttachment[]>([]);
  const [newCommentContent, setNewCommentContent] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    loadData();
  }, [navigate]);

  const loadData = () => {
    setClasses(storage.getClasses());
    setAllUsers(storage.getAllUsers().filter(u => u.role === 'teacher'));
    setCommunities(JSON.parse(localStorage.getItem('communities') || '[]'));
    setPosts(JSON.parse(localStorage.getItem('communityPosts') || '[]'));
    setComments(JSON.parse(localStorage.getItem('postComments') || '[]'));
  };

  const createCommunity = () => {
    if (!user || !newCommunity.name || newCommunity.targetClasses.length === 0) return;

    const community: Community = {
      id: crypto.randomUUID(),
      name: newCommunity.name,
      description: newCommunity.description,
      targetClasses: newCommunity.targetClasses,
      moderators: newCommunity.moderators,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      memberCount: 0
    };

    const allCommunities = JSON.parse(localStorage.getItem('communities') || '[]');
    allCommunities.push(community);
    localStorage.setItem('communities', JSON.stringify(allCommunities));
    
    setCommunities(allCommunities);
    setShowCreateDialog(false);
    setNewCommunity({ name: '', description: '', targetClasses: [], moderators: [] });
    toast.success('Community created successfully!');
  };

  const createPost = () => {
    if (!user || !selectedCommunity || (!newPostContent.trim() && newPostAttachments.length === 0)) return;

    const post: CommunityPost = {
      id: crypto.randomUUID(),
      communityId: selectedCommunity.id,
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role,
      content: newPostContent.trim(),
      attachments: newPostAttachments.length > 0 ? newPostAttachments : undefined,
      likes: [],
      createdAt: new Date().toISOString()
    };

    const allPosts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
    allPosts.unshift(post);
    localStorage.setItem('communityPosts', JSON.stringify(allPosts));
    
    setPosts(allPosts);
    setNewPostContent('');
    setNewPostAttachments([]);
    toast.success('Post created!');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large. Max size is 5MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const attachment: FileAttachment = {
          id: crypto.randomUUID(),
          name: file.name,
          type: file.type,
          data: e.target?.result as string,
          size: file.size
        };
        setNewPostAttachments((prev) => [...prev, attachment]);
      };
      reader.readAsDataURL(file);
    });
    event.target.value = '';
  };

  const removeAttachment = (id: string) => {
    setNewPostAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const downloadAttachment = (attachment: FileAttachment) => {
    const link = document.createElement('a');
    link.href = attachment.data;
    link.download = attachment.name;
    link.click();
  };

  const isImageType = (type: string) => type.startsWith('image/');

  const toggleLike = (postId: string) => {
    if (!user) return;

    const allPosts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
    const updatedPosts = allPosts.map((post: CommunityPost) => {
      if (post.id === postId) {
        const hasLiked = post.likes.includes(user.id);
        return {
          ...post,
          likes: hasLiked 
            ? post.likes.filter(id => id !== user.id)
            : [...post.likes, user.id]
        };
      }
      return post;
    });
    
    localStorage.setItem('communityPosts', JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
  };

  const addComment = (postId: string) => {
    if (!user || !newCommentContent[postId]?.trim()) return;

    const comment: PostComment = {
      id: crypto.randomUUID(),
      postId,
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role,
      content: newCommentContent[postId].trim(),
      createdAt: new Date().toISOString()
    };

    const allComments = JSON.parse(localStorage.getItem('postComments') || '[]');
    allComments.push(comment);
    localStorage.setItem('postComments', JSON.stringify(allComments));
    
    setComments(allComments);
    setNewCommentContent({ ...newCommentContent, [postId]: '' });
  };

  const deletePost = (postId: string) => {
    const allPosts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
    const updatedPosts = allPosts.filter((p: CommunityPost) => p.id !== postId);
    localStorage.setItem('communityPosts', JSON.stringify(updatedPosts));
    
    // Also delete associated comments
    const allComments = JSON.parse(localStorage.getItem('postComments') || '[]');
    const updatedComments = allComments.filter((c: PostComment) => c.postId !== postId);
    localStorage.setItem('postComments', JSON.stringify(updatedComments));
    
    setPosts(updatedPosts);
    setComments(updatedComments);
    toast.success('Post deleted');
  };

  const canAccessCommunity = (community: Community) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (community.moderators.includes(user.id)) return true;
    if (user.role === 'student' && user.classId && community.targetClasses.includes(user.classId)) return true;
    if (user.role === 'teacher' && user.classes?.some(c => community.targetClasses.includes(c))) return true;
    return false;
  };

  const isModerator = (community: Community) => {
    if (!user) return false;
    return user.role === 'admin' || community.moderators.includes(user.id);
  };

  const accessibleCommunities = communities.filter(canAccessCommunity);
  const communityPosts = selectedCommunity 
    ? posts.filter(p => p.communityId === selectedCommunity.id)
    : [];

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar user={user} />
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              {selectedCommunity ? (
                <Button variant="ghost" size="icon" onClick={() => setSelectedCommunity(null)}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              ) : null}
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  {selectedCommunity ? selectedCommunity.name : 'Communities'}
                </h1>
                <p className="text-muted-foreground">
                  {selectedCommunity 
                    ? selectedCommunity.description 
                    : 'Join discussions with your classmates'}
                </p>
              </div>
            </div>
            
            {user.role === 'admin' && !selectedCommunity && (
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Community
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Create a Community</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        placeholder="e.g., Physics Study Group"
                        value={newCommunity.name}
                        onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        placeholder="What is this community about?"
                        value={newCommunity.description}
                        onChange={(e) => setNewCommunity({ ...newCommunity, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Target Classes</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {classes.map((cls) => (
                          <div key={cls.id} className="flex items-center gap-2">
                            <Checkbox
                              id={`class-${cls.id}`}
                              checked={newCommunity.targetClasses.includes(cls.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setNewCommunity({
                                    ...newCommunity,
                                    targetClasses: [...newCommunity.targetClasses, cls.id]
                                  });
                                } else {
                                  setNewCommunity({
                                    ...newCommunity,
                                    targetClasses: newCommunity.targetClasses.filter(id => id !== cls.id)
                                  });
                                }
                              }}
                            />
                            <Label htmlFor={`class-${cls.id}`}>{cls.name}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>Moderators (Teachers)</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {allUsers.map((teacher) => (
                          <div key={teacher.id} className="flex items-center gap-2">
                            <Checkbox
                              id={`mod-${teacher.id}`}
                              checked={newCommunity.moderators.includes(teacher.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setNewCommunity({
                                    ...newCommunity,
                                    moderators: [...newCommunity.moderators, teacher.id]
                                  });
                                } else {
                                  setNewCommunity({
                                    ...newCommunity,
                                    moderators: newCommunity.moderators.filter(id => id !== teacher.id)
                                  });
                                }
                              }}
                            />
                            <Label htmlFor={`mod-${teacher.id}`}>{teacher.name}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button 
                      onClick={createCommunity} 
                      className="w-full"
                      disabled={!newCommunity.name || newCommunity.targetClasses.length === 0}
                    >
                      Create Community
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {selectedCommunity ? (
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Create Post */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <Textarea
                        placeholder="Share something with the community..."
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        className="min-h-[80px]"
                      />
                      
                      {/* Attachments Preview */}
                      {newPostAttachments.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {newPostAttachments.map((attachment) => (
                            <div 
                              key={attachment.id} 
                              className="relative group border rounded-lg overflow-hidden"
                            >
                              {isImageType(attachment.type) ? (
                                <img 
                                  src={attachment.data} 
                                  alt={attachment.name}
                                  className="w-20 h-20 object-cover"
                                />
                              ) : (
                                <div className="w-20 h-20 flex flex-col items-center justify-center bg-muted p-2">
                                  <FileText className="h-6 w-6 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground truncate w-full text-center mt-1">
                                    {attachment.name.split('.').pop()?.toUpperCase()}
                                  </span>
                                </div>
                              )}
                              <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-0 right-0 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeAttachment(attachment.id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <input
                            type="file"
                            id="image-upload"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleFileUpload}
                          />
                          <input
                            type="file"
                            id="file-upload"
                            accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
                            multiple
                            className="hidden"
                            onChange={handleFileUpload}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('image-upload')?.click()}
                          >
                            <Image className="h-4 w-4 mr-1" />
                            Image
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('file-upload')?.click()}
                          >
                            <Paperclip className="h-4 w-4 mr-1" />
                            File
                          </Button>
                        </div>
                        <Button 
                          onClick={createPost} 
                          disabled={!newPostContent.trim() && newPostAttachments.length === 0}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Post
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Posts */}
              {communityPosts.length === 0 ? (
                <Card className="p-12 text-center">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No posts yet</h3>
                  <p className="text-muted-foreground">Be the first to share something!</p>
                </Card>
              ) : (
                communityPosts.map((post) => {
                  const postComments = comments.filter(c => c.postId === post.id);
                  const hasLiked = post.likes.includes(user.id);
                  const isExpanded = expandedComments.has(post.id);

                  return (
                    <Card key={post.id}>
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          <Avatar>
                            <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{post.authorName}</span>
                                <Badge variant="outline" className="text-xs">{post.authorRole}</Badge>
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                                </span>
                              </div>
                              {(isModerator(selectedCommunity) || post.authorId === user.id) && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem 
                                      className="text-destructive"
                                      onClick={() => deletePost(post.id)}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </div>
                            <p className="mt-2 whitespace-pre-wrap">{post.content}</p>
                            
                            {/* Post Attachments */}
                            {post.attachments && post.attachments.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {post.attachments.map((attachment) => (
                                  <div 
                                    key={attachment.id} 
                                    className="relative group border rounded-lg overflow-hidden cursor-pointer"
                                    onClick={() => downloadAttachment(attachment)}
                                  >
                                    {isImageType(attachment.type) ? (
                                      <img 
                                        src={attachment.data} 
                                        alt={attachment.name}
                                        className="max-w-xs max-h-48 object-cover rounded-lg"
                                      />
                                    ) : (
                                      <div className="flex items-center gap-2 bg-muted p-3 rounded-lg">
                                        <FileText className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                          <p className="text-sm font-medium truncate max-w-[150px]">{attachment.name}</p>
                                          <p className="text-xs text-muted-foreground">
                                            {(attachment.size / 1024).toFixed(1)} KB
                                          </p>
                                        </div>
                                        <Download className="h-4 w-4 text-muted-foreground" />
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {/* Actions */}
                            <div className="flex items-center gap-4 mt-4">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => toggleLike(post.id)}
                                className={hasLiked ? 'text-red-500' : ''}
                              >
                                <Heart className={`h-4 w-4 mr-1 ${hasLiked ? 'fill-current' : ''}`} />
                                {post.likes.length}
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  const newSet = new Set(expandedComments);
                                  if (isExpanded) {
                                    newSet.delete(post.id);
                                  } else {
                                    newSet.add(post.id);
                                  }
                                  setExpandedComments(newSet);
                                }}
                              >
                                <MessageSquare className="h-4 w-4 mr-1" />
                                {postComments.length}
                              </Button>
                            </div>

                            {/* Comments Section */}
                            {isExpanded && (
                              <div className="mt-4 space-y-3">
                                <Separator />
                                {postComments.map((comment) => (
                                  <div key={comment.id} className="flex gap-2">
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback className="text-xs">
                                        {comment.authorName.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 bg-muted rounded-lg p-2">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm">{comment.authorName}</span>
                                        <span className="text-xs text-muted-foreground">
                                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                        </span>
                                      </div>
                                      <p className="text-sm">{comment.content}</p>
                                    </div>
                                  </div>
                                ))}
                                <div className="flex gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="text-xs">{user.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 flex gap-2">
                                    <Input
                                      placeholder="Write a comment..."
                                      value={newCommentContent[post.id] || ''}
                                      onChange={(e) => setNewCommentContent({ 
                                        ...newCommentContent, 
                                        [post.id]: e.target.value 
                                      })}
                                      onKeyDown={(e) => e.key === 'Enter' && addComment(post.id)}
                                    />
                                    <Button size="icon" onClick={() => addComment(post.id)}>
                                      <Send className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accessibleCommunities.length === 0 ? (
                <Card className="col-span-full p-12 text-center">
                  <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No Communities</h3>
                  <p className="text-muted-foreground">
                    {user.role === 'admin' 
                      ? 'Create a community to get started!'
                      : 'No communities available for your class yet'}
                  </p>
                </Card>
              ) : (
                accessibleCommunities.map((community) => {
                  const communityPostCount = posts.filter(p => p.communityId === community.id).length;
                  const classNames = community.targetClasses
                    .map(id => classes.find(c => c.id === id)?.name)
                    .filter(Boolean)
                    .join(', ');

                  return (
                    <Card 
                      key={community.id} 
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => setSelectedCommunity(community)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{community.name}</CardTitle>
                          {isModerator(community) && (
                            <Badge variant="secondary" className="gap-1">
                              <Shield className="h-3 w-3" />
                              Mod
                            </Badge>
                          )}
                        </div>
                        <CardDescription>{community.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{classNames}</span>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            {communityPostCount} posts
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Communities;
