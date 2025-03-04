import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Lazy load pages for better performance
const LandingPage = lazy(() => import("./pages/LandingPage"));
const BooksPage = lazy(() => import("./pages/BooksPage"));
const MyBooksPage = lazy(() => import("./pages/MyBooksPage"));
const TransactionsPage = lazy(() => import("./pages/TransactionsPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));

function App() {
  return (
    <AuthProvider>
      <Suspense
        fallback={
          <div className="w-screen h-screen flex items-center justify-center">
            <p>Loading...</p>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/my-books" element={<MyBooksPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
