import { useLocation, useNavigate } from "react-router-dom";
import { storage } from "@/lib/storage";
import { User } from "@/types";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  BookOpen, 
  PlusCircle, 
  Database,
  BarChart3,
  LogOut,
  Users,
  FileText,
  User as UserIcon,
  Shield
} from "lucide-react";
import { toast } from "sonner";
import { NavLink } from "@/components/NavLink";

interface AppSidebarProps {
  user: User;
}

export function AppSidebar({ user }: AppSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    storage.setCurrentUser(null);
    toast.success("Logged out successfully");
    navigate("/");
  };

  const adminTeacherItems = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Courses", url: "/courses", icon: BookOpen },
    { title: "Create Course", url: "/create-course", icon: PlusCircle },
    { title: "Question Bank", url: "/question-bank", icon: Database },
    { title: "Analytics", url: "/analytics", icon: BarChart3 },
    { title: "Profile", url: "/profile", icon: UserIcon },
    { title: "Security", url: "/security", icon: Shield },
  ];

  const studentItems = [
    { title: "My Courses", url: "/student-dashboard", icon: BookOpen },
    { title: "Results", url: "/my-results", icon: FileText },
    { title: "Profile", url: "/profile", icon: UserIcon },
    { title: "Security", url: "/security", icon: Shield },
  ];

  const items = user.role === 'student' ? studentItems : adminTeacherItems;

  if (user.role === 'admin') {
    items.push({ title: "Manage Users", url: "/manage-users", icon: Users });
  }

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "justify-center" : ""}>
            {isCollapsed ? "CP" : "Course Platform"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === '/dashboard' || item.url === '/student-dashboard'}
                      className="hover:bg-accent/50"
                      activeClassName="bg-accent text-accent-foreground font-medium"
                    >
                      <item.icon className={isCollapsed ? "h-5 w-5" : "h-4 w-4 mr-3"} />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        {!isCollapsed ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.profilePhoto} alt={user.name} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="w-full justify-start"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        ) : (
          <div className="space-y-2 flex flex-col items-center">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.profilePhoto} alt={user.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
