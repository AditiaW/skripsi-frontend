import { useState } from "react";
import { Eye, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderViewDialog } from "./order-view-dialog";
import { Badge } from "@/components/ui/badge";

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

interface OrderTableProps {
  orders: Order[];
}

export function OrderTable({ orders }: OrderTableProps) {
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const handleView = (order: Order) => {
    setViewingOrder(order);
    setIsViewDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPaymentStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "PAID":
        return "success";
      case "PENDING":
        return "pending";
      case "FAILED":
        return "warning";
      default:
        return "outline";
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Shipping Address</TableHead>
              <TableHead className="hidden md:table-cell">City</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead className="text-right">Total Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <div>{order.shippingAddress}</div>
                      <div className="text-sm text-muted-foreground hidden sm:block">
                        {order.shippingPhone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {order.shippingCity}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getPaymentStatusBadgeVariant(
                        order.paymentStatus
                      )}
                    >
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPrice(order.totalAmount)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleView(order)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {viewingOrder && (
        <OrderViewDialog
          order={viewingOrder}
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
        />
      )}
    </>
  );
}
