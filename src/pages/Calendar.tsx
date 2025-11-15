import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '@/lib/storage';
import { CalendarEvent, User } from '@/types';
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
import { Plus, Calendar as CalendarIcon, Trash2 } from 'lucide-react';

const eventColors = {
  holiday: 'bg-red-500',
  exam: 'bg-orange-500',
  event: 'bg-blue-500',
  deadline: 'bg-yellow-500',
  semester: 'bg-purple-500',
};

export default function Calendar() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<CalendarEvent['type']>('event');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    loadEvents();
  }, [navigate]);

  const loadEvents = () => {
    const allEvents = storage.getCalendarEvents();
    setEvents(allEvents.sort((a: CalendarEvent, b: CalendarEvent) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    ));
  };

  const handleCreateEvent = () => {
    if (!title || !startDate || !type) {
      toast.error('Please fill all required fields');
      return;
    }

    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title,
      description,
      type,
      startDate,
      endDate: endDate || startDate,
      category: category || type,
      color: eventColors[type],
      createdBy: user!.id,
      createdAt: new Date().toISOString(),
    };

    storage.addCalendarEvent(newEvent);
    toast.success('Event created successfully');
    resetForm();
    setShowCreateDialog(false);
    loadEvents();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setType('event');
    setStartDate('');
    setEndDate('');
    setCategory('');
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      storage.deleteCalendarEvent(id);
      toast.success('Event deleted');
      loadEvents();
    }
  };

  const groupEventsByMonth = () => {
    const grouped: Record<string, CalendarEvent[]> = {};
    events.forEach((event: CalendarEvent) => {
      const month = new Date(event.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      if (!grouped[month]) grouped[month] = [];
      grouped[month].push(event);
    });
    return grouped;
  };

  const canManageEvents = user?.role === 'admin' || user?.role === 'teacher';
  const groupedEvents = groupEventsByMonth();

  if (!user) return null;

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <main className="flex-1 w-full p-6">
        <div className="flex items-center gap-4 mb-6">
          <SidebarTrigger />
          <h1 className="text-3xl font-bold text-foreground">Academic Calendar</h1>
        </div>

        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">View all school events, holidays, and important dates</p>
          {canManageEvents && (
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Calendar Event</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Title *</Label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
                  </div>
                  <div>
                    <Label>Event Type *</Label>
                    <Select value={type} onValueChange={(val) => setType(val as CalendarEvent['type'])}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="holiday">Holiday</SelectItem>
                        <SelectItem value="exam">Exam</SelectItem>
                        <SelectItem value="event">School Event</SelectItem>
                        <SelectItem value="deadline">Deadline</SelectItem>
                        <SelectItem value="semester">Semester</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Start Date *</Label>
                      <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., Mid-term, Annual Day" />
                  </div>
                  <Button onClick={handleCreateEvent} className="w-full">
                    Create Event
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {events.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No events scheduled</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedEvents).map(([month, monthEvents]) => (
              <div key={month}>
                <h2 className="text-xl font-semibold mb-4 text-foreground">{month}</h2>
                <div className="space-y-3">
                  {monthEvents.map((event: CalendarEvent) => (
                    <Card key={event.id} className="border-l-4" style={{ borderLeftColor: event.color }}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {event.title}
                              <Badge variant="secondary">{event.type}</Badge>
                            </CardTitle>
                            {event.description && (
                              <CardDescription className="mt-1">{event.description}</CardDescription>
                            )}
                          </div>
                          {canManageEvents && event.createdBy === user.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            <span>
                              {new Date(event.startDate).toLocaleDateString()}
                              {event.endDate && event.endDate !== event.startDate && 
                                ` - ${new Date(event.endDate).toLocaleDateString()}`
                              }
                            </span>
                          </div>
                          {event.category && (
                            <Badge variant="outline">{event.category}</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </SidebarProvider>
  );
}