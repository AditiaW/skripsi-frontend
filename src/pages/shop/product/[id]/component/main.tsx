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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/product/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError("Failed to load product");
        console.error("Error fetching product:", err);
        toast.error("Gagal memuat produk");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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
    if (product) {
      addToCart(product, quantity);
      toast.success(`${quantity} ${product.name} ditambahkan ke keranjang!`);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading product...</h1>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <p className="text-gray-500 mb-8">
          The product you are looking for does not exist.
        </p>
        <button
          onClick={() => navigate("/shop")}
          className="inline-flex items-center justify-center rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-10 lg:py-12">
      {/* Breadcrumb */}
      <div className="hidden md:flex items-center text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-red-500">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link to="/shop" className="hover:text-red-500">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{product.name}</span>
      </div>

      {/* Back button - mobile only */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center text-sm font-medium text-gray-700 mb-4 md:hidden"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </button>

      {/* Product Details */}
      <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-contain p-4"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </div>

        {/* Product Info */}
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
            <p className="mt-2 text-sm text-gray-500">
              Stok tersedia: {product.quantity}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-sm font-medium w-24">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <button
                  onClick={decrementQuantity}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-red-500 disabled:opacity-50 touch-manipulation"
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-red-500 disabled:opacity-50 touch-manipulation"
                  disabled={quantity >= product.quantity}
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 inline-flex items-center justify-center rounded-md bg-red-500 px-4 py-3 text-sm font-medium text-white shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
