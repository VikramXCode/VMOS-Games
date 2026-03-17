import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BookingPage from "./pages/BookingPage";
import ShopPage from "./pages/ShopPage";
import TournamentsPage from "./pages/TournamentsPage";
import { GalleryPage } from "./pages/GalleryPage";
import { LeaderboardPage } from "./pages/LeaderboardPage";
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AdminOverviewPage } from "./pages/admin/AdminOverviewPage";
import { AdminBookingsPage } from "./pages/admin/AdminBookingsPage";
import { AdminSlotsPage } from "./pages/admin/AdminSlotsPage";
import { AdminTournamentsPage } from "./pages/admin/AdminTournamentsPage";
import { AdminProductsPage } from "./pages/admin/AdminProductsPage";
import { AdminCustomersPage } from "./pages/admin/AdminCustomersPage";
import { AdminAIInsightsPage } from "./pages/admin/AdminAIInsightsPage";
import { AdminGuard } from "@/components/admin/AdminGuard";

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/booking" element={<BookingPage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/tournaments" element={<TournamentsPage />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminGuard />}>
        <Route path="overview" element={<AdminOverviewPage />} />
        <Route path="bookings" element={<AdminBookingsPage />} />
        <Route path="slots" element={<AdminSlotsPage />} />
        <Route path="tournaments" element={<AdminTournamentsPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="customers" element={<AdminCustomersPage />} />
        <Route path="insights" element={<AdminAIInsightsPage />} />
        <Route index element={<Navigate to="overview" replace />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
