
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  LayoutDashboard, 
  Mail, 
  ArchiveX,
  Settings, 
  LogOut,
  User,
  Menu,
  ChevronLeft
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
      className={`w-full justify-start gap-3 mb-1 ${
        active ? "bg-blue-50 text-blue-600 hover:bg-blue-50 hover:text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" : ""
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
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
    },
    {
      to: "/emails",
      icon: <Mail className="h-5 w-5" />,
      label: "Email History",
    },
    {
      to: "/gmail",
      icon: <Mail className="h-5 w-5" />,
      label: "Gmail Connection",
    },
    {
      to: "/slack",
      icon: <ArchiveX className="h-5 w-5" />,
      label: "Slack Integration",
    },
  ];

  const userNav = [
    {
      to: "/profile",
      icon: <User className="h-5 w-5" />,
      label: "Profile",
    },
    {
      to: "/settings",
      icon: <Settings className="h-5 w-5" />,
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
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      <div className="p-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
          <Mail className="h-6 w-6" />
          <h2 className="text-xl font-bold">Gmail Assistant</h2>
        </Link>
      </div>
      
      <div className="flex flex-col flex-1">
        <div className="px-3 py-2">
          <nav className="space-y-1">
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
        
        <div className="mt-auto px-3 pt-2">
          <div className="mb-2">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              USER
            </p>
            <nav className="mt-2 space-y-1">
              {userNav.map((item) => (
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
          
          <div className="border-t my-2"></div>
          
          {currentUser && (
            <div className="px-3 pt-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={() => logout()}
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (!currentUser) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar */}
      {isMobile ? (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-10">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 border-r">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      ) : (
        <aside className="hidden md:block w-64 border-r bg-white dark:bg-gray-800 h-screen sticky top-0">
          <SidebarContent />
        </aside>
      )}

      {/* Main content */}
      <main className="flex-1">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b flex items-center justify-between p-4">
          <div className="flex items-center">
            {isMobile && (
              <Button variant="ghost" size="icon" className="mr-2">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            <h1 className="text-xl font-semibold">{location.pathname.substring(1).charAt(0).toUpperCase() + location.pathname.substring(2)}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center">
              {currentUser && (
                <>
                  <span className="text-sm font-medium mr-2">{currentUser.displayName}</span>
                  <Avatar>
                    <AvatarImage src={currentUser.photoURL || ""} alt="Profile" />
                    <AvatarFallback>{getInitials(currentUser.displayName)}</AvatarFallback>
                  </Avatar>
                </>
              )}
            </div>
            
            <Button variant="ghost" onClick={() => logout()}>
              Logout
            </Button>
          </div>
        </header>
        
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
