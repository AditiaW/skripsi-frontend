import { useState, useEffect } from "react";
import { DashboardHeader } from "@/pages/admin/dashboard/components/header";
import { DashboardShell } from "@/pages/admin/dashboard/components/shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, Tags, ShoppingCart } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    users: { total: 0, loading: true },
    products: { total: 0, loading: true },
    categories: { total: 0, loading: true },
    orders: { total: 0, loading: true },
  });
  const [, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [usersRes, productsRes, categoriesRes, ordersRes] =
          await Promise.all([
            axiosInstance.get("/users"),
            axiosInstance.get("/product"),
            axiosInstance.get("/category"),
            axiosInstance.get("/orders"),
          ]);

        setStats({
          users: {
            total: usersRes.data.data?.length || 0,
            loading: false,
          },
          products: {
            total: productsRes.data?.length || 0,
            loading: false,
          },
          categories: {
            total: categoriesRes.data?.length || 0,
            loading: false,
          },
          orders: {
            total: ordersRes.data.data?.length || 0,
            loading: false,
          },
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setStats((prev) => ({
          users: { ...prev.users, loading: false },
          products: { ...prev.products, loading: false },
          categories: { ...prev.categories, loading: false },
          orders: { ...prev.orders, loading: false },
        }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard Overview"
        text="Welcome back! Here's what's happening with your store."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Users Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {stats.users.loading ? (
              <Skeleton className="h-8 w-1/2" />
            ) : (
              <div className="text-2xl font-bold">{stats.users.total}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {stats.users.loading ? "Loading..." : "Registered customers"}
            </p>
          </CardContent>
        </Card>

        {/* Products Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {stats.products.loading ? (
              <Skeleton className="h-8 w-1/2" />
            ) : (
              <div className="text-2xl font-bold">{stats.products.total}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {stats.products.loading ? "Loading..." : "Available in store"}
            </p>
          </CardContent>
        </Card>

        {/* Categories Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Categories
            </CardTitle>
            <Tags className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {stats.categories.loading ? (
              <Skeleton className="h-8 w-1/2" />
            ) : (
              <div className="text-2xl font-bold">{stats.categories.total}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {stats.categories.loading ? "Loading..." : "Product categories"}
            </p>
          </CardContent>
        </Card>

        {/* Orders Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {stats.orders.loading ? (
              <Skeleton className="h-8 w-1/2" />
            ) : (
              <div className="text-2xl font-bold">{stats.orders.total}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {stats.orders.loading ? "Loading..." : "Transactions"}
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
