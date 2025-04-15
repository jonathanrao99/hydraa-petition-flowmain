
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoginPage from "./LoginPage";

// This component handles redirects based on authentication status
const Index = () => {
  const { isAuthenticated, currentUser } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // If authenticated, redirect to appropriate dashboard
  switch (currentUser?.role) {
    case "Reception":
      return <Navigate to="/reception" replace />;
    case "EnquiryOfficer":
      return <Navigate to="/officer" replace />;
    case "HOD":
      return <Navigate to="/commissioner" replace />;
    case "Admin":
      return <Navigate to="/admin" replace />;
    default:
      // Fallback
      return <LoginPage />;
  }
};

export default Index;
