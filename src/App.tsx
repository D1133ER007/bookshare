import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Lazy load pages for better performance
const LandingPage = lazy(() => import("./pages/LandingPage"));
const BooksPage = lazy(() => import("./pages/BooksPage"));
const MyBooksPage = lazy(() => import("./pages/MyBooksPage"));
const TransactionsPage = lazy(() => import("./pages/TransactionsPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const PaymentSuccess = lazy(() => import("./pages/payment/PaymentSuccess"));
const PaymentFailure = lazy(() => import("./pages/payment/PaymentFailure"));

const LoadingFallback = () => (
  <div className="w-screen h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-lg">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/failure" element={<PaymentFailure />} />

          {/* Protected routes with layout */}
          <Route element={<MainLayout />}>
            <Route
              path="/books"
              element={
                <ProtectedRoute>
                  <BooksPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-books"
              element={
                <ProtectedRoute>
                  <MyBooksPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <TransactionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
