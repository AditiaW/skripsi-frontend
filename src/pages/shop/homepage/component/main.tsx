import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Search,
  TruckIcon,
  ShieldCheck,
  Clock,
  CreditCard,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";
import { Product } from "@/types";
import axiosInstance from "@/api/axiosInstance";

export default function Homepage() {
  const navigate = useNavigate();
  const [newestProducts, setNewestProducts] = useState<Product[]>([]);
  const { addToCart } = useCartStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // 🚀 Fetch from API
        const response = await axiosInstance.get("/product");
        const products = response.data;

        console.log("✅ Data from API:", products.length, "items");

        // 🛠 Store in state
        setNewestProducts(products);

        // 💾 Store in Cache Storage
        const cache = await caches.open("products-cache");
        const cacheResponse = new Response(JSON.stringify(products), {
          headers: { "Content-Type": "application/json" },
        });

        await cache.put("/product", cacheResponse);
        console.log(
          "✅ Product data saved to cache:",
          products.length,
          "items"
        );
      } catch (err) {
        console.error("❌ Error fetching products:", err);

        // ⚡ If offline, try fetching from cache
        if (!navigator.onLine || err.message === "Network Error") {
          console.log("⚡ Offline mode - Attempting to retrieve from cache...");
          try {
            const cache = await caches.open("products-cache");
            const cachedResponse = await cache.match("/product");

            if (cachedResponse) {
              const cachedData = await cachedResponse.json();
              console.log(
                "✅ Data retrieved from cache:",
                cachedData.length,
                "items"
              );

              // Ensure data format is an array for UI rendering
              if (Array.isArray(cachedData)) {
                setNewestProducts(cachedData);
              } else {
                console.log(
                  "⚠️ Cached data is not an array, cannot render:",
                  cachedData
                );
              }
            } else {
              console.log("❌ No data found in cache");
              setNewestProducts([]);
            }
          } catch (cacheErr) {
            console.error("❌ Error accessing cache:", cacheErr);
          }
        } else {
          setNewestProducts([]);
        }
      }
    };

    fetchProducts();
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

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    console.log("Cart: ", product);
    toast.success(`${product.name} added to the cart!`);
  };

  return (
    <main className="flex-1">
      {/* Hero Banner */}
      <section className="relative bg-gray-50">
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
          <div className="grid gap-6 md:gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4 text-center lg:text-left">
              <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl">
                Everything Your Home Needs in One Place
              </h1>
              <p className="max-w-[600px] text-gray-500 text-sm md:text-base mx-auto lg:mx-0">
                Premium quality furniture for your home. From stylish tables or
                doors, all designed with care.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to={"/product"}>
                  <button className="inline-flex items-center justify-center rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 h-10 sm:h-11">
                    Shop Now
                  </button>
                </Link>
              </div>
            </div>
            <div className="relative h-[200px] xs:h-[250px] sm:h-[300px] lg:h-[400px] rounded-xl overflow-hidden mt-4 lg:mt-0">
              <img
                src="/placeholder.svg?height=500&width=600"
                alt="Furniture showcase"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Newest Products */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-center mb-6 md:mb-8">
            Newest Products
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 md:gap-6">
            {newestProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group relative"
              >
                <div className="group relative">
                  <div className="aspect-square overflow-hidden rounded-lg bg-white border border-gray-200">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 md:top-4 md:right-4 flex flex-col gap-2">
                      <button
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-white/80 flex items-center justify-center shadow-sm opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white"
                      >
                        <Search className="h-3 w-3 md:h-4 md:w-4" />
                        <span className="sr-only">Quick view</span>
                      </button>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="inline-flex items-center justify-center rounded-md bg-red-500 px-3 py-2 text-xs md:text-sm font-medium text-white shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        <ShoppingCart className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 md:mt-4 space-y-1 text-center">
                    <span className="inline-block px-2 py-1 text-xs rounded-full border border-gray-200 mb-1 md:mb-2">
                      {product.category.name}
                    </span>
                    <h3 className="text-xs sm:text-sm md:text-base font-medium truncate">
                      {product.name}
                    </h3>
                    <div className="flex justify-center gap-2">
                      <span className="text-xs md:text-sm font-medium text-red-500">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 md:mt-10 text-center">
            <button className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 h-10 sm:h-11">
              View All Products
            </button>
          </div>
        </div>
      </section>

      {/* Why Our Store */}
      <section className="bg-gray-50 py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-center mb-6 md:mb-8">
            Why Choose GM Candra Mebel
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="flex flex-col items-center text-center p-4 md:p-6">
                <TruckIcon className="h-8 w-8 md:h-10 md:w-10 mb-3 md:mb-4 text-red-500" />
                <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">
                  Free Shipping
                </h3>
                <p className="text-xs md:text-sm text-gray-500">
                  On orders over Rp 2,000,000. Get your furniture delivered to
                  your doorstep.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="flex flex-col items-center text-center p-4 md:p-6">
                <ShieldCheck className="h-8 w-8 md:h-10 md:w-10 mb-3 md:mb-4 text-red-500" />
                <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">
                  Quality Guarantee
                </h3>
                <p className="text-xs md:text-sm text-gray-500">
                  All our products are carefully selected for quality and
                  durability.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="flex flex-col items-center text-center p-4 md:p-6">
                <Clock className="h-8 w-8 md:h-10 md:w-10 mb-3 md:mb-4 text-red-500" />
                <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">
                  24/7 Support
                </h3>
                <p className="text-xs md:text-sm text-gray-500">
                  Our customer service team is available around the clock to
                  help you.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="flex flex-col items-center text-center p-4 md:p-6">
                <CreditCard className="h-8 w-8 md:h-10 md:w-10 mb-3 md:mb-4 text-red-500" />
                <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">
                  Secure Payment
                </h3>
                <p className="text-xs md:text-sm text-gray-500">
                  Multiple secure payment options for your convenience and
                  safety.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
