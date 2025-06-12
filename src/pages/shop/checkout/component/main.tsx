import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosInstance from "@/api/axiosInstance";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";

// Define validation schema with Zod
const checkoutSchema = z.object({
  firstName: z.string().min(1, "Nama depan wajib diisi"),
  lastName: z.string().min(1, "Nama belakang wajib diisi"),
  email: z.string().email("Alamat email tidak valid"),
  phone: z.string().min(10, "Nomor telepon minimal 10 digit"),
  address: z.string().min(1, "Alamat tujuan wajib diisi"),
  city: z.string().min(1, "Kota wajib diisi"),
  zip: z.string().min(1, "Kode pos wajib diisi"),
  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart, getTotalPrice } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const subtotal = getTotalPrice();
  const total = subtotal;

  useEffect(() => {
    const snapScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT;

    const existingScript = document.querySelector(
      `script[src="${snapScriptUrl}"]`
    );
    if (existingScript) return;

    const script = document.createElement("script");
    script.src = snapScriptUrl;
    script.async = true;
    script.setAttribute("data-client-key", clientKey);

    script.onload = () => {
      console.log("✅ Midtrans Snap script loaded");
    };

    script.onerror = () => {
      console.error("❌ Failed to load Midtrans Snap script");
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast.error("Keranjangmu masih kosong.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Prepare order data
      const orderData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        zip: data.zip,
        notes: data.notes,
        items: items.map((item) => ({
          id: item.id,
          productName: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal,
        total,
      };
      console.log("Orders Data: ", orderData);
      // 2. Add authentication header
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Kamu belum login. Silakan masuk terlebih dahulu.");
        return;
      }
      const response = await axiosInstance.post(
        "/orders/create-transaction",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Response: ", response);

      // 3. Handle payment
      if (window.snap) {
        window.snap.pay(response.data.token, {
          onSuccess: (result) => {
            clearCart();
            navigate("/checkout/success", {
              state: { orderId: result.order_id },
            });
          },
          onError: (error) => {
            toast.error(`Payment failed: ${error.message}`);
          },
          onClose: () => {
            toast("Payment window was closed");
          },
        });
      } else {
        throw new Error("Payment gateway not loaded");
      }
    } catch (error) {
      if (error.response?.data?.message?.includes("not found")) {
        toast.error("Beberapa produk tidak lagi tersedia.");
      } else {
        toast.error(error.response?.data?.message || "Checkout failed");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Keranjangmu masih kosong</h1>
        <p className="text-gray-500 mb-8">
          Tambahkan produk ke keranjang sebelum melanjutkan ke pembayaran.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center justify-center rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-red-600 focus:outline-none"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:px-6 md:py-10 lg:py-12">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Checkout</h1>
        <div className="flex items-center text-sm text-gray-500">
          <Link to="/" className="hover:text-red-500 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link to="/cart" className="hover:text-red-500 transition-colors">
            Cart
          </Link>
          <span className="mx-2">/</span>
          <span>Checkout</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Shipping Information */}
            <div className="bg-white rounded-lg border shadow-sm p-4 md:p-6">
              <h2 className="text-xl font-semibold mb-4">
                Shipping Information
              </h2>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      placeholder="Budi"
                      className={`w-full rounded-md border ${
                        errors.firstName ? "border-red-500" : "border-gray-300"
                      } py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500`}
                      {...register("firstName")}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      placeholder="Santoso"
                      className={`w-full rounded-md border ${
                        errors.lastName ? "border-red-500" : "border-gray-300"
                      } py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500`}
                      {...register("lastName")}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="budi.santoso@email.com"
                    className={`w-full rounded-md border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500`}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    className={`w-full rounded-md border ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    } py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500`}
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    placeholder="Jl. Yos Sudarso No. 88"
                    className={`w-full rounded-md border ${
                      errors.address ? "border-red-500" : "border-gray-300"
                    } py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500`}
                    {...register("address")}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs">
                      {errors.address.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700"
                    >
                      City
                    </label>
                    <input
                      id="city"
                      type="text"
                      placeholder="Pontianak"
                      className={`w-full rounded-md border ${
                        errors.city ? "border-red-500" : "border-gray-300"
                      } py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500`}
                      {...register("city")}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-xs">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="zip"
                      className="block text-sm font-medium text-gray-700"
                    >
                      ZIP Code
                    </label>
                    <input
                      id="zip"
                      type="text"
                      placeholder="78110"
                      className={`w-full rounded-md border ${
                        errors.zip ? "border-red-500" : "border-gray-300"
                      } py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500`}
                      {...register("zip")}
                    />
                    {errors.zip && (
                      <p className="text-red-500 text-xs">
                        {errors.zip.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Notes */}
            <div className="bg-white rounded-lg border shadow-sm p-4 md:p-6">
              <h2 className="text-xl font-semibold mb-4">
                Order Notes (Optional)
              </h2>
              <div className="space-y-2">
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700"
                >
                  Notes
                </label>
                <textarea
                  id="notes"
                  placeholder="Ada catatan lain? Tuliskan di sini."
                  className="w-full min-h-[100px] rounded-md border border-gray-300 py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  {...register("notes")}
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="sticky top-20">
              <div className="rounded-lg border bg-white shadow-sm p-4 md:p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                <div className="border-b pb-4 mb-4">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between py-2 text-sm font-medium"
                  >
                    {items.length} items
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <div className="space-y-4 mt-2">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3 md:gap-4">
                        <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0 border">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">
                            {item.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {formatPrice(item.price)} x {item.quantity}
                          </p>
                        </div>
                        <div className="text-sm font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3"></div>
                  <div className="flex items-center justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center rounded-md bg-red-500 px-4 py-3 text-sm font-medium text-white shadow hover:bg-red-600 focus:outline-none transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Processing..." : "Place Order"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
