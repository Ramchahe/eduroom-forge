import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "@/lib/storage";
import { User, SchoolClass, Timetable as TimetableType } from "@/types";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Clock, Printer } from "lucide-react";

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
const DAY_LABELS: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
};

export default function ViewTimetable() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [timetable, setTimetable] = useState<TimetableType | null>(null);

  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (currentUser.role === 'admin') {
      navigate('/timetable');
      return;
    }
    setUser(currentUser);
    
    const allClasses = storage.getClasses();
    setTeachers(storage.getAllUsers().filter(u => u.role === 'teacher'));

    if (currentUser.role === 'student' && currentUser.classId) {
      // Auto-select student's class
      setSelectedClassId(currentUser.classId);
      setClasses(allClasses.filter(c => c.id === currentUser.classId));
    } else if (currentUser.role === 'teacher') {
      // Show classes assigned to teacher (from teacher's classes array)
      const teacherClasses = currentUser.classes || [];
      const filteredClasses = allClasses.filter(c => teacherClasses.includes(c.id));
      setClasses(filteredClasses.length > 0 ? filteredClasses : allClasses);
      if (filteredClasses.length > 0) {
        setSelectedClassId(filteredClasses[0].id);
      } else if (allClasses.length > 0) {
        setSelectedClassId(allClasses[0].id);
      }
    }
  }, [navigate]);

  useEffect(() => {
    if (selectedClassId) {
      const existingTimetable = storage.getTimetableByClass(selectedClassId);
      setTimetable(existingTimetable || null);
    }
  }, [selectedClassId]);

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

  const handlePrint = () => {
    window.print();
  };

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar user={user} />
        <main className="flex-1 p-6">
          <div className="flex items-center gap-4 mb-6">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-3xl font-bold">My Timetable</h1>
              <p className="text-muted-foreground">View your class schedule</p>
            </div>
            {timetable && (
              <Button onClick={handlePrint} variant="outline" className="print:hidden">
                <Printer className="h-4 w-4 mr-2" />
                Print Timetable
              </Button>
            )}
          </div>

          {user.role === 'teacher' && classes.length > 1 && (
            <Card className="mb-6 print:hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Select Class
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-w-xs">
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
              </CardContent>
            </Card>
          )}

          {timetable ? (
            <div className="print:p-0">
              <div className="mb-4 print:mb-2">
                <h2 className="text-xl font-semibold">{timetable.name}</h2>
              </div>
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
                                  <Card key={slot.id} className="p-3 min-w-[180px] print:shadow-none print:border">
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
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Clock className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Timetable Available</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  {user.role === 'student' 
                    ? "Your class timetable hasn't been created yet. Please check back later."
                    : "Select a class to view its timetable."}
                </p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
}
