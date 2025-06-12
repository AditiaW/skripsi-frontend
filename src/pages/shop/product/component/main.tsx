import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Search,
  ChevronDown,
  Filter,
  X,
  Info,
} from "lucide-react";
import { Category, Product } from "@/types";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";
import axiosInstance from "@/api/axiosInstance";
import Fuse from "fuse.js";

export default function ShopPage() {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart } = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [fuse, setFuse] = useState<Fuse<Product> | null>(null);

  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const productsPerPage = 8;

  useEffect(() => {
    const fetchAndCacheProducts = async () => {
      try {
        const response = await axiosInstance.get("/product");
        const products = response.data;

        setProducts(products);

        await cacheProductList(products);
        await preloadProductImages(products);

        initFuseSearch(products);
      } catch (err) {
        console.error("❌ Error saat fetch produk:", err);

        if (!navigator.onLine || err.message === "Network Error") {
          console.log("⚡ Offline - mencoba ambil data dari cache...");
          const cachedProducts = await getCachedProducts();
          if (cachedProducts) {
            setProducts(cachedProducts);
            initFuseSearch(cachedProducts);
          } else {
            setProducts([]);
          }
        } else {
          setProducts([]);
        }
      }
    };

    fetchAndCacheProducts();

    const handleClickOutside = (event: MouseEvent) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setSortDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const cacheProductList = async (products: any[]) => {
    const cache = await caches.open("products-cache");
    const response = new Response(JSON.stringify(products), {
      headers: { "Content-Type": "application/json" },
    });
    await cache.put("/product", response);
  };

  const getCachedProducts = async () => {
    try {
      const cache = await caches.open("products-cache");
      const response = await cache.match("/product");
      if (response) {
        const data = await response.json();
        console.log("📦 Data dari cache:", data.length, "items");
        return Array.isArray(data) ? data : [];
      }
    } catch (err) {
      console.error("❌ Gagal ambil dari cache:", err);
    }
    return null;
  };

  const initFuseSearch = (data: any[]) => {
    const options = {
      keys: ["name", "category.name", "description"],
      includeScore: true,
      threshold: 0.4,
      minMatchCharLength: 2,
    };
    setFuse(new Fuse(data, options));
  };

  const preloadProductImages = async (products: any[]) => {
    products.forEach((p) => {
      if (p.imageUrl) {
        const img = new Image();
        img.src = p.imageUrl;
      }
    });
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} berhasil ditambahkan ke keranjang.`);
  };

  const uniqueCategories = products.reduce((acc: Category[], product) => {
    if (!acc.find((category) => category.id === product.category.id)) {
      acc.push(product.category);
    }
    return acc;
  }, []);

  const toggleCategory = (category: Category) => {
    setSelectedCategories((prev) => {
      if (prev.some((c) => c.id === category.id)) {
        return prev.filter((c) => c.id !== category.id);
      } else {
        return [...prev, category];
      }
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchQuery("");
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
    setCurrentPage(1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const getFilteredProducts = () => {
    let result = products;

    // Apply Fuse.js search if search query exists
    if (searchQuery && fuse) {
      const searchResults = fuse.search(searchQuery);
      result = searchResults.map((item) => item.item);
    }

    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.some(
          (category) => category.id === product.category.id
        )
      );
    }

    return result;
  };

  const filteredProducts = getFilteredProducts();

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "price-low") {
      return a.price - b.price;
    } else if (sortOption === "price-high") {
      return b.price - a.price;
    } else if (sortOption === "newest") {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
    return 0;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const FilterSidebar = () => (
    <div className="sticky top-20 bg-white rounded-lg shadow-sm border p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {selectedCategories.length > 0 && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-colors duration-200"
          >
            <svg
              className="w-3 h-3 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Clear all ({selectedCategories.length})
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center mb-4">
            <svg
              className="w-4 h-4 mr-2 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.023.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <h4 className="font-medium text-sm text-gray-900">Categories</h4>
            {selectedCategories.length > 0 && (
              <span className="ml-auto text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                {selectedCategories.length} selected
              </span>
            )}
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {uniqueCategories.map((category) => (
              <label
                key={category.id}
                htmlFor={`category-${category.id}-desktop`}
                className="group flex items-center space-x-3 cursor-pointer hover:bg-white rounded-lg p-2 transition-colors duration-150"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    id={`category-${category.id}-desktop`}
                    checked={selectedCategories.some(
                      (c) => c.id === category.id
                    )}
                    onChange={() => toggleCategory(category)}
                    className="h-4 w-4 rounded border-gray-300 text-red-500 focus:ring-red-500 focus:ring-2 focus:ring-offset-1"
                  />
                  {selectedCategories.some((c) => c.id === category.id) && (
                    <svg
                      className="absolute inset-0 w-4 h-4 text-white pointer-events-none"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium select-none">
                  {category.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {selectedCategories.length > 0 && (
        <div className="border-t pt-4">
          <p className="text-xs text-gray-500 mb-2">Active filters:</p>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((category) => (
              <span
                key={category.id}
                className="inline-flex items-center px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full"
              >
                {category.name}
                <button
                  onClick={() => toggleCategory(category)}
                  className="ml-1 hover:text-red-900"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Shop All Products
        </h1>
        <div className="flex items-center text-sm text-gray-500">
          <Link to="/" className="hover:text-red-500">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span>Shop</span>
        </div>
      </div>

      <div className="mb-6 relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            onChange={handleSearch}
            ref={searchInputRef}
            value={searchQuery}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                if (searchInputRef.current) {
                  searchInputRef.current.value = "";
                }
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        <div className="hidden md:block w-64 shrink-0">
          <FilterSidebar />
        </div>

        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileFiltersOpen(false)}
            ></div>
            <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-2xl overflow-y-auto">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Filters</h2>
                    <p className="text-red-100 text-sm mt-1">
                      Find your product
                    </p>
                  </div>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Categories Section */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 7h.01M7 3h5c.512 0 1.023.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Categories
                      </h3>
                    </div>
                    {selectedCategories.length > 0 && (
                      <button
                        onClick={clearFilters}
                        className="inline-flex items-center text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors"
                      >
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Clear ({selectedCategories.length})
                      </button>
                    )}
                  </div>

                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {uniqueCategories.map((category) => (
                      <label
                        key={category.id}
                        className="group flex items-center space-x-3 cursor-pointer hover:bg-white rounded-lg p-3 transition-all duration-200 border border-transparent hover:border-gray-200"
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={selectedCategories.some(
                              (c) => c.id === category.id
                            )}
                            onChange={() => toggleCategory(category)}
                            className="h-5 w-5 rounded-md border-2 border-gray-300 text-red-500 focus:ring-red-500 focus:ring-2 focus:ring-offset-1"
                          />
                          {selectedCategories.some(
                            (c) => c.id === category.id
                          ) && (
                            <svg
                              className="absolute inset-0 w-5 h-5 text-white pointer-events-none"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium flex-1">
                          {category.name}
                        </span>
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                          {
                            products.filter(
                              (p) => p.category.id === category.id
                            ).length
                          }
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Active Filters */}
                {selectedCategories.length > 0 && (
                  <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                    <div className="flex items-center mb-3">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-2">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-red-800">
                        Active Filters ({selectedCategories.length})
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedCategories.map((category) => (
                        <span
                          key={category.id}
                          className="inline-flex items-center px-3 py-2 text-sm bg-white text-red-700 rounded-lg border border-red-200 shadow-sm"
                        >
                          {category.name}
                          <button
                            onClick={() => toggleCategory(category)}
                            className="ml-2 p-1 hover:bg-red-100 rounded-full transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary Stats */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Products found</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {sortedProducts.length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 space-y-3">
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Show {sortedProducts.length} Products
                </button>
                {selectedCategories.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-xl transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2">
              <button
                className="md:hidden flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium bg-white hover:bg-gray-50 transition-colors shadow-sm"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
              <div className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-lg">
                <span className="text-sm font-semibold text-gray-800">
                  Total: {sortedProducts.length} products
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 ml-auto">
              <span className="text-sm text-gray-600 hidden sm:inline md:hidden font-medium bg-gray-50 px-3 py-1.5 rounded-full">
                {sortedProducts.length} products
              </span>
              <div className="relative" ref={sortDropdownRef}>
                <button
                  onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                  className="flex items-center justify-between min-w-[180px] px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors shadow-sm font-medium"
                >
                  <span className="text-gray-700">
                    {sortOption === "newest" && "✨ Newest Arrivals"}
                    {sortOption === "price-low" && "💰 Price: Low to High"}
                    {sortOption === "price-high" && "💎 Price: High to Low"}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform ${
                      sortDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {sortDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-[200px] rounded-xl bg-white shadow-xl z-20 border border-gray-100 overflow-hidden">
                    <div className="py-2">
                      <button
                        className={`block w-full text-left px-4 py-3 text-sm transition-colors ${
                          sortOption === "newest"
                            ? "bg-red-50 text-red-600 font-medium border-r-2 border-red-500"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => {
                          setSortOption("newest");
                          setSortDropdownOpen(false);
                        }}
                      >
                        ✨ Newest Arrivals
                      </button>
                      <button
                        className={`block w-full text-left px-4 py-3 text-sm transition-colors ${
                          sortOption === "price-low"
                            ? "bg-red-50 text-red-600 font-medium border-r-2 border-red-500"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => {
                          setSortOption("price-low");
                          setSortDropdownOpen(false);
                        }}
                      >
                        💰 Price: Low to High
                      </button>
                      <button
                        className={`block w-full text-left px-4 py-3 text-sm transition-colors ${
                          sortOption === "price-high"
                            ? "bg-red-50 text-red-600 font-medium border-r-2 border-red-500"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => {
                          setSortOption("price-high");
                          setSortDropdownOpen(false);
                        }}
                      >
                        💎 Price: High to Low
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {currentProducts.length === 0 ? (
            <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  No products found
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Produk tidak ditemukan. Ubah filter atau kata kunci untuk
                  melihat pilihan menarik lainnya.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {currentProducts.map((product) => (
                <div
                  key={product.id}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                    <div className="absolute inset-x-4 bottom-4 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                      <button
                        className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:from-red-600 hover:to-red-700 hover:shadow-xl transition-all duration-200"
                        onClick={(e) => handleAddToCart(e, product)}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </button>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex justify-center">
                      <span className="inline-block px-3 py-1.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                        {product.category.name}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm md:text-base line-clamp-2 text-gray-800 text-center leading-snug min-h-[2.5rem] flex items-center justify-center">
                      {product.name}
                    </h3>
                    <div className="flex justify-center">
                      <span className="text-red-600 font-bold text-lg md:text-xl">
                        {formatPrice(product.price)}
                      </span>
                    </div>

                    <div className="flex justify-center">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          product.quantity > 10
                            ? "bg-green-100 text-green-700"
                            : product.quantity > 0
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.quantity > 0
                          ? `Stock: ${product.quantity}`
                          : "Out of Stock"}
                      </span>
                    </div>

                    <div className="pt-2">
                      <Link
                        to={`/product/${product.id}`}
                        className="w-full inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-red-200 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]"
                      >
                        <Info className="mr-2 h-4 w-4" />
                        View Detail
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-center space-x-3 mt-16">
            <button
              className="w-12 h-12 flex items-center justify-center rounded-xl border border-gray-300 bg-white text-gray-400 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ChevronDown className="h-5 w-5 rotate-90" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`w-10 h-10 flex items-center justify-center rounded-xl ${
                  currentPage === page
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                    : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                } font-medium transition-all duration-200 shadow-sm`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              className="w-12 h-12 flex items-center justify-center rounded-xl border border-gray-300 bg-white text-gray-400 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <ChevronDown className="h-5 w-5 -rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
