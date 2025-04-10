import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Search, ChevronDown, Filter, X } from "lucide-react";
import { Category, Product } from "@/types";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";
import axiosInstance from "@/api/axiosInstance";

export default function ShopPage() {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart } = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);

  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/product");
        setProducts(response.data);
      } catch (err) {
        toast.error("Gagal memuat produk");
        console.log("Error Fetch Product: ", err);
      }
    };

    fetchProducts();

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

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} ditambahkan ke keranjang!`);
  };

  // Get unique categories from products
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
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter products based on selected categories and search query
  const filteredProducts = products.filter((product) => {
    // Filter by category
    if (
      selectedCategories.length > 0 &&
      !selectedCategories.some((category) => category.id === product.category.id)
    ) {
      return false;
    }

    // Filter by search query
    if (
      searchQuery &&
      !product.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Sort products based on selected sort option
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

  // Format price to IDR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const FilterSidebar = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={`space-y-6 ${isMobile ? "" : "sticky top-20"}`}>
      <div className="flex items-center justify-between">
        {selectedCategories.length > 0 && (
          <button
            onClick={clearFilters}
            className="h-8 text-xs text-red-500 hover:text-red-600 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Categories */}
        <div className="border-b pb-4">
          <h4 className="font-medium text-sm mb-3">Categories</h4>
          <div className="space-y-2">
            {uniqueCategories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`category-${category.id}-${
                    isMobile ? "mobile" : "desktop"
                  }`}
                  checked={selectedCategories.some((c) => c.id === category.id)}
                  onChange={() => toggleCategory(category)}
                  className="h-4 w-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
                />
                <label
                  htmlFor={`category-${category.id}-${
                    isMobile ? "mobile" : "desktop"
                  }`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
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

      {/* Search Bar - Full Width */}
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
        {/* Filters - Desktop */}
        <div className="hidden md:block w-64 shrink-0">
          <FilterSidebar />
        </div>

        {/* Filters - Mobile */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setMobileFiltersOpen(false)}
            ></div>
            <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white p-6 shadow-lg overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </button>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-500">
                  Narrow down your product search
                </p>
              </div>
              <FilterSidebar isMobile={true} />
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <button
                className="md:hidden flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>

              {/* Active filters */}
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map((category) => (
                  <span
                    key={`cat-${category.id}`}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-100"
                  >
                    {category.name}
                    <button onClick={() => toggleCategory(category)}>
                      <X className="h-3 w-3 cursor-pointer" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-gray-500 hidden sm:inline">
                {sortedProducts.length} products
              </span>
              <div className="relative" ref={sortDropdownRef}>
                <button
                  onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                  className="flex items-center justify-between w-[180px] px-3 py-2 text-sm border border-gray-300 rounded-md bg-white"
                >
                  <span>
                    {sortOption === "newest" && "Newest Arrivals"}
                    {sortOption === "price-low" && "Price: Low to High"}
                    {sortOption === "price-high" && "Price: High to Low"}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </button>
                {sortDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-[180px] rounded-md bg-white shadow-lg z-10 border border-gray-200">
                    <div className="py-1">
                      <button
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          sortOption === "newest"
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => {
                          setSortOption("newest");
                          setSortDropdownOpen(false);
                        }}
                      >
                        Newest Arrivals
                      </button>
                      <button
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          sortOption === "price-low"
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => {
                          setSortOption("price-low");
                          setSortDropdownOpen(false);
                        }}
                      >
                        Price: Low to High
                      </button>
                      <button
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          sortOption === "price-high"
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => {
                          setSortOption("price-high");
                          setSortDropdownOpen(false);
                        }}
                      >
                        Price: High to Low
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {sortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your filters or search query to find what you're
                looking for.
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {sortedProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="group relative"
                >
                  <div className="aspect-square overflow-hidden rounded-lg bg-white border border-gray-200">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <button
                        className="h-8 w-8 rounded-full bg-white/80 flex items-center justify-center shadow-sm opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white"
                        onClick={(e) => {
                          e.preventDefault();
                          // Navigate to product id functionality
                        }}
                      >
                        <Search className="h-4 w-4" />
                        <span className="sr-only">Quick view</span>
                      </button>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        className="inline-flex items-center justify-center rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-red-600 focus:outline-none"
                        onClick={(e) => handleAddToCart(e, product)}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 space-y-1 text-center">
                    <span className="inline-block px-2 py-1 text-xs rounded-full border border-gray-200 mb-2">
                      {product.category.name}
                    </span>
                    <h3 className="font-medium text-sm md:text-base line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex justify-center gap-2">
                      <span className="text-red-500 font-medium text-xs md:text-sm">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-center space-x-2 mt-12">
            <button
              className="w-10 h-10 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              disabled
            >
              <ChevronDown className="h-4 w-4 rotate-90" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md bg-red-500 text-white hover:bg-red-600">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
              3
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
              <ChevronDown className="h-4 w-4 -rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
