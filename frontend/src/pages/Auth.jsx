import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../services/api";
import {
    loginStart,
    loginSuccess,
    loginFailure,
    selectUserLoading,
    selectUserError,
    clearUserError,
} from "../features/user/userSlice";

/**
 * Auth Component
 * Manages user login and registration states in a single page.
 */
function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [validationError, setValidationError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loading = useSelector(selectUserLoading);
    const apiError = useSelector(selectUserError);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationError("");
        setSuccessMessage("");
        dispatch(clearUserError());

        // Basic inputs validations
        if (!username.trim() || !password) {
            setValidationError("Username and password are required.");
            return;
        }

        if (password.length < 6) {
            setValidationError("Password must be at least 6 characters long.");
            return;
        }

        if (!isLogin && password !== confirmPassword) {
            setValidationError("Passwords do not match.");
            return;
        }

        // Trigger start of auth request in Redux
        dispatch(loginStart());

        try {
            if (isLogin) {
                // Call Login API
                const response = await loginUser({ username, password });
                
                // Store in Redux & localStorage
                dispatch(loginSuccess(response.data));
                
                // Navigate to dashboard
                navigate("/dashboard");
            } else {
                // Call Register API
                await registerUser({ username, password });
                
                // Display success message and shift to login
                setSuccessMessage("Registration successful! You may now sign in.");
                setIsLogin(true);
                setPassword("");
                setConfirmPassword("");
                dispatch(clearUserError());
            }
        } catch (error) {
            console.error("Auth error:", error);
            const msg = error.response?.data?.detail || "Authentication request failed. Check server status.";
            dispatch(loginFailure(msg));
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setValidationError("");
        setSuccessMessage("");
        dispatch(clearUserError());
    };

    return (
        <div className="auth-container">
            <div className="auth-visual">
                <div className="auth-visual-content">
                    <span className="visual-badge">Churn Analysis Suite</span>
                    <h1>Understand and Predict Customer Behavior</h1>
                    <p>
                        A powerful platform that analyzes user metrics, detects risk patterns,
                        and guides marketing and retention efforts with advanced machine learning.
                    </p>
                    <div className="graphic-stats">
                        <div className="stat-card">
                            <span className="stat-value">94.2%</span>
                            <span className="stat-label">Model Accuracy</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">&lt; 3s</span>
                            <span className="stat-label">Prediction Time</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="auth-form-side">
                <div className="auth-form-wrapper">
                    <div className="auth-form-header">
                        <h2>{isLogin ? "Sign In" : "Register Admin"}</h2>
                        <p>
                            {isLogin
                                ? "Enter your username and password below"
                                : "Create a new administrator account"}
                        </p>
                    </div>

                    {(validationError || apiError) && (
                        <div className="auth-alert error">
                            <span className="alert-icon">⚠️</span>
                            <span className="alert-text">{validationError || apiError}</span>
                        </div>
                    )}

                    {successMessage && (
                        <div className="auth-alert success">
                            <span className="alert-icon">✓</span>
                            <span className="alert-text">{successMessage}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form-fields">
                        <div className="form-field">
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>

                        {!isLogin && (
                            <div className="form-field">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={loading}
                                    required
                                />
                            </div>
                        )}

                        <button type="submit" className="auth-submit-button" disabled={loading}>
                            {loading ? (
                                <div className="loading-spinner"></div>
                            ) : isLogin ? (
                                "Access Dashboard"
                            ) : (
                                "Register Account"
                            )}
                        </button>
                    </form>

                    <div className="auth-form-footer">
                        <span>
                            {isLogin
                                ? "Need an administrator account?"
                                : "Already have an account?"}
                        </span>
                        <button type="button" className="auth-toggle-button" onClick={toggleMode}>
                            {isLogin ? "Register now" : "Sign in here"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Auth;