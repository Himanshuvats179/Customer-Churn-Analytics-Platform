import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../features/user/userSlice";
import Auth from "../pages/Auth";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Prediction from "../pages/Prediction";

/**
 * Route guard for pages requiring authentication.
 * If the user is not logged in, redirects them to the Auth page.
 */
const ProtectedRoute = ({ children }) => {
    const user = useSelector(selectUser);
    return user ? children : <Navigate to="/" replace />;
};

/**
 * Route guard for auth pages.
 * If the user is already logged in, redirects them to the Dashboard page.
 */
const PublicRoute = ({ children }) => {
    const user = useSelector(selectUser);
    return !user ? children : <Navigate to="/dashboard" replace />;
};

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Login / Register Toggle Page */}
                <Route
                    path="/"
                    element={
                        <PublicRoute>
                            <Auth />
                        </PublicRoute>
                    }
                />

                {/* Protected Application Workspace */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/predict"
                    element={
                        <ProtectedRoute>
                            <Prediction />
                        </ProtectedRoute>
                    }
                />

                {/* Fallback Route redirects to default */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;