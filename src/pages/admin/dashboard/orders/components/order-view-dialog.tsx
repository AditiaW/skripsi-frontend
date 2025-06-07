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

interface Product {
  name: string;
}

interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product: Product;
}

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
  orderItems: OrderItem[];
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
      <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto w-[95vw] p-4 sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg sm:text-xl">
            Order Details
          </DialogTitle>
          <DialogDescription className="text-sm">
            View complete information for order {order.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Order & Customer Info - Mobile Stack, Desktop Grid */}
          <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0">
            {/* Order Information */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground border-b pb-1">
                Order Information
              </h3>
              <div className="space-y-2">
                <div className="flex flex-col sm:block">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    Order ID : {" "}
                  </span>
                  <span className="text-sm font-mono text-foreground break-all">
                    {order.id}
                  </span>
                </div>

                <div className="flex flex-col sm:block">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    Created : {" "}
                  </span>
                  <span className="text-sm">{formatDate(order.createdAt)}</span>
                </div>

                <div className="flex flex-col sm:block">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    Updated : {" "}
                  </span>
                  <span className="text-sm">{formatDate(order.updatedAt)}</span>
                </div>

                <div className="flex flex-col sm:block">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    Payment Status : {" "}
                  </span>
                  <div className="mt-1">
                    <Badge
                      variant={getPaymentStatusBadgeVariant(
                        order.paymentStatus
                      )}
                      className="text-xs"
                    >
                      {order.paymentStatus}
                    </Badge>
                  </div>
                </div>

                {order.snapToken && (
                  <div className="flex flex-col sm:block">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">
                      Snap Token : {" "}
                    </span>
                    <span className="text-sm font-mono break-all">
                      {order.snapToken}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground border-b pb-1">
                Customer Information : {" "}
              </h3>
              <div className="space-y-2">
                <div className="flex flex-col sm:block">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    Name : {" "}
                  </span>
                  <span className="text-sm font-medium">
                    {order.shippingFirstName} {order.shippingLastName}
                  </span>
                </div>

                <div className="flex flex-col sm:block">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    Email : {" "}
                  </span>
                  <span className="text-sm break-all">
                    {order.shippingEmail}
                  </span>
                </div>

                <div className="flex flex-col sm:block">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    Phone : {" "}
                  </span>
                  <span className="text-sm">{order.shippingPhone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground border-b pb-1">
              Shipping Information
            </h3>
            <div className="space-y-2">
              <div className="flex flex-col sm:block">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Address : {" "}
                </span>
                <span className="text-sm">{order.shippingAddress}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:flex sm:gap-6">
                <div className="flex flex-col sm:block">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    City : {" "}
                  </span>
                  <span className="text-sm">{order.shippingCity}</span>
                </div>
                <div className="flex flex-col sm:block">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    ZIP : {" "}
                  </span>
                  <span className="text-sm">{order.shippingZip}</span>
                </div>
              </div>

              {order.shippingNotes && (
                <div className="flex flex-col sm:block">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    Notes : {" "}
                  </span>
                  <span className="text-sm">{order.shippingNotes}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground border-b pb-1">
              Order Items ({order.orderItems.length})
            </h3>

            {/* Mobile Card View */}
            <div className="block sm:hidden space-y-3">
              {order.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-muted/30 rounded-lg p-4 space-y-3"
                >
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm leading-tight">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-muted-foreground font-mono">
                      Product ID: {item.productId}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">
                        Price
                      </div>
                      <div className="font-medium">
                        {formatPrice(item.price)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">
                        Qty
                      </div>
                      <div className="font-medium">{item.quantity}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">
                        Subtotal
                      </div>
                      <div className="font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Mobile Total */}
              <div className="bg-primary/10 rounded-lg p-4 border-2 border-primary/20">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">
                    Total Amount
                  </span>
                  <span className="font-bold text-lg text-primary">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.orderItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-medium">{item.product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {item.productId}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatPrice(item.price)}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatPrice(item.price * item.quantity)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50">
                    <TableCell colSpan={3} className="text-right font-medium">
                      Total Amount
                    </TableCell>
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
