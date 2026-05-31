import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/user/userSlice";

/**
 * Navbar Component
 * Displays current page title, system status, and user avatar.
 */
function Navbar({ title }) {
    const user = useSelector(selectUser);

    return (
        <header className="navbar">
            <div className="navbar-title">
                <h2>{title || "Dashboard"}</h2>
            </div>
            
            <div className="navbar-actions">
                <div className="api-status">
                    <span className="status-dot"></span>
                    <span className="status-text">FastAPI Online</span>
                </div>
                
                {user && (
                    <div className="navbar-user">
                        <div className="navbar-avatar">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="navbar-user-info">
                            <span className="navbar-username">{user.username}</span>
                            <span className="navbar-role">Staff Portal</span>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Navbar;
