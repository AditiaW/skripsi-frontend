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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

interface OrderTableProps {
  orders: Order[];
}

export function OrderTable({ orders }: OrderTableProps) {
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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

  const formatDateMobile = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Function to truncate Order ID for mobile view
  const truncateOrderId = (orderId: string) => {
    const maxLength = 6;
    if (orderId.length <= maxLength) {
      return orderId;
    }
    return orderId.substring(0, maxLength) + "...";
  };

  // Function to truncate customer name for mobile view
  const truncateCustomerName = (firstName: string, lastName: string) => {
    const fullName = `${firstName} ${lastName}`;
    const maxLength = 12;
    if (fullName.length <= maxLength) {
      return fullName;
    }
    return fullName.substring(0, maxLength) + "...";
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

  // Pagination logic
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedOrders = orders.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getVisiblePages = () => {
    const visiblePages = [];
    const maxVisiblePages = window.innerWidth < 640 ? 3 : 5; 

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      const half = Math.floor(maxVisiblePages / 2);
      let start = currentPage - half;
      let end = currentPage + half;

      if (start < 1) {
        start = 1;
        end = maxVisiblePages;
      }

      if (end > totalPages) {
        end = totalPages;
        start = totalPages - maxVisiblePages + 1;
      }

      for (let i = start; i <= end; i++) {
        visiblePages.push(i);
      }
    }

    return visiblePages;
  };

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        {/* Mobile Card View */}
        <div className="block sm:hidden">
          {paginatedOrders.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No orders found.
            </div>
          ) : (
            <div className="divide-y">
              {paginatedOrders.map((order) => (
                <div key={order.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          #{truncateOrderId(order.id)}
                        </span>
                        <Badge
                          variant={getPaymentStatusBadgeVariant(
                            order.paymentStatus
                          )}
                          className="text-xs px-2 py-0.5"
                        >
                          {order.paymentStatus}
                        </Badge>
                      </div>
                      <div className="font-medium text-sm truncate">
                        {truncateCustomerName(
                          order.shippingFirstName,
                          order.shippingLastName
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {order.shippingCity} •{" "}
                        {formatDateMobile(order.createdAt)}
                      </div>
                    </div>
                    <div className="text-right space-y-2 flex-shrink-0 ml-4">
                      <div className="font-semibold text-sm">
                        {formatPrice(order.totalAmount)}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => handleView(order)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span className="sr-only">View Details</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden md:table-cell">City</TableHead>
                <TableHead className="hidden lg:table-cell">Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      <span className="block md:hidden" title={order.id}>
                        {truncateOrderId(order.id)}
                      </span>
                      <span className="hidden md:block">{order.id}</span>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        <span
                          className="block md:hidden"
                          title={`${order.shippingFirstName} ${order.shippingLastName}`}
                        >
                          {truncateCustomerName(
                            order.shippingFirstName,
                            order.shippingLastName
                          )}
                        </span>
                        <span className="hidden md:block">
                          {order.shippingFirstName} {order.shippingLastName}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground hidden md:block">
                        {order.shippingEmail}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {order.shippingCity}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
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
                      <span className="hidden sm:block">
                        {formatPrice(order.totalAmount)}
                      </span>
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
      </div>

      {/* Pagination Controls */}
      {orders.length > itemsPerPage && (
        <div className="flex items-center justify-center sm:justify-end px-2 py-4">
          <Pagination>
            <PaginationContent className="gap-1">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage - 1);
                  }}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "hover:bg-accent"
                  }
                />
              </PaginationItem>

              {getVisiblePages().map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page);
                    }}
                    isActive={page === currentPage}
                    className="min-w-[2.5rem] h-9"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage + 1);
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "hover:bg-accent"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

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
