import { useNavigate } from "react-router-dom";
import { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MobileHeaderProps {
  user: User;
  title: string;
  notificationCount?: number;
}

export function MobileHeader({ user, title, notificationCount = 0 }: MobileHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="md:hidden sticky top-0 z-30 bg-card/95 backdrop-blur-lg border-b px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar
            className="h-9 w-9 cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            <AvatarImage src={user.profilePhoto} alt={user.name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold leading-tight">{title}</p>
            <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/announcements")}
          className="relative p-2 rounded-full hover:bg-muted transition-colors"
        >
          <Bell className="h-5 w-5 text-muted-foreground" />
          {notificationCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
