
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  LayoutDashboard, 
  Mail, 
  Settings, 
  LogOut,
  Menu
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavItem = ({ to, icon, label, active }: NavItemProps) => (
  <Link to={to} className="w-full">
    <Button
      variant={active ? "secondary" : "ghost"}
      className={`w-full justify-start gap-2 mb-1 ${
        active ? "bg-secondary text-secondary-foreground" : ""
      }`}
    >
      {icon}
      <span>{label}</span>
    </Button>
  </Link>
);

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();

  const navigation = [
    {
      to: "/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      label: "Dashboard",
    },
    {
      to: "/emails",
      icon: <Mail className="h-4 w-4" />,
      label: "Emails",
    },
    {
      to: "/settings",
      icon: <Settings className="h-4 w-4" />,
      label: "Settings",
    },
  ];

  const getInitials = (name: string | null | undefined): string => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <h2 className="text-lg font-bold gradient-text">Gmail Assistant</h2>
      </div>
      <Separator />
      {currentUser && (
        <div className="flex flex-col gap-2 p-4">
          <div className="flex items-center gap-3 mb-4">
            <Avatar>
              <AvatarImage src={currentUser.photoURL || ""} alt="Profile" />
              <AvatarFallback>{getInitials(currentUser.displayName)}</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="text-sm font-medium line-clamp-1">{currentUser.displayName}</p>
              <p className="text-xs text-muted-foreground line-clamp-1">{currentUser.email}</p>
            </div>
          </div>

          <nav className="space-y-1 flex-1">
            {navigation.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                active={location.pathname === item.to}
              />
            ))}
          </nav>
        </div>
      )}
      <div className="mt-auto p-4">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={() => logout()}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );

  if (!currentUser) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Mobile sidebar */}
      {isMobile ? (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-10">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      ) : (
        <aside className="hidden md:block w-64 border-r h-screen sticky top-0">
          <SidebarContent />
        </aside>
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  );
};

export default Layout;
