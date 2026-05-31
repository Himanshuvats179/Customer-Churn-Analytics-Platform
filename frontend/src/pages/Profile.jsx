import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ProfileForm from "../components/ProfileForm";

/**
 * Profile Page Component
 * Wraps sidebar navigation and profile forms inside standard dashboard viewport.
 */
function Profile() {
    return (
        <div className="dashboard-layout">
            {/* Sidebar Navigation */}
            <Sidebar />

            <div className="dashboard-main">
                {/* Header Navbar */}
                <Navbar title="Profile Management" />

                <main className="dashboard-body">
                    <ProfileForm />
                </main>
            </div>
        </div>
    );
}

export default Profile;
