import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

interface OrderViewDialogProps {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderViewDialog({
  order,
  open,
  onOpenChange,
}: OrderViewDialogProps) {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            View complete information for order {order.id}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Order Information
              </h3>
              <div className="mt-2 space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Order ID:</span> {order.id}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Created:</span>{" "}
                  {formatDate(order.createdAt)}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Updated:</span>{" "}
                  {formatDate(order.updatedAt)}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Payment Status:</span>{" "}
                  <Badge
                    variant={getPaymentStatusBadgeVariant(order.paymentStatus)}
                  >
                    {order.paymentStatus}
                  </Badge>
                </p>
                <p className="text-sm">
                  <span className="font-medium">Snap Token:</span>{" "}
                  {order.snapToken}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Shipping Information
              </h3>
              <div className="mt-2 space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Address:</span>{" "}
                  {order.shippingAddress}
                </p>
                <p className="text-sm">
                  <span className="font-medium">City:</span>{" "}
                  {order.shippingCity}
                </p>
                <p className="text-sm">
                  <span className="font-medium">ZIP Code:</span>{" "}
                  {order.shippingZip}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Phone:</span>{" "}
                  {order.shippingPhone}
                </p>
                {order.shippingNotes && (
                  <p className="text-sm">
                    <span className="font-medium">Notes:</span>{" "}
                    {order.shippingNotes}
                  </p>
                )}
              </div>
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Order Summary
            </h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Total Amount</TableCell>
                    <TableCell className="text-right font-bold">
                      {formatPrice(order.totalAmount)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
