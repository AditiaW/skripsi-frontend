import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t bg-white mt-8">
      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        {/* Top Footer Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Brand Column */}
          <div className="space-y-4 flex flex-col items-center text-center sm:items-start sm:text-left col-span-1">
            <Link
              to="/"
              className="flex items-center gap-2 justify-center sm:justify-start"
            >
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-red-100">
                <img
                  src="/placeholder.svg?height=40&width=40"
                  alt="GM Candra Mebel Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl font-bold">GM Candra Mebel</span>
            </Link>
            <p className="text-sm text-gray-500 max-w-xs">
              Premium quality furniture for your home. From stylish tables or
              doors, all designed with care.
            </p>
          </div>

          {/* Navigation Column */}
          <div className="space-y-4 flex flex-col items-center text-center sm:items-start sm:text-left">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 pb-1 border-b-2 border-red-100">
              Navigation
            </h3>
            <nav className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-sm text-gray-500 hover:text-red-500 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/product"
                className="text-sm text-gray-500 hover:text-red-500 transition-colors"
              >
                Shop
              </Link>
              <Link
                to="/login"
                className="text-sm text-gray-500 hover:text-red-500 transition-colors"
              >
                Login
              </Link>
            </nav>
          </div>

          {/* Contact Column */}
          <div className="space-y-4 flex flex-col items-center text-center sm:items-start sm:text-left">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 pb-1 border-b-2 border-red-100">
              Contact Us
            </h3>
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-red-500"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span className="text-sm text-gray-500">+62 123 4567 890</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-red-500"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span className="text-sm text-gray-500">
                  support@gmcandramebel.shop
                </span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-red-500"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span className="text-sm text-gray-500">
                  Jl. Komodor Yos Sudarso, Pontianak Barat, Pontianak 78113
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="max-w-6xl mx-auto">
          <div className="border-t border-gray-200 my-8"></div>
        </div>

        {/* Bottom Footer */}
        <div className="flex justify-center max-w-6xl mx-auto">
          <p className="text-sm text-gray-500 text-center">
            &copy; {new Date().getFullYear()} GM Candra Mebel. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
