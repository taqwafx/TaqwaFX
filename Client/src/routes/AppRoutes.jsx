import { Route, Routes } from "react-router-dom";

// other pages
import LandingPage from "../pages/LandingPage.jsx";
import Login from "../pages/Login.jsx";
import NotFound from "../pages/NotFound.jsx";

// Middelware
import ProtectedRoute from "../middleware/ProtectedRoute.jsx";

// Layouts
import AppLayout from "../layouts/AppLayout.jsx";

// admin pages
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import Investors from "../pages/admin/Investors.jsx";
import Investor from "../pages/admin/Investor.jsx";
import Investment from "../pages/admin/Investment.jsx";
import Plans from "../pages/admin/Plans.jsx";

// user pages
import UserDashboard from "../pages/user/UserDashboard.jsx";
import UserInvestments from "../pages/user/UserInvestments.jsx";
import UserInvestment from "../pages/user/UserInvestment.jsx";
import UserPlans from "../pages/user/UserPlans.jsx";

import "flowbite";
import "flowbite-react";
import Transactions from "../pages/admin/Transactions.jsx";
import ScrollToTop from "../components/ScrollToTop.jsx";
import AffiliateIB from "../pages/admin/AffiliateIB.jsx";
import UserAffiliateIB from "../pages/user/UserAffiliateIB.jsx";
import UserAffiliateIBInvestments from "../pages/user/UserAffiliateIBInvestments.jsx";
import AffiliateIBDetails from "../pages/admin/AffiliateIBDetails.jsx";
import Settings from "../pages/admin/Settings.jsx";
import Auth2FASetup from "../pages/Auth2FASetup.jsx";
import Auth2FACheck from "../pages/Auth2FACheck.jsx";

const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/login/" element={<Login />} />
        <Route path="/auth/2fa-setup/" element={<Auth2FASetup />} />
        <Route path="/auth/2fa-check/" element={<Auth2FACheck />} />

        <Route element={<AppLayout />}>
          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/investors" element={<Investors />} />
            <Route path="/admin/investors/:investorId" element={<Investor />} />
            <Route
              path="/admin/investors/:investorId/investment/:investmentId"
              element={<Investment />}
            />
            <Route path="/admin/plans" element={<Plans />} />
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="/admin/transactions" element={<Transactions />} />
            <Route path="/admin/affiliateIB" element={<AffiliateIB />} />
            <Route
              path="/admin/affiliateIB/:affiliateIBId"
              element={<AffiliateIBDetails />}
            />
          </Route>

          {/* User Routes */}
          <Route element={<ProtectedRoute allowedRoles={["investor"]} />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/investments" element={<UserInvestments />} />
            <Route
              path="/user/investments/:investmentId"
              element={<UserInvestment />}
            />
            <Route path="/user/plans" element={<UserPlans />} />
            <Route path="/user/settings" element={<Settings />} />
            <Route path="/user/affiliateIB" element={<UserAffiliateIB />} />
            <Route
              path="/user/affiliateIB/referral/:investorId"
              element={<UserAffiliateIBInvestments />}
            />
          </Route>
        </Route>

        {/* Catch-all Route (optional) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
