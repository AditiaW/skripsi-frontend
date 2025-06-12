import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Store,
  ChevronDown,
  LogOut,
  UserCircle,
  Home,
  ShoppingBag,
  LayoutDashboard,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import useAuthStore from "@/store/authStore";
import toast from "react-hot-toast";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled] = useState(false);
  const [cartHover, setCartHover] = useState(false);
  const userDropdownRef = useRef(null);
  const navigate = useNavigate();

  // Access to cart store
  const totalItems = useCartStore((state) => {
    try {
      return (
        state?.items?.reduce(
          (total, item) => total + (item?.quantity || 0),
          0
        ) || 0
      );
    } catch (error) {
      console.error("Error accessing cart store:", error);
      return 0;
    }
  });

  // Access to auth store
  const authState = useAuthStore();
  const isAuthenticated = authState?.isAuthenticated || false;
  const userRole = authState?.userRole || null;
  const user = authState?.user || null;

  const handleLogout = () => {
    try {
      authState?.logout?.();
      toast.success("Logged out successfully");
      setMobileMenuOpen(false);
      setUserDropdownOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      try {
        if (
          userDropdownRef.current &&
          !userDropdownRef.current.contains(event.target)
        ) {
          setUserDropdownOpen(false);
        }
      } catch (error) {
        console.error("Click outside error:", error);
      }
    };

    try {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    } catch (error) {
      console.error("Event listener error:", error);
    }
  }, []);

  const handleNavClick = (path) => {
    try {
      navigate(path);
      setMobileMenuOpen(false);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const navItems = [
    { to: "/", label: "Home", icon: <Home className="w-5 h-5" /> },
    {
      to: "/product",
      label: "Shop",
      icon: <ShoppingBag className="w-5 h-5" />,
    },
  ];

  // User name display
  const displayName = user?.name ? user.name.split(" ")[0] : "User";

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-white border-b border-gray-100"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo Section */}
        <div className="flex items-center gap-4 md:gap-6 lg:gap-8">
          <Link
            to="/"
            className="flex items-center gap-2 group transition-transform hover:scale-105"
          >
            <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-md group-hover:shadow-lg transition-all duration-300">
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="text-base md:text-lg font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
              GM Candra Mebel
            </span>
          </Link>

          {/* Desktop Navigation - Only basic items */}
          <nav className="hidden md:flex gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg transition-all duration-200 hover:text-red-600 hover:bg-red-50 group"
              >
                <span className="opacity-70 group-hover:opacity-100">
                  {item.icon}
                </span>
                {item.label}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-4/5 transform -translate-x-1/2"></span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop User Section */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
                  aria-expanded={userDropdownOpen}
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-sm">
                    <UserCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-red-600">
                    {displayName}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      userDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* User Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email || ""}
                      </p>
                    </div>

                    {/* Dashboard Link for Admin */}
                    {isAuthenticated && userRole === "ADMIN" && (
                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleNavClick("/login")}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 hover:shadow-md active:scale-95"
              >
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">Sign In</span>
              </button>
            )}
          </div>

          {/* Cart Button */}
          <div className="relative">
            <button
              onClick={() => handleNavClick("/cart")}
              className="relative p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
              onMouseEnter={() => setCartHover(true)}
              onMouseLeave={() => setCartHover(false)}
              aria-label="Shopping Cart"
            >
              <ShoppingCart
                className={`h-5 w-5 transition-all duration-200 ${
                  cartHover ? "text-red-600" : "text-gray-700"
                }`}
              />

              {/* Cart Badge */}
              {totalItems > 0 && (
                <span
                  className={`absolute -right-1 -top-1 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium transition-all duration-300 ${
                    cartHover ? "bg-red-600" : ""
                  }`}
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>

            {/* Cart Hover Tooltip */}
            {cartHover && (
              <div className="absolute -bottom-9 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-50 pointer-events-none animate-in fade-in">
                {totalItems === 0
                  ? "Cart is empty"
                  : `${totalItems} item${totalItems > 1 ? "s" : ""}`}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-gray-700" />
            ) : (
              <Menu className="h-5 w-5 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden animate-in fade-in"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Mobile Menu Panel */}
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-white shadow-xl md:hidden animate-in slide-in-from-right-80">
            <div className="flex flex-col h-full">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <Link
                  to="/"
                  className="flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-red-600">
                    <Store className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                    GM Candra Mebel
                  </span>
                </Link>
                <button
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5 text-gray-700" />
                </button>
              </div>

              {/* Mobile Navigation - Full height with no scrolling */}
              <div className="flex-1 flex flex-col">
                <nav className="flex-1 px-4 py-4">
                  <div className="space-y-1">
                    {navItems.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 w-full px-4 py-3 text-base font-medium text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <span className="text-gray-500">{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}

                    {/* Admin Dashboard in Mobile */}
                    {isAuthenticated && userRole === "ADMIN" && (
                      <Link
                        to="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 w-full px-4 py-3 text-base font-medium text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <LayoutDashboard className="w-5 h-5 text-gray-500" />
                        Dashboard
                      </Link>
                    )}
                  </div>
                </nav>

                {/* Mobile Auth Section */}
                <div className="p-4 border-t border-gray-100 bg-gray-50">
                  {isAuthenticated ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-sm">
                          <UserCircle className="w-5 h-5 text-white" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user?.name || "User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user?.email || ""}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium shadow-sm"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleNavClick("/login")}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-md"
                    >
                      <User className="w-4 h-4" />
                      Sign In
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
