import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FolderTree,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
  Users,
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
} from "@/components/ui/sidebar";
import useAuthStore from "@/store/authStore";
import { toast } from "react-hot-toast";

export function DashboardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await navigate("/");
      toast.success("Logout success");
      setTimeout(() => {
        useAuthStore.getState().logout();
      }, 1000);
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
      throw error;
    }
  };

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Orders",
      href: "/dashboard/orders",
      icon: Package,
    },
    {
      title: "Products",
      href: "/dashboard/products",
      icon: ShoppingBag,
    },
    {
      title: "Categories",
      href: "/dashboard/categories",
      icon: FolderTree,
    },
    {
      title: "Users",
      href: "/dashboard/users",
      icon: Users,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <span className="text-lg font-bold text-primary-foreground">A</span>
          </div>
          <div className="font-semibold">Admin Dashboard</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === item.href}
                tooltip={item.title}
              >
                <Link to={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => navigate("/")}
              tooltip="Go to Homepage"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Homepage</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
