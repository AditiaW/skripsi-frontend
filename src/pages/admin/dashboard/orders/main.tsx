import { useState } from "react"
import { PlusCircle } from "lucide-react"

import { DashboardHeader } from "@/pages/admin/dashboard/components/header"
import { DashboardShell } from "@/pages/admin/dashboard/components/shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { OrderTable } from "@/pages/admin/dashboard/orders/components/order-table"
import { OrderCreateDialog } from "@/pages/admin/dashboard/orders/components/order-create-dialog"

// Mock data for orders
const initialOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    email: "john@example.com",
    date: "2023-04-15T10:30:00Z",
    status: "Delivered",
    total: 129.99,
    paymentStatus: "Paid",
    items: [{ id: "1", name: "Wireless Headphones", quantity: 1, price: 129.99 }],
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    email: "jane@example.com",
    date: "2023-04-16T14:20:00Z",
    status: "Processing",
    total: 224.98,
    paymentStatus: "Paid",
    items: [
      { id: "2", name: "Smart Watch", quantity: 1, price: 199.99 },
      { id: "3", name: "Cotton T-Shirt", quantity: 1, price: 24.99 },
    ],
  },
  {
    id: "ORD-003",
    customer: "Bob Johnson",
    email: "bob@example.com",
    date: "2023-04-17T09:45:00Z",
    status: "Shipped",
    total: 89.99,
    paymentStatus: "Paid",
    items: [{ id: "4", name: "Coffee Maker", quantity: 1, price: 89.99 }],
  },
  {
    id: "ORD-004",
    customer: "Alice Williams",
    email: "alice@example.com",
    date: "2023-04-18T16:15:00Z",
    status: "Pending",
    total: 29.99,
    paymentStatus: "Pending",
    items: [{ id: "5", name: "Yoga Mat", quantity: 1, price: 29.99 }],
  },
  {
    id: "ORD-005",
    customer: "Charlie Brown",
    email: "charlie@example.com",
    date: "2023-04-19T11:30:00Z",
    status: "Cancelled",
    total: 349.97,
    paymentStatus: "Refunded",
    items: [
      { id: "1", name: "Wireless Headphones", quantity: 1, price: 129.99 },
      { id: "2", name: "Smart Watch", quantity: 1, price: 199.99 },
      { id: "5", name: "Yoga Mat", quantity: 1, price: 19.99 },
    ],
  },
]

// Mock data for products (for order creation)
const products = [
  { id: "1", name: "Wireless Headphones", price: 129.99 },
  { id: "2", name: "Smart Watch", price: 199.99 },
  { id: "3", name: "Cotton T-Shirt", price: 24.99 },
  { id: "4", name: "Coffee Maker", price: 89.99 },
  { id: "5", name: "Yoga Mat", price: 29.99 },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState(initialOrders)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Filter orders based on search query
  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.paymentStatus.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Create a new order
  const handleCreateOrder = (orderData: Omit<(typeof orders)[0], "id" | "date"> & { total: number }) => {
    const newOrder = {
      ...orderData,
      id: `ORD-${String(orders.length + 1).padStart(3, "0")}`,
      date: new Date().toISOString(),
    }
    setOrders([...orders, newOrder])
    setIsCreateDialogOpen(false)
  }

  // Update an order
  const handleUpdateOrder = (id: string, orderData: Partial<(typeof orders)[0]>) => {
    setOrders(orders.map((order) => (order.id === id ? { ...order, ...orderData } : order)))
  }

  // Delete an order
  const handleDeleteOrder = (id: string) => {
    setOrders(orders.filter((order) => order.id !== id))
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Order Management" text="View and manage customer orders">
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Order
        </Button>
      </DashboardHeader>
      <div className="space-y-4">
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
        <OrderTable orders={filteredOrders} onUpdate={handleUpdateOrder} onDelete={handleDeleteOrder} />
      </div>
      <OrderCreateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateOrder}
        products={products}
      />
    </DashboardShell>
  )
}

