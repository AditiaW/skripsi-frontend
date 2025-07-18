import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Minus, Plus } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/types";
import toast from "react-hot-toast";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/product/${id}`);
        const productData = response.data;
        setProduct(productData);
        preloadImage(productData.image);
      } catch (err: any) {
        console.error("❌ Error fetching product:", err);

        if (!navigator.onLine || err.message === "Network Error") {
          console.log("⚡ Offline mode - ambil dari cache list...");
          const cachedProduct = await getProductFromListCache(id);
          if (cachedProduct) {
            setProduct(cachedProduct);
            preloadImage(cachedProduct.image);
          } else {
            setError("Produk tidak tersedia di cache.");
          }
        } else {
          setError("Gagal memuat produk.");
        }
      }
    };

    fetchProduct();
  }, [id]);

  const getProductFromListCache = async (
    id: string
  ): Promise<Product | null> => {
    try {
      const cache = await caches.open("products-cache");
      const cachedResponse = await cache.match("/product");
      if (cachedResponse) {
        const allProducts: Product[] = await cachedResponse.json();
        return allProducts.find((p) => String(p.id) === id) ?? null;
      }
      return null;
    } catch (err) {
      console.error("❌ Gagal akses cache list:", err);
      return null;
    }
  };

  const preloadImage = (url?: string) => {
    if (url) {
      const img = new Image();
      img.src = url;
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    // Check stock before adding to cart
    if (product.quantity === 0) {
      toast.error("Produk ini sudah habis stoknya");
      return;
    }

    // Check if requested quantity exceeds available stock
    if (quantity > product.quantity) {
      toast.error(
        `Tidak bisa menambahkan lebih dari stok yang tersedia (${product.quantity})`
      );
      return;
    }

    addToCart(product, quantity);
    toast.success(
      `${quantity} ${product.name} berhasil ditambahkan ke keranjang.`
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <p className="text-gray-500 mb-8">
          Produk yang kamu cari tidak tersedia.
        </p>
        <button
          onClick={() => navigate("/product")}
          className="inline-flex items-center justify-center rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-10 lg:py-12">
      <div className="hidden md:flex items-center text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-red-500">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link to="/product" className="hover:text-red-500">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{product.name}</span>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center text-sm font-medium text-gray-700 mb-4 md:hidden"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </button>

      <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
        <div className="relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-contain p-4"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />

          {/* Out of Stock Overlay */}
          {product.quantity === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
                Out of Stock
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-5">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
              {product.name}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {product.category.name}
            </p>
          </div>

          <div className="text-2xl md:text-3xl font-bold text-red-500">
            {formatPrice(product.price)}
          </div>

          <div className="border-t border-b py-4">
            <p className="text-gray-700">{product.description}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm font-medium">Stock:</span>
              <span
                className={`text-sm ${
                  product.quantity === 0
                    ? "text-red-500 font-medium"
                    : product.quantity <= 5
                    ? "text-orange-500 font-medium"
                    : "text-green-500"
                }`}
              >
                {product.quantity === 0
                  ? "Habis"
                  : product.quantity <= 5
                  ? `${product.quantity} (Stok terbatas)`
                  : `${product.quantity} tersedia`}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-sm font-medium w-24">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <button
                  onClick={decrementQuantity}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                  disabled={quantity <= 1 || product.quantity === 0}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                  disabled={
                    quantity >= product.quantity || product.quantity === 0
                  }
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {product.quantity > 0 && (
                <span className="ml-3 text-sm text-gray-500">
                  Max: {product.quantity}
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.quantity === 0}
                className={`flex-1 inline-flex items-center justify-center rounded-md px-4 py-3 text-sm font-medium shadow focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                  product.quantity === 0
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500"
                }`}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>

            {/* Stock Warning */}
            {product.quantity > 0 && product.quantity <= 5 && (
              <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
                <p className="text-sm text-orange-800">
                  ⚠️ Stok terbatas! Hanya tersisa {product.quantity} item.
                </p>
              </div>
            )}

            {/* Out of Stock Notice */}
            {product.quantity === 0 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-800">
                  ❌ Produk ini sedang habis stok. Silakan cek kembali nanti.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
