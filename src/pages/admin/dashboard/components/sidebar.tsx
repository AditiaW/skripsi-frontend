import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FolderTree,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
  Users,
  Home,
  Settings,
  ChevronRight,
  User,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/authStore";
import { toast } from "react-hot-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function DashboardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleLogout = async () => {
    try {
      await navigate("/");
      toast.success("Logged out successfully");
      setTimeout(() => {
        useAuthStore.getState().logout();
      }, 1000);
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
      throw error;
    }
  };

  const mainNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      title: "Orders",
      href: "/dashboard/orders",
      icon: Package,
      badge: null,
    },
    {
      title: "Products",
      href: "/dashboard/products",
      icon: ShoppingBag,
      badge: null,
    },
    {
      title: "Categories",
      href: "/dashboard/categories",
      icon: FolderTree,
      badge: null,
    },
    {
      title: "Users",
      href: "/dashboard/users",
      icon: Users,
      badge: null,
    },
  ];

  const isActiveRoute = (href) => {
    if (href === "/dashboard") {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <Sidebar className="border-r border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex flex-col h-full">
      <SidebarHeader className="border-b border-border/40 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-sm">
            <span className="text-xl font-bold text-primary-foreground">A</span>
          </div>
          <div className="flex flex-col">
            <div className="font-semibold text-foreground">Admin Panel</div>
            <div className="text-xs text-muted-foreground">
              Management System
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4 flex-1 overflow-y-auto">
        {/* Main Navigation */}
        <div className="mb-4">
          <div className="mb-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Main
          </div>
          <SidebarMenu className="space-y-1">
            {mainNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton
                      asChild
                      isActive={isActiveRoute(item.href)}
                      className="group relative h-10 w-full justify-start rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-primary/10 data-[active=true]:text-foreground data-[active=true]:shadow-sm data-[active=true]:border data-[active=true]:border-primary/30"
                    >
                      <Link to={item.href} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span className="flex-1">{item.title}</span>
                        {item.badge && (
                          <Badge
                            variant="secondary"
                            className="ml-auto h-5 px-2 text-xs"
                          >
                            {item.badge}
                          </Badge>
                        )}
                        {isActiveRoute(item.href) && (
                          <ChevronRight className="h-3 w-3 shrink-0 opacity-60" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.title}</TooltipContent>
                </Tooltip>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>

        <SidebarSeparator className="my-4" />
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarMenuButton
                  asChild
                  className="h-10 w-full justify-start rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground"
                >
                  <Link to="/" className="flex items-center gap-3">
                    <Home className="h-4 w-4 shrink-0" />
                    <span>Homepage</span>
                  </Link>
                </SidebarMenuButton>
              </TooltipTrigger>
              <TooltipContent side="right">Go to Homepage</TooltipContent>
            </Tooltip>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarSeparator className="my-3" />

        {/* User Profile Section */}
        <div className="flex items-center gap-3 rounded-lg p-3 hover:bg-accent/50 transition-colors">
          <Avatar className="h-8 w-8 border-2 border-background shadow-sm bg-primary/10 text-primary">
            <AvatarFallback className="flex items-center justify-center">
              {user?.name ? (
                user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
              ) : (
                <User className="w-4 h-4" />
              )}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-foreground truncate">
              {user?.name || "Admin User"}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {user?.email || "admin@example.com"}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                aria-label="User settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 focus:bg-red-50 focus:text-red-700"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
