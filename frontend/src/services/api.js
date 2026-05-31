import axios from "axios";

// Create Axios client pointed at the FastAPI backend base URL
const API = axios.create({
    baseURL: "http://127.0.0.1:8000",
    headers: {
        "Content-Type": "application/json",
    },
});

// Authentication endpoints
export const registerUser = (userData) => {
    return API.post("/auth/register", userData);
};

export const loginUser = (userData) => {
    return API.post("/auth/login", userData);
};

// Profile endpoints
export const createProfile = (profileData) => {
    return API.post("/profile/", profileData);
};

export const getProfile = (userId) => {
    return API.get(`/profile/${userId}`);
};

export const updateProfile = (userId, profileData) => {
    return API.put(`/profile/${userId}`, profileData);
};

// Churn Prediction endpoints
export const predictChurn = (predictionData) => {
    return API.post("/prediction/", predictionData);
};

export const getPredictionHistory = (userId) => {
    return API.get(`/prediction/${userId}`);
};

export const deletePrediction = (predictionId) => {
    return API.delete(`/prediction/${predictionId}`);
};

export default API;
