import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider, useAuth } from "./context/auth.context";
import Login from "./components/Login.tsx";
import Dashboard from "./components/Dashboard.tsx";
import VenueList from "./components/venue/VenueList.tsx";
import ContactList from "./components/contact/ContactList.tsx";
import OffenderList from "./components/offender/OffenderList.tsx";
import UserList from "./components/user/UserList.tsx";
import Register from "./components/Register.tsx";
import Account from "./components/account/Account.tsx";
import AppNavbar from "./components/Navbar";
import { PermissionType } from "./util/usePermissions.ts";
import Reporting from "./components/reporting/Reporting.tsx";
import BanManagement from "./components/ban/BanReporting.tsx";
import WarningManagement from "./components/warning/WarningReporting.tsx";
import IncidentReporting from "./components/incident/IncidentReporting.tsx";
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: PermissionType;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
}) => {

  return <>{children}</>;
};

function AppContent() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <AppNavbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/venues"
          element={
            <ProtectedRoute requiredPermission="VIEW_VENUES">
              <VenueList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contacts"
          element={
            <ProtectedRoute requiredPermission="VIEW_CONTACTS">
              <ContactList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/offenders"
          element={
            <ProtectedRoute requiredPermission="MANAGE_OFFENDERS">
              <OffenderList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute requiredPermission="MANAGE_USERS">
              <UserList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/incidents"
          element={
            <ProtectedRoute requiredPermission="VIEW_INCIDENTS">
              <IncidentReporting />
            </ProtectedRoute>
          }
        />
        <Route
          path="/warnings"
          element={
            <ProtectedRoute requiredPermission="VIEW_WARNINGS">
              <WarningManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bans"
          element={
            <ProtectedRoute requiredPermission="VIEW_BANS">
              <BanManagement />
            </ProtectedRoute>
          }
        />
        <Route path="/register" 
        element={
        <Register />} 
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reporting"
          element={
            <ProtectedRoute>
              <Reporting />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
