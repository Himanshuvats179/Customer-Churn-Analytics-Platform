import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../features/user/userSlice";

/**
 * Sidebar Component
 * Side navigation displaying brand identity, app routes, and user footer logout control.
 */
function Sidebar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectUser);

    const handleLogout = () => {
        // Clear Redux state & localStorage
        dispatch(logout());
        // Redirect to authentication page
        navigate("/");
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <span className="brand-icon">🛡️</span>
                <span className="brand-name">ChurnRadar</span>
            </div>

            <nav className="sidebar-nav">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        isActive ? "sidebar-link active" : "sidebar-link"
                    }
                >
                    <span className="link-icon">📊</span>
                    <span className="link-text">Dashboard</span>
                </NavLink>

                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        isActive ? "sidebar-link active" : "sidebar-link"
                    }
                >
                    <span className="link-icon">👤</span>
                    <span className="link-text">Profile</span>
                </NavLink>

                <NavLink
                    to="/predict"
                    className={({ isActive }) =>
                        isActive ? "sidebar-link active" : "sidebar-link"
                    }
                >
                    <span className="link-icon">⚡</span>
                    <span className="link-text">Predict Churn</span>
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                {user && (
                    <div className="sidebar-user-card">
                        <div className="sidebar-user-avatar">
                            {user.username.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="sidebar-user-details">
                            <span className="user-name">{user.username}</span>
                            <span className="user-id">ID: #{user.user_id}</span>
                        </div>
                    </div>
                )}
                
                <button className="sidebar-logout-btn" onClick={handleLogout}>
                    <span className="logout-icon">🚪</span>
                    <span className="logout-text">Logout</span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
