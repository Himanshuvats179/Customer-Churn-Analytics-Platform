import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/user/userSlice";
import { getProfile, createProfile, updateProfile } from "../services/api";

/**
 * ProfileForm Component
 * Displays input fields for editing a user's profile detail,
 * retrieving existing configurations and saving updates.
 */
function ProfileForm() {
    const user = useSelector(selectUser);
    const userId = user?.user_id;

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        city: "",
        experience: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hasProfile, setHasProfile] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Fetch existing profile on component mount
    useEffect(() => {
        const fetchProfile = async () => {
            if (!userId) return;
            setLoading(true);
            setErrorMessage("");
            try {
                const response = await getProfile(userId);
                if (response.data) {
                    setFormData({
                        full_name: response.data.full_name || "",
                        email: response.data.email || "",
                        phone: response.data.phone || "",
                        city: response.data.city || "",
                        experience: response.data.experience || "",
                    });
                    setHasProfile(true);
                }
            } catch (error) {
                // If it is 404, it means the profile doesn't exist yet (expected for new signups)
                if (error.response && error.response.status === 404) {
                    setHasProfile(false);
                } else {
                    setErrorMessage("Failed to fetch existing profile details. Please try again.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        // Client-side validations
        if (
            !formData.full_name.trim() ||
            !formData.email.trim() ||
            !formData.phone.trim() ||
            !formData.city.trim() ||
            !formData.experience.trim()
        ) {
            setErrorMessage("All profile fields are required.");
            return;
        }

        // Email syntax validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setErrorMessage("Please enter a valid email address.");
            return;
        }

        setSaving(true);
        // Map user_id (stored as number) into profile body
        const payload = {
            user_id: Number(userId),
            ...formData,
        };

        try {
            if (hasProfile) {
                // Put update API
                const response = await updateProfile(userId, payload);
                setSuccessMessage("Profile updated successfully!");
                setFormData(response.data);
            } else {
                // Post create API
                const response = await createProfile(payload);
                setSuccessMessage("Profile initialized successfully!");
                setFormData(response.data);
                setHasProfile(true);
            }
        } catch (error) {
            console.error("Profile save error:", error);
            const msg = error.response?.data?.detail || "Failed to commit profile updates.";
            setErrorMessage(msg);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="profile-loading-panel">
                <div className="loading-spinner"></div>
                <p>Retrieving administrator profile...</p>
            </div>
        );
    }

    return (
        <div className="profile-card">
            <div className="profile-card-header">
                <h3>Admin Settings Profile</h3>
                <p>Manage personal contact details and records.</p>
            </div>

            {successMessage && (
                <div className="auth-alert success">
                    <span className="alert-icon">✓</span>
                    <span className="alert-text">{successMessage}</span>
                </div>
            )}

            {errorMessage && (
                <div className="auth-alert error">
                    <span className="alert-icon">⚠️</span>
                    <span className="alert-text">{errorMessage}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="profile-form">
                <div className="profile-form-grid">
                    <div className="profile-field">
                        <label htmlFor="full_name">Full Name</label>
                        <input
                            id="full_name"
                            name="full_name"
                            type="text"
                            placeholder="Enter full name"
                            value={formData.full_name}
                            onChange={handleInputChange}
                            disabled={saving}
                            required
                        />
                    </div>

                    <div className="profile-field">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="name@organization.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={saving}
                            required
                        />
                    </div>

                    <div className="profile-field">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="e.g. +91 98765 43210"
                            value={formData.phone}
                            onChange={handleInputChange}
                            disabled={saving}
                            required
                        />
                    </div>

                    <div className="profile-field">
                        <label htmlFor="city">City Location</label>
                        <input
                            id="city"
                            name="city"
                            type="text"
                            placeholder="e.g. Mumbai, India"
                            value={formData.city}
                            onChange={handleInputChange}
                            disabled={saving}
                            required
                        />
                    </div>
                </div>

                <div className="profile-field textarea-field">
                    <label htmlFor="experience">Experience Summary</label>
                    <textarea
                        id="experience"
                        name="experience"
                        rows="4"
                        placeholder="Write a brief professional summary..."
                        value={formData.experience}
                        onChange={handleInputChange}
                        disabled={saving}
                        required
                    ></textarea>
                </div>

                <div className="profile-form-actions">
                    <button type="submit" className="profile-submit-btn" disabled={saving}>
                        {saving ? (
                            <>
                                <div className="loading-spinner button-spinner"></div>
                                Saving Changes...
                            </>
                        ) : hasProfile ? (
                            "Update Profile Info"
                        ) : (
                            "Initialize Profile"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ProfileForm;
