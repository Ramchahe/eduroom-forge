import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "@/lib/storage";
import { User, SchoolClass, Timetable as TimetableType, TimetableSlot } from "@/types";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Trash2, Clock, Edit2, Save, Printer, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
const DAY_LABELS: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
};

export default function Timetable() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [timetable, setTimetable] = useState<TimetableType | null>(null);
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimetableSlot | null>(null);
  
  const [newSlot, setNewSlot] = useState<Partial<TimetableSlot>>({
    day: 'monday',
    startTime: '08:00',
    endTime: '08:45',
    subject: '',
    teacherId: '',
    roomNumber: '',
  });

  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    setClasses(storage.getClasses());
    setTeachers(storage.getAllUsers().filter(u => u.role === 'teacher'));
  }, [navigate]);

  useEffect(() => {
    if (selectedClassId) {
      const existingTimetable = storage.getTimetableByClass(selectedClassId);
      if (existingTimetable) {
        setTimetable(existingTimetable);
      } else {
        setTimetable(null);
      }
    }
  }, [selectedClassId]);

  const createTimetable = () => {
    if (!selectedClassId || !user) return;
    
    const selectedClass = classes.find(c => c.id === selectedClassId);
    const newTimetable: TimetableType = {
      id: crypto.randomUUID(),
      classId: selectedClassId,
      name: `${selectedClass?.name || 'Class'} Timetable`,
      slots: [],
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    storage.addTimetable(newTimetable);
    setTimetable(newTimetable);
    toast.success("Timetable created successfully");
  };

  // Check for teacher conflicts across all timetables
  const checkTeacherConflict = (
    teacherId: string | undefined,
    day: string,
    startTime: string,
    endTime: string,
    excludeSlotId?: string
  ): { hasConflict: boolean; conflictDetails?: string } => {
    if (!teacherId) return { hasConflict: false };

    const allTimetables = storage.getTimetables();
    const allClasses = storage.getClasses();
    
    for (const tt of allTimetables) {
      for (const slot of tt.slots) {
        if (excludeSlotId && slot.id === excludeSlotId) continue;
        if (slot.teacherId !== teacherId || slot.day !== day) continue;

        // Check time overlap
        const slotStart = slot.startTime;
        const slotEnd = slot.endTime;
        
        const hasOverlap = (startTime < slotEnd && endTime > slotStart);
        
        if (hasOverlap) {
          const className = allClasses.find(c => c.id === tt.classId)?.name || 'Unknown Class';
          const teacher = teachers.find(t => t.id === teacherId);
          return {
            hasConflict: true,
            conflictDetails: `${teacher?.name || 'Teacher'} is already scheduled for ${slot.subject} in ${className} at ${slotStart}-${slotEnd} on ${DAY_LABELS[day]}`
          };
        }
      }
    }
    return { hasConflict: false };
  };

  const addSlot = () => {
    if (!timetable || !newSlot.subject || !newSlot.day) {
      toast.error("Please fill in required fields");
      return;
    }

    // Check for teacher conflict
    const conflict = checkTeacherConflict(
      newSlot.teacherId,
      newSlot.day,
      newSlot.startTime || '08:00',
      newSlot.endTime || '08:45'
    );

    if (conflict.hasConflict) {
      toast.error(conflict.conflictDetails || "Teacher conflict detected");
      return;
    }

    const slot: TimetableSlot = {
      id: crypto.randomUUID(),
      day: newSlot.day as TimetableSlot['day'],
      startTime: newSlot.startTime || '08:00',
      endTime: newSlot.endTime || '08:45',
      subject: newSlot.subject,
      teacherId: newSlot.teacherId,
      roomNumber: newSlot.roomNumber,
    };

    const updatedTimetable = {
      ...timetable,
      slots: [...timetable.slots, slot],
      updatedAt: new Date().toISOString(),
    };

    storage.updateTimetable(timetable.id, updatedTimetable);
    setTimetable(updatedTimetable);
    setIsAddSlotOpen(false);
    setNewSlot({
      day: 'monday',
      startTime: '08:00',
      endTime: '08:45',
      subject: '',
      teacherId: '',
      roomNumber: '',
    });
    toast.success("Period added successfully");
  };

  const updateSlot = () => {
    if (!timetable || !editingSlot) return;

    // Check for teacher conflict (excluding current slot)
    const conflict = checkTeacherConflict(
      editingSlot.teacherId,
      editingSlot.day,
      editingSlot.startTime,
      editingSlot.endTime,
      editingSlot.id
    );

    if (conflict.hasConflict) {
      toast.error(conflict.conflictDetails || "Teacher conflict detected");
      return;
    }

    const updatedSlots = timetable.slots.map(s => 
      s.id === editingSlot.id ? editingSlot : s
    );

    const updatedTimetable = {
      ...timetable,
      slots: updatedSlots,
      updatedAt: new Date().toISOString(),
    };

    storage.updateTimetable(timetable.id, updatedTimetable);
    setTimetable(updatedTimetable);
    setEditingSlot(null);
    toast.success("Period updated successfully");
  };

  const deleteSlot = (slotId: string) => {
    if (!timetable) return;

    const updatedTimetable = {
      ...timetable,
      slots: timetable.slots.filter(s => s.id !== slotId),
      updatedAt: new Date().toISOString(),
    };

    storage.updateTimetable(timetable.id, updatedTimetable);
    setTimetable(updatedTimetable);
    toast.success("Period deleted");
  };

  const deleteTimetable = () => {
    if (!timetable) return;
    storage.deleteTimetable(timetable.id);
    setTimetable(null);
    toast.success("Timetable deleted");
  };

  const getTeacherName = (teacherId?: string) => {
    if (!teacherId) return '-';
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher?.name || '-';
  };

  const getSlotsByDay = (day: string) => {
    if (!timetable) return [];
    return timetable.slots
      .filter(s => s.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar user={user} />
        <main className="flex-1 p-6">
          <div className="flex items-center gap-4 mb-6 print:hidden">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-3xl font-bold">Timetable Manager</h1>
              <p className="text-muted-foreground">Create and manage class timetables</p>
            </div>
            {timetable && (
              <Button onClick={() => window.print()} variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Print Timetable
              </Button>
            )}
          </div>

          <Card className="mb-6 print:hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Select Class
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-4">
                <div className="flex-1 max-w-xs">
                  <Label>Class</Label>
                  <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedClassId && !timetable && (
                  <Button onClick={createTimetable}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Timetable
                  </Button>
                )}
                {timetable && (
                  <Button variant="destructive" onClick={deleteTimetable}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Timetable
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Alert className="mb-4 print:hidden">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              The system will automatically detect scheduling conflicts when the same teacher is assigned to multiple classes at the same time.
            </AlertDescription>
          </Alert>

          {timetable && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{timetable.name}</h2>
                <Dialog open={isAddSlotOpen} onOpenChange={setIsAddSlotOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Period
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Period</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Day</Label>
                        <Select 
                          value={newSlot.day} 
                          onValueChange={(v) => setNewSlot({ ...newSlot, day: v as TimetableSlot['day'] })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {DAYS.map((day) => (
                              <SelectItem key={day} value={day}>
                                {DAY_LABELS[day]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Start Time</Label>
                          <Input
                            type="time"
                            value={newSlot.startTime}
                            onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>End Time</Label>
                          <Input
                            type="time"
                            value={newSlot.endTime}
                            onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Subject *</Label>
                        <Input
                          value={newSlot.subject}
                          onChange={(e) => setNewSlot({ ...newSlot, subject: e.target.value })}
                          placeholder="e.g., Mathematics"
                        />
                      </div>
                      <div>
                        <Label>Teacher</Label>
                        <Select 
                          value={newSlot.teacherId || ""} 
                          onValueChange={(v) => setNewSlot({ ...newSlot, teacherId: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select teacher" />
                          </SelectTrigger>
                          <SelectContent>
                            {teachers.map((teacher) => (
                              <SelectItem key={teacher.id} value={teacher.id}>
                                {teacher.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Room Number</Label>
                        <Input
                          value={newSlot.roomNumber}
                          onChange={(e) => setNewSlot({ ...newSlot, roomNumber: e.target.value })}
                          placeholder="e.g., Room 101"
                        />
                      </div>
                      <Button onClick={addSlot} className="w-full">
                        Add Period
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Edit Slot Dialog */}
              <Dialog open={!!editingSlot} onOpenChange={(open) => !open && setEditingSlot(null)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Period</DialogTitle>
                  </DialogHeader>
                  {editingSlot && (
                    <div className="space-y-4">
                      <div>
                        <Label>Day</Label>
                        <Select 
                          value={editingSlot.day} 
                          onValueChange={(v) => setEditingSlot({ ...editingSlot, day: v as TimetableSlot['day'] })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {DAYS.map((day) => (
                              <SelectItem key={day} value={day}>
                                {DAY_LABELS[day]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Start Time</Label>
                          <Input
                            type="time"
                            value={editingSlot.startTime}
                            onChange={(e) => setEditingSlot({ ...editingSlot, startTime: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>End Time</Label>
                          <Input
                            type="time"
                            value={editingSlot.endTime}
                            onChange={(e) => setEditingSlot({ ...editingSlot, endTime: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Subject</Label>
                        <Input
                          value={editingSlot.subject}
                          onChange={(e) => setEditingSlot({ ...editingSlot, subject: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Teacher</Label>
                        <Select 
                          value={editingSlot.teacherId || ""} 
                          onValueChange={(v) => setEditingSlot({ ...editingSlot, teacherId: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select teacher" />
                          </SelectTrigger>
                          <SelectContent>
                            {teachers.map((teacher) => (
                              <SelectItem key={teacher.id} value={teacher.id}>
                                {teacher.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Room Number</Label>
                        <Input
                          value={editingSlot.roomNumber || ''}
                          onChange={(e) => setEditingSlot({ ...editingSlot, roomNumber: e.target.value })}
                        />
                      </div>
                      <Button onClick={updateSlot} className="w-full">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              {/* Timetable Grid */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Day</TableHead>
                      <TableHead>Periods</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {DAYS.map((day) => {
                      const daySlots = getSlotsByDay(day);
                      return (
                        <TableRow key={day}>
                          <TableCell className="font-medium">{DAY_LABELS[day]}</TableCell>
                          <TableCell>
                            {daySlots.length === 0 ? (
                              <span className="text-muted-foreground">No periods scheduled</span>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                {daySlots.map((slot) => (
                                  <Card key={slot.id} className="p-3 min-w-[180px]">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <p className="font-semibold text-sm">{slot.subject}</p>
                                        <p className="text-xs text-muted-foreground">
                                          {slot.startTime} - {slot.endTime}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          {getTeacherName(slot.teacherId)}
                                        </p>
                                        {slot.roomNumber && (
                                          <p className="text-xs text-muted-foreground">
                                            {slot.roomNumber}
                                          </p>
                                        )}
                                      </div>
                                      <div className="flex gap-1">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-6 w-6"
                                          onClick={() => setEditingSlot(slot)}
                                        >
                                          <Edit2 className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-6 w-6 text-destructive"
                                          onClick={() => deleteSlot(slot.id)}
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  </Card>
                                ))}
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </>
          )}

          {!selectedClassId && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Clock className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Select a Class</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Choose a class from the dropdown above to view or create its timetable.
                </p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
}