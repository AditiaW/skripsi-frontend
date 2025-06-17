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
import AuthRoute from "./components/AuthRoute";
import UnauthorizedPage from "./pages/auth/UnauthorizedPage";
import VerifyEmail from "./pages/auth/VerifyEmail";
import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { messaging, requestForToken } from "./lib/firebase";

const App = () => {
  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);

      const notificationTitle = payload.notification?.title || "New Message";
      const notificationOptions = {
        body: payload.notification?.body || "You have a new message!",
        icon: "/shop.png",
      };

      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          if (navigator.serviceWorker.controller) {
            registration.showNotification(
              notificationTitle,
              notificationOptions
            );
          } else {
            console.warn(
              "ServiceWorker controller not ready, notification skipped."
            );
          }
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // useEffect(() => {
  //   const fetchToken = async () => {
  //     try {
  //       const token = await requestForToken();
  //       console.log("Ini Tempat Tampung token terpisah: ", token)
  //     } catch (error) {
  //       console.error("Error getting FCM token:", error);
  //     }
  //   };

  //   fetchToken();
  // }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes - Users who are already logged in cannot access this page */}
        <Route
          path="/login"
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          }
        />
        <Route
          path="/register"
          element={
            <AuthRoute>
              <Register />
            </AuthRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <AuthRoute>
              <ForgotPassword />
            </AuthRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <AuthRoute>
              <ResetPassword />
            </AuthRoute>
          }
        />
        <Route
          path="/verify-email"
          element={
            <AuthRoute>
              <VerifyEmail />
            </AuthRoute>
          }
        />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Public Shop Routes */}
        <Route path="/" element={<HomepageShop />} />
        <Route path="/product" element={<ShopPage />} />
        <Route path="/product/:id" element={<ShopDetail />} />
        <Route path="/cart" element={<Cart />} />

        {/* Protected Checkout Routes */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute requireAuth>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout/success"
          element={
            <ProtectedRoute requireAuth>
              <CheckoutSuccess />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute adminOnly>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="products" element={<ProductsPage />} />
        </Route>
      </Routes>
      <Toaster position="top-center" />
    </BrowserRouter>
  );
};

export default App;
