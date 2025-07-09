
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import type { JSX } from "react";

const PrivateRoute = ({
  children,
  allowedRoles,
}: {
  children: JSX.Element;
  allowedRoles: string[];
}) => {
  const { user, loading } = useAuth(); // Make sure your useAuth provides loading state

  console.log("🔐 PrivateRoute user:", user);
  console.log("🔐 Allowed roles:", allowedRoles);

  if (loading) return <p className="text-center mt-10">Loading...</p>; // ⏳ Avoid redirecting before auth loads

  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" />;

  return children;
};

export default PrivateRoute;
