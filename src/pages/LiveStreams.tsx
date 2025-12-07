import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { storage } from "@/lib/storage";
import { User, LiveStream, StreamComment, SchoolClass } from "@/types";
import { toast } from "sonner";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Send, 
  Users, 
  Play, 
  Square,
  Radio,
  Eye,
  MessageCircle
} from "lucide-react";

const LiveStreams = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [comments, setComments] = useState<StreamComment[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [activeStream, setActiveStream] = useState<LiveStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newStream, setNewStream] = useState({
    title: '',
    description: '',
    targetClasses: [] as string[]
  });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    loadData();
  }, [navigate]);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  const loadData = () => {
    setClasses(storage.getClasses());
    const allStreams = JSON.parse(localStorage.getItem('liveStreams') || '[]');
    setStreams(allStreams);
    
    if (activeStream) {
      const streamComments = JSON.parse(localStorage.getItem('streamComments') || '[]')
        .filter((c: StreamComment) => c.streamId === activeStream.id);
      setComments(streamComments);
    }
  };

  const startStream = async () => {
    if (!user) return;
    
    try {
      // Request camera and microphone (demo - actual WebRTC would need more setup)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const newLiveStream: LiveStream = {
        id: crypto.randomUUID(),
        title: newStream.title,
        description: newStream.description,
        teacherId: user.id,
        teacherName: user.name,
        targetClasses: newStream.targetClasses,
        status: 'live',
        startedAt: new Date().toISOString(),
        viewerCount: 0,
        createdAt: new Date().toISOString()
      };

      const allStreams = JSON.parse(localStorage.getItem('liveStreams') || '[]');
      allStreams.unshift(newLiveStream);
      localStorage.setItem('liveStreams', JSON.stringify(allStreams));
      
      setStreams(allStreams);
      setActiveStream(newLiveStream);
      setIsStreaming(true);
      setShowCreateDialog(false);
      toast.success('Live stream started!');
    } catch (error) {
      toast.error('Failed to access camera/microphone. Using demo mode.');
      // Demo mode without actual camera
      const newLiveStream: LiveStream = {
        id: crypto.randomUUID(),
        title: newStream.title,
        description: newStream.description,
        teacherId: user.id,
        teacherName: user.name,
        targetClasses: newStream.targetClasses,
        status: 'live',
        startedAt: new Date().toISOString(),
        viewerCount: Math.floor(Math.random() * 50) + 10,
        createdAt: new Date().toISOString()
      };

      const allStreams = JSON.parse(localStorage.getItem('liveStreams') || '[]');
      allStreams.unshift(newLiveStream);
      localStorage.setItem('liveStreams', JSON.stringify(allStreams));
      
      setStreams(allStreams);
      setActiveStream(newLiveStream);
      setIsStreaming(true);
      setShowCreateDialog(false);
    }
  };

  const endStream = () => {
    if (!activeStream) return;
    
    // Stop all media tracks
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }

    const allStreams = JSON.parse(localStorage.getItem('liveStreams') || '[]');
    const updatedStreams = allStreams.map((s: LiveStream) => 
      s.id === activeStream.id 
        ? { ...s, status: 'ended', endedAt: new Date().toISOString() }
        : s
    );
    localStorage.setItem('liveStreams', JSON.stringify(updatedStreams));
    
    setStreams(updatedStreams);
    setActiveStream(null);
    setIsStreaming(false);
    toast.success('Stream ended');
  };

  const joinStream = (stream: LiveStream) => {
    // Update viewer count
    const allStreams = JSON.parse(localStorage.getItem('liveStreams') || '[]');
    const updatedStreams = allStreams.map((s: LiveStream) => 
      s.id === stream.id 
        ? { ...s, viewerCount: s.viewerCount + 1 }
        : s
    );
    localStorage.setItem('liveStreams', JSON.stringify(updatedStreams));
    
    setActiveStream({ ...stream, viewerCount: stream.viewerCount + 1 });
    
    // Load comments for this stream
    const streamComments = JSON.parse(localStorage.getItem('streamComments') || '[]')
      .filter((c: StreamComment) => c.streamId === stream.id);
    setComments(streamComments);
  };

  const leaveStream = () => {
    if (!activeStream) return;
    
    const allStreams = JSON.parse(localStorage.getItem('liveStreams') || '[]');
    const updatedStreams = allStreams.map((s: LiveStream) => 
      s.id === activeStream.id 
        ? { ...s, viewerCount: Math.max(0, s.viewerCount - 1) }
        : s
    );
    localStorage.setItem('liveStreams', JSON.stringify(updatedStreams));
    
    setStreams(updatedStreams);
    setActiveStream(null);
    setComments([]);
  };

  const sendComment = () => {
    if (!user || !activeStream || !newComment.trim()) return;

    const comment: StreamComment = {
      id: crypto.randomUUID(),
      streamId: activeStream.id,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      content: newComment.trim(),
      createdAt: new Date().toISOString()
    };

    const allComments = JSON.parse(localStorage.getItem('streamComments') || '[]');
    allComments.push(comment);
    localStorage.setItem('streamComments', JSON.stringify(allComments));
    
    setComments([...comments, comment]);
    setNewComment('');
  };

  const canAccessStream = (stream: LiveStream) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (user.role === 'teacher' && stream.teacherId === user.id) return true;
    if (user.role === 'student' && user.classId && stream.targetClasses.includes(user.classId)) return true;
    if (user.role === 'teacher' && user.classes?.some(c => stream.targetClasses.includes(c))) return true;
    return false;
  };

  const liveStreams = streams.filter(s => s.status === 'live' && canAccessStream(s));

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar user={user} />
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Radio className="h-6 w-6 text-destructive animate-pulse" />
                  Live Streams
                </h1>
                <p className="text-muted-foreground">Watch and participate in live classes</p>
              </div>
            </div>
            
            {user.role === 'teacher' && !activeStream && (
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Video className="h-4 w-4" />
                    Start Live Stream
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Start a Live Stream</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        placeholder="e.g., Physics Chapter 5 - Live Class"
                        value={newStream.title}
                        onChange={(e) => setNewStream({ ...newStream, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        placeholder="What will you be teaching?"
                        value={newStream.description}
                        onChange={(e) => setNewStream({ ...newStream, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Target Classes</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {classes.map((cls) => (
                          <div key={cls.id} className="flex items-center gap-2">
                            <Checkbox
                              id={cls.id}
                              checked={newStream.targetClasses.includes(cls.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setNewStream({
                                    ...newStream,
                                    targetClasses: [...newStream.targetClasses, cls.id]
                                  });
                                } else {
                                  setNewStream({
                                    ...newStream,
                                    targetClasses: newStream.targetClasses.filter(id => id !== cls.id)
                                  });
                                }
                              }}
                            />
                            <Label htmlFor={cls.id}>{cls.name}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button 
                      onClick={startStream} 
                      className="w-full"
                      disabled={!newStream.title || newStream.targetClasses.length === 0}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Go Live
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {activeStream ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Video Player */}
              <div className="lg:col-span-2 space-y-4">
                <Card className="overflow-hidden">
                  <div className="relative aspect-video bg-black">
                    {isStreaming && user.role === 'teacher' ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                        <div className="text-center text-white">
                          <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                          <p className="text-lg font-medium">{activeStream.title}</p>
                          <p className="text-sm opacity-75">by {activeStream.teacherName}</p>
                          <Badge variant="destructive" className="mt-2 animate-pulse">
                            <Radio className="h-3 w-3 mr-1" />
                            LIVE
                          </Badge>
                        </div>
                      </div>
                    )}
                    
                    {/* Stream Controls */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                      {isStreaming && user.role === 'teacher' && (
                        <>
                          <Button
                            variant={isMuted ? "destructive" : "secondary"}
                            size="icon"
                            onClick={() => setIsMuted(!isMuted)}
                          >
                            {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant={isVideoOff ? "destructive" : "secondary"}
                            size="icon"
                            onClick={() => setIsVideoOff(!isVideoOff)}
                          >
                            {isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                          </Button>
                          <Button variant="destructive" onClick={endStream}>
                            <Square className="h-4 w-4 mr-2" />
                            End Stream
                          </Button>
                        </>
                      )}
                      {!isStreaming && (
                        <Button variant="outline" onClick={leaveStream}>
                          Leave Stream
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{activeStream.title}</CardTitle>
                        <CardDescription>{activeStream.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        <span>{activeStream.viewerCount} watching</span>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </div>

              {/* Live Chat */}
              <Card className="lg:col-span-1 flex flex-col h-[600px]">
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MessageCircle className="h-5 w-5" />
                    Live Chat
                  </CardTitle>
                </CardHeader>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {comment.userName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{comment.userName}</span>
                            <Badge variant="outline" className="text-xs">
                              {comment.userRole}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={commentsEndRef} />
                  </div>
                </ScrollArea>
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Send a message..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendComment()}
                    />
                    <Button size="icon" onClick={sendComment}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {liveStreams.length === 0 ? (
                <Card className="col-span-full p-12 text-center">
                  <Video className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No Live Streams</h3>
                  <p className="text-muted-foreground">
                    {user.role === 'teacher' 
                      ? 'Start a live stream to teach your students!'
                      : 'Check back later for live classes'}
                  </p>
                </Card>
              ) : (
                liveStreams.map((stream) => (
                  <Card key={stream.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-secondary/20">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Video className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <Badge variant="destructive" className="absolute top-2 left-2 animate-pulse">
                        <Radio className="h-3 w-3 mr-1" />
                        LIVE
                      </Badge>
                      <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 text-white px-2 py-1 rounded text-sm">
                        <Eye className="h-3 w-3" />
                        {stream.viewerCount}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold truncate">{stream.title}</h3>
                      <p className="text-sm text-muted-foreground">{stream.teacherName}</p>
                      <Button className="w-full mt-3" onClick={() => joinStream(stream)}>
                        <Play className="h-4 w-4 mr-2" />
                        Join Stream
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default LiveStreams;
