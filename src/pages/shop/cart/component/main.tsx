import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Format price to IDR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
    toast.success("Product quantity updated");
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
    toast.error("Product removed from cart");
  };

  const handleClearCart = () => {
    clearCart();
    toast.error("All products removed");
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 20000;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Shopping Cart</h1>
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/" className="hover:text-red-500 transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span>Cart</span>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto px-4">
              Looks like you haven't added any products to your cart yet. Browse
              our collection and find something you'll love.
            </p>
            <Link
              to="/product"
              className="inline-flex items-center justify-center rounded-md bg-red-500 px-5 py-3 text-sm font-medium text-white shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2">
              <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
                <div className="p-4 sm:p-6">
                  <div className="hidden md:grid grid-cols-12 gap-4 pb-4 text-sm font-medium text-gray-500 border-b border-gray-100">
                    <div className="col-span-6">Product</div>
                    <div className="col-span-2 text-center">Price</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-right">Subtotal</div>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {items.map((item) => (
                      <div key={item.id} className="py-5 sm:py-6">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                          <div className="col-span-6 flex items-center gap-3 sm:gap-4">
                            <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-md overflow-hidden flex-shrink-0 border border-gray-200 bg-gray-50">
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-medium text-sm sm:text-base md:text-lg truncate">
                                {item.name}
                              </h3>
                              <p className="text-sm text-gray-500 md:hidden mt-1">
                                {formatPrice(item.price)}
                              </p>
                              <button
                                className="mt-2 h-auto p-0 text-xs sm:text-sm text-red-500 hover:text-red-600 md:hidden flex items-center transition-colors"
                                onClick={() => handleRemoveItem(item.id)}
                              >
                                <Trash2 className="mr-1 h-3 w-3" />
                                Remove
                              </button>
                            </div>
                          </div>
                          <div className="col-span-2 text-center hidden md:block">
                            <span className="font-medium">
                              {formatPrice(item.price)}
                            </span>
                          </div>
                          <div className="col-span-2 flex items-center justify-start md:justify-center">
                            <div className="flex items-center border rounded-md shadow-sm">
                              <button
                                className={`h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center text-gray-600 hover:text-red-500 disabled:opacity-50 ${
                                  isMobile ? "touch-manipulation" : ""
                                }`}
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.id,
                                    item.quantity - 1
                                  )
                                }
                                disabled={item.quantity <= 1}
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                              <span className="w-9 sm:w-12 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <button
                                className={`h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center text-gray-600 hover:text-red-500 ${
                                  isMobile ? "touch-manipulation" : ""
                                }`}
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                            </div>
                          </div>
                          <div className="col-span-2 text-right flex items-center justify-between md:justify-end">
                            <span className="font-medium text-sm sm:text-base md:text-right">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                            <button
                              className="text-red-500 hover:text-red-600 hidden md:inline-flex transition-colors"
                              onClick={() => handleRemoveItem(item.id)}
                              aria-label="Remove item"
                            >
                              <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-50 p-4 sm:p-6 gap-3 sm:gap-0 border-t border-gray-100">
                  <Link
                    to="/product"
                    className="w-full sm:w-auto px-5 py-2.5 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50 text-center transition-colors shadow-sm"
                  >
                    Continue Shopping
                  </Link>
                  <button
                    className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                    onClick={handleClearCart}
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="rounded-lg border bg-white p-4 sm:p-6 shadow-sm sticky top-4">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 pb-4 border-b border-gray-100">
                  Order Summary
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">
                      Subtotal (
                      {items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                      items)
                    </span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>{formatPrice(shipping)}</span>
                  </div>
                  <div className="border-t border-gray-100 pt-4 mt-4"></div>
                  <div className="flex items-center justify-between font-medium text-base sm:text-lg">
                    <span>Total</span>
                    <span className="text-red-600">{formatPrice(total)}</span>
                  </div>

                  <div className="pt-6">
                    <Link
                      to="/checkout"
                      className="w-full inline-flex items-center justify-center rounded-md bg-red-500 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                    >
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>

                    <div className="mt-4 text-xs text-center text-gray-500">
                      Secure checkout with encrypted payment processing
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
