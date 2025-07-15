import { useState, useEffect, useMemo } from "react";
import Fuse from "fuse.js";
import axiosInstance from "@/api/axiosInstance";

import { DashboardHeader } from "@/pages/admin/dashboard/components/header";
import { DashboardShell } from "@/pages/admin/dashboard/components/shell";
import { Input } from "@/components/ui/input";
import { OrderTable } from "@/pages/admin/dashboard/orders/components/order-table";
import toast from "react-hot-toast";

interface Order {
  id: string;
  shippingFirstName: string;
  shippingLastName: string;
  shippingEmail: string;
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
  orderItems: {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    price: number;
    product: {
      name: string;
    };
  }[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create Fuse.js instance for fuzzy search
  const fuse = useMemo(() => {
    const options = {
      keys: [
        "id",
        "shippingFirstName",
        "shippingLastName",
        "shippingEmail",
        "shippingAddress",
        "shippingCity",
        "paymentStatus",
        "shippingPhone",
        "shippingNotes",
        "userId",
      ],
      includeScore: true,
      threshold: 0.4, // Adjust for more/less strict matching
      minMatchCharLength: 2,
      ignoreLocation: true,
    };

    return new Fuse(orders, options);
  }, [orders]);

  // Fetch orders from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/orders");

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

  const handleDelete = async (orderId: string) => {
    try {
      await axiosInstance.delete(`/orders/${orderId}`);
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
      toast.success("Order berhasil dihapus");
    } catch (error) {
      console.error("Gagal menghapus order:", error);
      toast.error("Gagal menghapus order. Silakan coba lagi.");
    }
  };

  // Filter orders using Fuse.js
  const filteredOrders = useMemo(() => {
    if (!searchQuery) return orders;

    const results = fuse.search(searchQuery);
    return results.map((result) => result.item);
  }, [searchQuery, orders, fuse]);

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
          <OrderTable
            orders={filteredOrders}
            searchTerm={searchQuery}
            onDelete={handleDelete}
          />
        )}
      </div>
    </DashboardShell>
  );
}
