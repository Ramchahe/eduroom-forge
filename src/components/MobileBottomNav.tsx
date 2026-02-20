import { useLocation, useNavigate } from "react-router-dom";
import { User } from "@/types";
import {
  LayoutDashboard,
  BookOpen,
  Bell,
  Calendar,
  User as UserIcon,
  ClipboardList,
  Users,
  School,
  BarChart3,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState } from "react";
import { storage } from "@/lib/storage";
import { toast } from "sonner";
import {
  LogOut,
  DollarSign,
  FileText,
  Shield,
  Clock,
  Radio,
  MessageCircle,
  TrendingUp,
  Award,
  Database,
  PlusCircle,
  Megaphone,
} from "lucide-react";

interface MobileBottomNavProps {
  user: User;
}

export function MobileBottomNav({ user }: MobileBottomNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [moreOpen, setMoreOpen] = useState(false);

  const handleLogout = () => {
    storage.setCurrentUser(null);
    toast.success("Logged out successfully");
    navigate("/");
  };

  // Primary tabs per role (max 5 including "More")
  const getMainTabs = () => {
    if (user.role === "student") {
      return [
        { label: "Home", icon: LayoutDashboard, url: "/student-dashboard" },
        { label: "Courses", icon: BookOpen, url: "/courses" },
        { label: "Tasks", icon: ClipboardList, url: "/student-assignments" },
        { label: "Alerts", icon: Bell, url: "/announcements" },
      ];
    }
    if (user.role === "teacher") {
      return [
        { label: "Home", icon: LayoutDashboard, url: "/teacher-dashboard" },
        { label: "Courses", icon: BookOpen, url: "/courses" },
        { label: "Tasks", icon: ClipboardList, url: "/assignments" },
        { label: "Calendar", icon: Calendar, url: "/calendar" },
      ];
    }
    // admin
    return [
      { label: "Home", icon: LayoutDashboard, url: "/admin-dashboard" },
      { label: "Users", icon: Users, url: "/manage-users" },
      { label: "Classes", icon: School, url: "/manage-classes" },
      { label: "Analytics", icon: BarChart3, url: "/analytics" },
    ];
  };

  const getMoreItems = () => {
    if (user.role === "student") {
      return [
        { title: "Timetable", url: "/view-timetable", icon: Clock },
        { title: "Live Streams", url: "/live-streams", icon: Radio },
        { title: "Communities", url: "/communities", icon: MessageCircle },
        { title: "Calendar", url: "/calendar", icon: Calendar },
        { title: "Results", url: "/my-results", icon: FileText },
        { title: "Analytics", url: "/performance-analytics", icon: TrendingUp },
        { title: "Certificates", url: "/certificates", icon: Award },
        { title: "Fee Payment", url: "/my-fees", icon: DollarSign },
        { title: "Profile", url: "/profile", icon: UserIcon },
        { title: "Security", url: "/security", icon: Shield },
      ];
    }
    if (user.role === "teacher") {
      return [
        { title: "Timetable", url: "/view-timetable", icon: Clock },
        { title: "Create Course", url: "/create-course", icon: PlusCircle },
        { title: "Live Streams", url: "/live-streams", icon: Radio },
        { title: "Communities", url: "/communities", icon: MessageCircle },
        { title: "Question Bank", url: "/question-bank", icon: Database },
        { title: "Announcements", url: "/announcements", icon: Megaphone },
        { title: "Analytics", url: "/analytics", icon: BarChart3 },
        { title: "Fee Management", url: "/fee-management", icon: DollarSign },
        { title: "Profile", url: "/profile", icon: UserIcon },
        { title: "Security", url: "/security", icon: Shield },
      ];
    }
    // admin
    return [
      { title: "Timetable", url: "/timetable", icon: Clock },
      { title: "Courses", url: "/courses", icon: BookOpen },
      { title: "Create Course", url: "/create-course", icon: PlusCircle },
      { title: "Live Streams", url: "/live-streams", icon: Radio },
      { title: "Communities", url: "/communities", icon: MessageCircle },
      { title: "Assignments", url: "/assignments", icon: ClipboardList },
      { title: "Question Bank", url: "/question-bank", icon: Database },
      { title: "Calendar", url: "/calendar", icon: Calendar },
      { title: "Announcements", url: "/announcements", icon: Megaphone },
      { title: "Salary Management", url: "/admin/salaries", icon: DollarSign },
      { title: "Fee Management", url: "/fee-management", icon: DollarSign },
      { title: "Profile", url: "/profile", icon: UserIcon },
      { title: "Security", url: "/security", icon: Shield },
    ];
  };

  const mainTabs = getMainTabs();
  const moreItems = getMoreItems();

  const isActive = (url: string) => location.pathname === url;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur-lg safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-1">
        {mainTabs.map((tab) => (
          <button
            key={tab.url}
            onClick={() => navigate(tab.url)}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors",
              isActive(tab.url)
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            <tab.icon className={cn("h-5 w-5", isActive(tab.url) && "stroke-[2.5px]")} />
            <span className="text-[10px] font-medium leading-tight">{tab.label}</span>
          </button>
        ))}

        {/* More tab */}
        <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
          <SheetTrigger asChild>
            <button className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-muted-foreground">
              <MoreHorizontal className="h-5 w-5" />
              <span className="text-[10px] font-medium leading-tight">More</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl pb-safe">
            <SheetHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.profilePhoto} alt={user.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <SheetTitle className="text-base">{user.name}</SheetTitle>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
                <ThemeToggle />
              </div>
            </SheetHeader>

            <div className="grid grid-cols-3 gap-3 py-4 overflow-y-auto max-h-[55vh]">
              {moreItems.map((item) => (
                <button
                  key={item.url}
                  onClick={() => {
                    navigate(item.url);
                    setMoreOpen(false);
                  }}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-xl transition-colors",
                    isActive(item.url)
                      ? "bg-primary/10 text-primary"
                      : "bg-muted/50 text-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs font-medium text-center leading-tight">{item.title}</span>
                </button>
              ))}
            </div>

            <div className="pt-4 border-t mt-auto">
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => {
                  handleLogout();
                  setMoreOpen(false);
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
