import { useState, useEffect } from "react";
import { DashboardHeader } from "@/pages/admin/dashboard/components/header";
import { DashboardShell } from "@/pages/admin/dashboard/components/shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, Tags, ShoppingCart } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";

export default function DashboardPage() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    fetchTotalUsers();
    fetchTotalProduct();
    fetchTotalCategory();
    fetchTotalOrders();
  }, []);

  const fetchTotalUsers = async () => {
    try {
      const response = await axiosInstance.get("/users");
      setTotalUsers(response.data.data.length);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const fetchTotalProduct = async () => {
    try {
      const response = await axiosInstance.get("/product");
      setTotalProducts(response.data.length);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const fetchTotalCategory = async () => {
    try {
      const response = await axiosInstance.get("/category");
      setTotalCategories(response.data.length);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchTotalOrders = async () => {
    try {
      const response = await axiosInstance.get("/orders");
      setTotalOrders(response.data.data.length);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="Welcome to your admin dashboard"
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Categories
            </CardTitle>
            <Tags className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
