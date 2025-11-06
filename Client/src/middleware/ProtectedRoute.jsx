import { Navigate, Outlet } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useApp();

  // ✅ Not logged in
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // ❌ Role not allowed
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // ✅ Allowed — render nested routes
  return <Outlet />;
};

export default ProtectedRoute;
