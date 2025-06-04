import { useState, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";

import { DashboardHeader } from "@/pages/admin/dashboard/components/header";
import { DashboardShell } from "@/pages/admin/dashboard/components/shell";
import { Input } from "@/components/ui/input";
import { OrderTable } from "@/pages/admin/dashboard/orders/components/order-table";

interface Order {
  id: string;
  shippingAddress: string;
  shippingCity: string;
  shippingZip: string;
  shippingPhone: string;
  shippingNotes: string;
  totalAmount: number;
  paymentStatus: string;
  snapToken: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/orders");
        
        // Handle both possible response structures
        setOrders(response.data.data || response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to load orders. Please try again later.");
        setOrders([]);
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
      order.shippingAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shippingCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.paymentStatus.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shippingPhone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardShell>
      <DashboardHeader heading="Order Management" text="View customer orders" />
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
          <OrderTable orders={filteredOrders} />
        )}
      </div>
    </DashboardShell>
  );
}