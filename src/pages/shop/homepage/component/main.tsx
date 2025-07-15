import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Search,
  ShieldCheck,
  Clock,
  CreditCard,
  ArrowRight,
  Info,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";
import { Product } from "@/types";
import axiosInstance from "@/api/axiosInstance";
import HeroImage from "@/assets/hero.png";

export default function Homepage() {
  const navigate = useNavigate();
  const [newestProducts, setNewestProducts] = useState<Product[]>([]);
  const { addToCart } = useCartStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/product");
        const products = response.data;

        // Sort and get newest products
        const sortedProducts = [...products].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        const latestProducts = sortedProducts.slice(0, 4);
        setNewestProducts(latestProducts);

        // Cache products data
        const productCache = await caches.open("products-cache");
        const productResponse = new Response(JSON.stringify(products), {
          headers: { "Content-Type": "application/json" },
        });
        await productCache.put("/product", productResponse);

        // Cache images
        const imageCache = await caches.open("images-cache");

        await Promise.all(
          products.map(async (product) => {
            const imageUrl = product.imageUrl;
            if (!imageUrl || typeof imageUrl !== "string") return;

            try {
              // Check if image already exists in cache
              const cachedResponse = await imageCache.match(imageUrl);
              if (cachedResponse) {
                console.log("🖼️ Gambar sudah ada di cache:", imageUrl);
                return;
              }

              // Fetch image
              const imageRequest = new Request(imageUrl);

              const imageResponse = await fetch(imageRequest);

              // Only cache if response is valid
              if (imageResponse.ok) {
                await imageCache.put(imageUrl, imageResponse.clone());
                console.log("🖼️ Gambar berhasil di-cache:", imageUrl);
              } else {
                console.warn(
                  "⚠️ Gagal fetch gambar:",
                  imageUrl,
                  imageResponse.status
                );
              }
            } catch (imgErr) {
              console.error("❌ Error caching gambar:", imageUrl, imgErr);
            }
          })
        );
      } catch (err) {
        console.error("❌ Error saat fetch produk:", err);

        // Offline fallback
        if (!navigator.onLine || err.message === "Network Error") {
          console.log("⚡ Mode offline - mencoba ambil dari cache...");
          try {
            const cache = await caches.open("products-cache");
            const cachedResponse = await cache.match("/product");

            if (cachedResponse) {
              const cachedData = await cachedResponse.json();
              const sortedCache = [...cachedData].sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              );
              const latestCache = sortedCache.slice(0, 4);
              setNewestProducts(latestCache);
              console.log("📦 Produk dari cache:", latestCache.length, "items");
            }
          } catch (cacheErr) {
            console.error("❌ Error saat ambil dari cache:", cacheErr);
          }
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

  const handleQuickView = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (product: Product) => {
    // Check stock before adding to cart
    if (product.quantity === 0) {
      toast.error("Produk ini sudah habis stoknya");
      return;
    }

    addToCart(product);
    console.log("Cart: ", product);
    toast.success(`${product.name} berhasil ditambahkan ke keranjang.`);
  };

  return (
    <main className="flex-1">
      {/* Hero Banner */}
      <section className="relative bg-gray-50">
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
          <div className="grid gap-6 md:gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4 text-center lg:text-left">
              <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl">
                Solusi Lengkap untuk Hunian Idaman.
              </h1>
              <p className="max-w-[600px] text-gray-500 text-sm md:text-base mx-auto lg:mx-0">
                Furnitur berkualitas premium untuk hunian. Dari meja hingga
                pintu bergaya, semuanya dirancang dengan penuh ketelitian.
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
                src={HeroImage || "/placeholder.svg"}
                alt="Furniture showcase"
                className="w-full max-w-[600px] h-full max-h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Newest Products */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="container mx-auto px-4 md:px-6">
          {/* Section Header */}
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 mb-3">
              Newest Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
              Jelajahi pilihan produk terkini yang dirancang dengan penuh
              perhatian.
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {newestProducts.map((product, index) => (
              <div
                key={product.id}
                className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Product Image Container */}
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
                    <button
                      onClick={() => handleQuickView(product.id)}
                      className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-white hover:scale-110"
                      aria-label={`Quick view ${product.name}`}
                    >
                      <Search className="h-4 w-4 text-gray-700" />
                    </button>
                  </div>

                  {/* Add to Cart Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 z-10">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.quantity === 0}
                      className={`inline-flex items-center justify-center rounded-full px-4 py-2.5 md:px-6 md:py-3 text-sm md:text-base font-medium text-white shadow-lg hover:shadow-xl transform transition-all duration-200 backdrop-blur-sm ${
                        product.quantity === 0
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600 active:bg-red-700 hover:scale-105"
                      }`}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                  </div>

                  {/* New Badge */}
                  <div className="absolute top-3 left-3 z-20">
                    <span className="inline-block px-2.5 py-1 text-xs font-semibold bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full shadow-sm">
                      New
                    </span>
                  </div>

                  {/* Out of Stock Badge */}
                  {product.quantity === 0 && (
                    <div className="absolute top-3 left-3 z-30">
                      <span className="inline-block px-2.5 py-1 text-xs font-semibold bg-gray-800 text-white rounded-full shadow-sm">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4 md:p-5 space-y-3">
                  {/* Category */}
                  <div className="mb-2">
                    <span className="inline-block px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                      {product.category.name}
                    </span>
                  </div>

                  {/* Product Name */}
                  <h3 className="text-sm md:text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors duration-200">
                    {product.name}
                  </h3>

                  {/* Price */}
                  <div className="mb-3">
                    <span className="text-lg md:text-xl font-bold text-red-500">
                      {formatPrice(product.price)}
                    </span>
                  </div>

                  {/* Stock Quantity */}
                  <div className="text-xs">
                    <span
                      className={`${
                        product.quantity === 0
                          ? "text-red-500 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      Stock:{" "}
                      {product.quantity === 0 ? "Habis" : product.quantity}
                    </span>
                  </div>

                  {/* View Details Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => handleQuickView(product.id)}
                      className="w-full inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-red-200 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]"
                    >
                      <Info className="mr-2 h-4 w-4" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="mt-12 md:mt-16 text-center">
            <Link to="/product">
              <button className="group inline-flex items-center justify-center rounded-full border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-red-200 px-8 py-3 text-base font-semibold text-gray-700 hover:text-red-600 shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Our Store */}
      <section className="bg-gray-50 py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-center mb-6 md:mb-8">
            Kenapa GM Candra Mebel
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="flex flex-col items-center text-center p-4 md:p-6">
                <ShieldCheck className="h-8 w-8 md:h-10 md:w-10 mb-3 md:mb-4 text-red-500" />
                <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">
                  Quality Guarantee
                </h3>
                <p className="text-xs md:text-sm text-gray-500">
                  Setiap produk dipilih dengan cermat untuk kualitas dan
                  ketahanan.
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
                  Butuh bantuan? Kami selalu tersedia untukmu.
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
                  Beragam metode pembayaran aman, demi kenyamanan transaksi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
