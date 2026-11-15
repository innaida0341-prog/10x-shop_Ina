import { lazy } from "react";
import type { ReactElement } from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "./ProtectedRoute";

const CatalogPage = lazy(() => import("@/pages/CatalogPage"));
const ProductPage = lazy(() => import("@/pages/ProductPage"));
const CartPage = lazy(() => import("@/pages/CartPage"));
const CheckoutPage = lazy(() => import("@/pages/CheckoutPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const OrdersPage = lazy(() => import("@/pages/OrdersPage"));
const OrderDetailsPage = lazy(() => import("@/pages/OrderDetailsPage"));
const InvoicePage = lazy(() => import("@/pages/InvoicePage"));
const WishlistPage = lazy(() => import("@/pages/WishlistPage"));
const AddressesPage = lazy(() => import("@/pages/AddressesPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

export function AppRoutes(): ReactElement {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailsPage />} />
          <Route path="/addresses" element={<AddressesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/orders/:id/invoice" element={<InvoicePage />} />
      </Route>
    </Routes>
  );
}