import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();

  if (loading) return null; // o un spinner ⏳

  if (!user) return <Navigate to="/login" />;
  if (requiredRole && user.rol !== requiredRole) return <Navigate to="/login" />;

  return children;
}
