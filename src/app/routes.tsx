import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Portfolio } from "./pages/Portfolio";
import { Services } from "./pages/Services";
import { Booking } from "./pages/Booking";
import { Contact } from "./pages/Contact";
import { About } from "./pages/About";
import { ProtectedAdminLayout } from "./components/ProtectedAdminLayout";
import { AdminLogin } from "./pages/admin/Login";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { AdminBookings } from "./pages/admin/Bookings";
import { AdminPortfolio } from "./pages/admin/Portfolio";
import { AdminServices } from "./pages/admin/Services";
import { AdminCalendar } from "./pages/admin/Calendar";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "portfolio", Component: Portfolio },
      { path: "services", Component: Services },
      { path: "booking", Component: Booking },
      { path: "contact", Component: Contact },
      { path: "about", Component: About },
    ],
  },
  {
    path: "/admin/login",
    Component: AdminLogin,
  },
  {
    path: "/admin",
    Component: ProtectedAdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "bookings", Component: AdminBookings },
      { path: "portfolio", Component: AdminPortfolio },
      { path: "services", Component: AdminServices },
      { path: "calendar", Component: AdminCalendar },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);