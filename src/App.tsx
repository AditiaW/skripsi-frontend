import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import DashboardLayout from "./pages/admin/dashboard/layout";
import DashboardHome from "./pages/admin/dashboard/components/main";
import HomepageShop from "./pages/shop/homepage/page";
import ShopPage from "./pages/shop/product/page";
import ShopDetail from "./pages/shop/product/[id]/page";
import Checkout from "./pages/shop/checkout/page";
import CheckoutSuccess from "./pages/shop/checkout/success/page";
import Cart from "./pages/shop/cart/page";
import { Toaster } from "react-hot-toast";
import UsersPage from "./pages/admin/dashboard/users/main";
import OrdersPage from "./pages/admin/dashboard/orders/main";
import CategoriesPage from "./pages/admin/dashboard/categories/main";
import ProductsPage from "./pages/admin/dashboard/products/main";
import ProtectedRoute from "./components/ProtectedRoute";
import UnauthorizedPage from "./pages/auth/UnauthorizedPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Shop Routes */}
        <Route path="/" element={<HomepageShop />} />
        <Route path="/product" element={<ShopPage />} />
        <Route path="/product/:id" element={<ShopDetail />} />
        <Route path="/cart" element={<Cart />} />

        {/* Protected Checkout Routes */}
        <Route 
          element={<ProtectedRoute requireAuth> <Checkout /> </ProtectedRoute>} 
          path="/checkout" 
        />
        <Route 
          element={<ProtectedRoute requireAuth> <CheckoutSuccess /> </ProtectedRoute>} 
          path="/checkout/success" 
        />

        {/* Admin Routes */}
        <Route
          element={
            <ProtectedRoute adminOnly>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard">
            <Route index element={<DashboardHome />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="products" element={<ProductsPage />} />
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
};

export default App;
