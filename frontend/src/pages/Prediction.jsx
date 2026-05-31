import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import PredictionForm from "../components/PredictionForm";

/**
 * Prediction Page Component
 * Wraps sidebar navigation and prediction forms inside standard dashboard viewport.
 */
function Prediction() {
    return (
        <div className="dashboard-layout">
            {/* Sidebar Navigation */}
            <Sidebar />

            <div className="dashboard-main">
                {/* Header Navbar */}
                <Navbar title="Churn Risk Forecaster" />

                <main className="dashboard-body">
                    <PredictionForm />
                </main>
            </div>
        </div>
    );
}

export default Prediction;
