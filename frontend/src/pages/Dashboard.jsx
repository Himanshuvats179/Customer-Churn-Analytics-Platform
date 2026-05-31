import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectUser } from "../features/user/userSlice";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

/**
 * Dashboard Page
 * Central application view showing statistics, metrics, welcome banners, and links.
 */
function Dashboard() {
    const user = useSelector(selectUser);

    return (
        <div className="dashboard-layout">
            {/* Sidebar Navigation */}
            <Sidebar />

            <div className="dashboard-main">
                {/* Global Navbar */}
                <Navbar title="Analytical Dashboard" />

                <main className="dashboard-body">
                    {/* Welcome Banner */}
                    <section className="welcome-banner-card">
                        <div className="welcome-banner-details">
                            <h1>Welcome Back, {user?.username}!</h1>
                            <p>
                                Monitor telecom churn predictions, configure your staff profile,
                                and run real-time retention diagnostics.
                            </p>
                        </div>
                        <div className="welcome-banner-status">
                            <span className="badge">Active Session</span>
                            <span className="user-id-tag">User ID: {user?.user_id}</span>
                        </div>
                    </section>

                    {/* Stats Metric Panel */}
                    <section className="metrics-panel">
                        <div className="metric-box">
                            <div className="metric-box-header">
                                <span className="metric-box-icon">📈</span>
                                <span className="metric-badge positive">94.2%</span>
                            </div>
                            <h3>ROC AUC Accuracy</h3>
                            <p>Current model calibration metrics</p>
                        </div>

                        <div className="metric-box">
                            <div className="metric-box-header">
                                <span className="metric-box-icon">👥</span>
                                <span className="metric-badge neutral">100% OK</span>
                            </div>
                            <h3>Retrained Status</h3>
                            <p>Models are updated automatically</p>
                        </div>

                        <div className="metric-box">
                            <div className="metric-box-header">
                                <span className="metric-box-icon">⚡</span>
                                <span className="metric-badge active">FastAPI</span>
                            </div>
                            <h3>Server Connection</h3>
                            <p>Latency time &lt; 20ms response</p>
                        </div>
                    </section>

                    {/* Dashboard Sections Grid */}
                    <div className="dashboard-grid-container">
                        {/* Quick Access Card */}
                        <div className="dashboard-grid-card">
                            <div className="card-header">
                                <h3>Quick Utilities</h3>
                                <p>Jump straight to forecasting or details management</p>
                            </div>
                            <div className="card-body quick-links">
                                <Link to="/predict" className="quick-action-link">
                                    <div className="link-icon-circle bg-purple">⚡</div>
                                    <div className="link-content">
                                        <h4>Run Churn Prediction</h4>
                                        <p>Input customer characteristics to evaluate risk score.</p>
                                    </div>
                                    <span className="arrow">→</span>
                                </Link>

                                <Link to="/profile" className="quick-action-link">
                                    <div className="link-icon-circle bg-blue">👤</div>
                                    <div className="link-content">
                                        <h4>Edit User Profile</h4>
                                        <p>Manage contact info, city, and professional experience.</p>
                                    </div>
                                    <span className="arrow">→</span>
                                </Link>
                            </div>
                        </div>

                        {/* ML Model Top Insights Card */}
                        <div className="dashboard-grid-card">
                            <div className="card-header">
                                <h3>Top Churn Correlations</h3>
                                <p>Feature importance scores identified by the prediction model</p>
                            </div>
                            <div className="card-body insights-list">
                                <div className="insight-row">
                                    <span className="insight-label">Contract Type (Month-to-month)</span>
                                    <div className="insight-bar-bg">
                                        <div className="insight-bar-fill" style={{ width: "88%", backgroundColor: "#ef4444" }}></div>
                                    </div>
                                    <span className="insight-val">88%</span>
                                </div>
                                <div className="insight-row">
                                    <span className="insight-label">Tenure (Short term)</span>
                                    <div className="insight-bar-bg">
                                        <div className="insight-bar-fill" style={{ width: "74%", backgroundColor: "#f59e0b" }}></div>
                                    </div>
                                    <span className="insight-val">74%</span>
                                </div>
                                <div className="insight-row">
                                    <span className="insight-label">Internet (Fiber Optic)</span>
                                    <div className="insight-bar-bg">
                                        <div className="insight-bar-fill" style={{ width: "65%", backgroundColor: "#3b82f6" }}></div>
                                    </div>
                                    <span className="insight-val">65%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Dashboard;