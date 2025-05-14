import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";

import { DashboardHeader } from "@/pages/admin/dashboard/components/header";
import { DashboardShell } from "@/pages/admin/dashboard/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OrderTable } from "@/pages/admin/dashboard/orders/components/order-table";
import { OrderCreateDialog } from "@/pages/admin/dashboard/orders/components/order-create-dialog";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customer: string;
  email: string;
  date: string;
  status: string;
  total: number;
  paymentStatus: string;
  items: OrderItem[];
}

interface Product {
  id: string;
  name: string;
  price: number;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders and products from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [ordersResponse, productsResponse] = await Promise.all([
          axiosInstance.get("/orders"),
          axiosInstance.get("/product"),
        ]);

        setOrders(ordersResponse.data.data || ordersResponse.data);
        setProducts(productsResponse.data.data || productsResponse.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load data. Please try again later.");
        setOrders([]);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter orders based on search query
  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.paymentStatus.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Create a new order
  const handleCreateOrder = async (orderData: Omit<Order, "id" | "date"> & { total: number }) => {
    try {
      const response = await axiosInstance.post("/orders", orderData);
      setOrders([...orders, response.data.data || response.data]);
      setIsCreateDialogOpen(false);
    } catch (err) {
      console.error("Failed to create order:", err);
      setError("Failed to create order. Please try again.");
    }
  };

  // Update an order
  const handleUpdateOrder = async (id: string, orderData: Partial<Order>) => {
    try {
      const response = await axiosInstance.patch(`/orders/${id}`, orderData);
      setOrders(
        orders.map((order) =>
          order.id === id ? (response.data.data || response.data) : order
        )
      );
    } catch (err) {
      console.error("Failed to update order:", err);
      setError("Failed to update order. Please try again.");
    }
  };

  // Delete an order
  const handleDeleteOrder = async (id: string) => {
    try {
      await axiosInstance.delete(`/orders/${id}`);
      setOrders(orders.filter((order) => order.id !== id));
    } catch (err) {
      console.error("Failed to delete order:", err);
      setError("Failed to delete order. Please try again.");
    }
  };

  return (
    <DashboardShell>
      <DashboardHeader heading="Order Management" text="View and manage customer orders">
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Order
        </Button>
      </DashboardHeader>
      <div className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="w-full max-w-sm">
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9"
            />
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <p>Loading orders...</p>
          </div>
        ) : (
          <OrderTable 
            orders={filteredOrders} 
            onUpdate={handleUpdateOrder} 
            onDelete={handleDeleteOrder} 
          />
        )}
      </div>
      <OrderCreateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateOrder}
        products={products}
      />
    </DashboardShell>
  );
}

