import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import useAuthStore from "@/store/authStore";
import toast from 'react-hot-toast';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalItems = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );
  
  // Ambil state auth dari store
  const { isAuthenticated, userRole, logout } = useAuthStore();
  
  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    setMobileMenuOpen(false); // Tutup mobile menu setelah logout
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4 md:gap-6 lg:gap-10">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/placeholder.svg?height=40&width=40"
              alt="GM Candra Mebel Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-base md:text-lg lg:text-xl font-bold">
              GM Candra Mebel
            </span>
          </Link>
          <nav className="hidden md:flex gap-4 lg:gap-6">
            <Link
              to="/"
              className="text-sm font-medium transition-colors hover:text-red-500"
            >
              Home
            </Link>
            <Link
              to="/product"
              className="text-sm font-medium transition-colors hover:text-red-500"
            >
              Shop
            </Link>
            {isAuthenticated && userRole === "ADMIN" && (
              <Link
                to="/dashboard"
                className="text-sm font-medium transition-colors hover:text-red-500"
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
          {/* Desktop Auth Button */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {userRole === "ADMIN" && (
                  <Link
                    to="/dashboard"
                    className="text-sm font-medium transition-colors hover:text-red-500"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium transition-colors hover:text-red-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <User className="h-5 w-5" />
                <span className="sr-only">Sign In</span>
              </Link>
            )}
          </div>
          
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
            </Link>
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                {totalItems}
              </span>
            )}
            <span className="sr-only">Cart</span>
          </button>
          <button
            className="p-2 rounded-full hover:bg-gray-100 transition-colors md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          ></div>
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white p-6 shadow-lg overflow-y-auto transition-transform transform-gpu">
            <div className="flex items-center justify-between mb-8">
              <Link
                to="/"
                className="flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <img
                  src="/placeholder.svg?height=40&width=40"
                  alt="GM Candra Mebel Logo"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="text-xl font-bold">GM Candra Mebel</span>
              </Link>
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-col space-y-6">
              <Link
                to="/"
                className="text-base font-medium transition-colors hover:text-red-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/product"
                className="text-base font-medium transition-colors hover:text-red-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop
              </Link>
              {isAuthenticated && userRole === "ADMIN" && (
                <Link
                  to="/dashboard"
                  className="text-base font-medium transition-colors hover:text-red-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
            </nav>
            <div className="mt-8 border-t pt-8">
              <div className="flex flex-col space-y-4">
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
