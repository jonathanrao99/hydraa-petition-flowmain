
import { ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LogOut,
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  ClipboardList,
  Menu,
  X,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AppShellProps {
  children: ReactNode;
}

interface SidebarNavItemProps {
  href: string;
  icon: typeof LayoutDashboard;
  title: string;
  isActive?: boolean;
  onClick?: () => void;
  tooltip?: string;
}

const SidebarNavItem = ({ href, icon: Icon, title, isActive, onClick, tooltip }: SidebarNavItemProps) => {
  const item = (
    <Link
      to={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{title}</span>
    </Link>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{item}</TooltipTrigger>
          <TooltipContent className="bg-white p-2 text-sm shadow-lg rounded-lg">
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return item;
};

const AppShell = ({ children }: AppShellProps) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getNavItems = () => {
    if (!currentUser) return [];

    switch (currentUser.role) {
      case "Reception":
        return [
          { 
            href: "/reception", 
            icon: LayoutDashboard, 
            title: "Dashboard",
            tooltip: "View all petitions and their statuses" 
          },
          { 
            href: "/reception/new-petition", 
            icon: FileText, 
            title: "New Petition",
            tooltip: "Create a new petition in the system" 
          },
          { 
            href: "/reception/petitions", 
            icon: ClipboardList, 
            title: "All Petitions",
            tooltip: "View and track all submitted petitions" 
          },
        ];
      case "EnquiryOfficer":
        return [
          { 
            href: "/officer", 
            icon: LayoutDashboard, 
            title: "Dashboard",
            tooltip: "Overview of assigned petitions" 
          },
          { 
            href: "/officer/assigned", 
            icon: ClipboardList, 
            title: "Assigned Petitions",
            tooltip: "View petitions assigned to you for investigation" 
          },
          { 
            href: "/officer/submissions", 
            icon: FileText, 
            title: "My Submissions",
            tooltip: "View your submitted investigation reports" 
          },
        ];
      case "HOD":
        return [
          { 
            href: "/commissioner", 
            icon: LayoutDashboard, 
            title: "Dashboard",
            tooltip: "Overall petition status and statistics" 
          },
          { 
            href: "/commissioner/pending", 
            icon: ClipboardList, 
            title: "Pending Assignments",
            tooltip: "Petitions waiting for officer assignment" 
          },
          { 
            href: "/commissioner/assigned", 
            icon: FileText, 
            title: "Assigned Petitions",
            tooltip: "Track petitions under investigation" 
          },
          { 
            href: "/commissioner/decisions", 
            icon: FileText, 
            title: "Final Decisions",
            tooltip: "View and make final decisions on petitions" 
          },
        ];
      case "Admin":
        return [
          { 
            href: "/admin", 
            icon: LayoutDashboard, 
            title: "Dashboard",
            tooltip: "System overview and statistics" 
          },
          { 
            href: "/admin/users", 
            icon: Users, 
            title: "User Management",
            tooltip: "Manage system users and their permissions" 
          },
          { 
            href: "/admin/petitions", 
            icon: ClipboardList, 
            title: "All Petitions",
            tooltip: "View and manage all petitions in the system" 
          },
          { 
            href: "/admin/settings", 
            icon: Settings, 
            title: "System Settings",
            tooltip: "Configure system-wide settings" 
          },
        ];
      default:
        return [];
    }
  };

  const isActive = (path: string) => {
    // Check if the path is either exact match or is a parent of the current path
    return location.pathname === path || 
           (path !== "/" && location.pathname.startsWith(path));
  };

  const navItems = getNavItems();

  const mobileNav = (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <div className="flex h-full flex-col">
          <div className="px-2 py-2">
            <div className="mb-2 flex items-center justify-between">
              <Link to="/" className="flex items-center">
                <img src="/lovable-uploads/f5e69450-5a4c-4abf-81ba-4369d2545598.png" alt="HYDRAA Logo" className="h-10 w-auto" />
                <span className="ml-2 text-lg font-semibold text-primary">HYDRAA</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <Separator />
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid gap-1 px-2">
              {navItems.map((item, index) => (
                <SidebarNavItem
                  key={index}
                  href={item.href}
                  icon={item.icon}
                  title={item.title}
                  isActive={isActive(item.href)}
                  onClick={() => setOpen(false)}
                />
              ))}
            </nav>
          </div>
          <Separator />
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{currentUser?.name}</p>
                <p className="text-xs text-muted-foreground">{currentUser?.role}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2 md:gap-4">
          {mobileNav}
          <Link to="/" className="hidden md:flex items-center">
            <img src="/lovable-uploads/f5e69450-5a4c-4abf-81ba-4369d2545598.png" alt="HYDRAA Logo" className="h-10 w-auto" />
            <span className="ml-2 text-xl font-semibold text-primary">HYDRAA</span>
          </Link>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {currentUser && (
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-sm mr-2">
                        {currentUser.name} ({currentUser.designation})
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Logged in as {currentUser.role}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>
      <div className="flex flex-1">
        {currentUser && (
          <aside className="hidden w-64 border-r bg-muted/40 md:block">
            <div className="flex h-full flex-col">
              <div className="flex-1 overflow-auto py-4">
                <nav className="grid gap-2 px-4">
                  {navItems.map((item, index) => (
                    <SidebarNavItem
                      key={index}
                      href={item.href}
                      icon={item.icon}
                      title={item.title}
                      isActive={isActive(item.href)}
                      tooltip={item.tooltip}
                    />
                  ))}
                </nav>
              </div>
            </div>
          </aside>
        )}
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default AppShell;
