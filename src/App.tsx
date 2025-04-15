
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AppShell from "@/components/layout/AppShell";
import LoginPage from "@/pages/LoginPage";
import ReceptionDashboard from "@/pages/dashboard/ReceptionDashboard";
import OfficerDashboard from "@/pages/dashboard/OfficerDashboard";
import CommissionerDashboard from "@/pages/dashboard/CommissionerDashboard";
import AdminDashboard from "@/pages/dashboard/AdminDashboard";
import NewPetitionForm from "@/pages/reception/NewPetitionForm";
import PetitionAssignment from "@/pages/commissioner/PetitionAssignment";
import FeedbackSubmission from "@/pages/officer/FeedbackSubmission";
import UserManagement from "@/pages/admin/UserManagement";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ 
  element, 
  allowedRoles = [], 
}: { 
  element: React.ReactNode, 
  allowedRoles?: string[],
}) => {
  const { isAuthenticated, currentUser } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (allowedRoles.length > 0 && currentUser && !allowedRoles.includes(currentUser.role)) {
    // Redirect to appropriate dashboard based on role
    switch (currentUser.role) {
      case "Reception":
        return <Navigate to="/reception" replace />;
      case "EnquiryOfficer":
        return <Navigate to="/officer" replace />;
      case "HOD":
        return <Navigate to="/commissioner" replace />;
      case "Admin":
        return <Navigate to="/admin" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }
  
  return <>{element}</>;
};

const AppRoutes = () => {
  const { isAuthenticated, currentUser } = useAuth();
  
  // If authenticated, redirect to appropriate dashboard
  const renderHome = () => {
    if (!isAuthenticated) {
      return <LoginPage />;
    }
    
    // Redirect based on user role
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
        return <LoginPage />;
    }
  };

  return (
    <Routes>
      <Route path="/" element={renderHome()} />
      
      {/* Reception routes */}
      <Route
        path="/reception"
        element={
          <ProtectedRoute
            element={<AppShell><ReceptionDashboard /></AppShell>}
            allowedRoles={["Reception", "Admin"]}
          />
        }
      />
      <Route
        path="/reception/new-petition"
        element={
          <ProtectedRoute
            element={<AppShell><NewPetitionForm /></AppShell>}
            allowedRoles={["Reception", "Admin"]}
          />
        }
      />
      <Route
        path="/reception/petitions"
        element={
          <ProtectedRoute
            element={<AppShell><ReceptionDashboard /></AppShell>}
            allowedRoles={["Reception", "Admin"]}
          />
        }
      />
      
      {/* Enquiry Officer routes */}
      <Route
        path="/officer"
        element={
          <ProtectedRoute
            element={<AppShell><OfficerDashboard /></AppShell>}
            allowedRoles={["EnquiryOfficer", "Admin"]}
          />
        }
      />
      <Route
        path="/officer/assigned"
        element={
          <ProtectedRoute
            element={<AppShell><OfficerDashboard /></AppShell>}
            allowedRoles={["EnquiryOfficer", "Admin"]}
          />
        }
      />
      <Route
        path="/officer/assigned/:id"
        element={
          <ProtectedRoute
            element={<AppShell><FeedbackSubmission /></AppShell>}
            allowedRoles={["EnquiryOfficer", "Admin"]}
          />
        }
      />
      <Route
        path="/officer/submissions"
        element={
          <ProtectedRoute
            element={<AppShell><OfficerDashboard /></AppShell>}
            allowedRoles={["EnquiryOfficer", "Admin"]}
          />
        }
      />
      
      {/* Commissioner (HOD) routes */}
      <Route
        path="/commissioner"
        element={
          <ProtectedRoute
            element={<AppShell><CommissionerDashboard /></AppShell>}
            allowedRoles={["HOD", "Admin"]}
          />
        }
      />
      <Route
        path="/commissioner/pending"
        element={
          <ProtectedRoute
            element={<AppShell><CommissionerDashboard /></AppShell>}
            allowedRoles={["HOD", "Admin"]}
          />
        }
      />
      <Route
        path="/commissioner/pending/:id"
        element={
          <ProtectedRoute
            element={<AppShell><PetitionAssignment /></AppShell>}
            allowedRoles={["HOD", "Admin"]}
          />
        }
      />
      <Route
        path="/commissioner/assigned"
        element={
          <ProtectedRoute
            element={<AppShell><CommissionerDashboard /></AppShell>}
            allowedRoles={["HOD", "Admin"]}
          />
        }
      />
      <Route
        path="/commissioner/decisions"
        element={
          <ProtectedRoute
            element={<AppShell><CommissionerDashboard /></AppShell>}
            allowedRoles={["HOD", "Admin"]}
          />
        }
      />
      
      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute
            element={<AppShell><AdminDashboard /></AppShell>}
            allowedRoles={["Admin"]}
          />
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute
            element={<AppShell><UserManagement /></AppShell>}
            allowedRoles={["Admin"]}
          />
        }
      />
      <Route
        path="/admin/petitions"
        element={
          <ProtectedRoute
            element={<AppShell><AdminDashboard /></AppShell>}
            allowedRoles={["Admin"]}
          />
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute
            element={<AppShell><AdminDashboard /></AppShell>}
            allowedRoles={["Admin"]}
          />
        }
      />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
