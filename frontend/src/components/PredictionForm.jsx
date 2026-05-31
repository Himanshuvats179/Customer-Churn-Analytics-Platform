import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/user/userSlice";
import { predictChurn, getPredictionHistory, deletePrediction } from "../services/api";

/**
 * PredictionForm Component
 * Renders the 19 features required by the FastAPI ML model,
 * runs the prediction endpoint, and renders probability metrics.
 * Integrated with user prediction history listing, deletion, and one-hot encoding mappers.
 */
function PredictionForm() {
    const user = useSelector(selectUser);
    const userId = user?.user_id;

    // Human-friendly form states
    const defaultForm = {
        gender: "Female",
        SeniorCitizen: 0,
        Partner: "No",
        Dependents: "No",
        tenure: 1,
        PhoneService: "Yes",
        MultipleLines: "No",
        InternetService: "Fiber optic",
        OnlineSecurity: "No",
        OnlineBackup: "No",
        DeviceProtection: "No",
        TechSupport: "No",
        StreamingTV: "No",
        StreamingMovies: "No",
        Contract: "Month-to-month",
        PaperlessBilling: "Yes",
        PaymentMethod: "Electronic check",
        MonthlyCharges: 70.35,
        TotalCharges: 70.35,
    };

    const [formData, setFormData] = useState(defaultForm);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    // History States
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState("");

    // Maps friendly form select strings to the strict one-hot encoded binary variables expected by Pydantic
    const mapFormToPredictionRequest = (data, uid) => {
        return {
            user_id: Number(uid),
            
            // Integer binary variables
            gender: data.gender === "Male" ? 1 : 0, // Male=1, Female=0
            SeniorCitizen: Number(data.SeniorCitizen),
            Partner: data.Partner === "Yes" ? 1 : 0,
            Dependents: data.Dependents === "Yes" ? 1 : 0,
            tenure: Number(data.tenure),
            PhoneService: data.PhoneService === "Yes" ? 1 : 0,
            PaperlessBilling: data.PaperlessBilling === "Yes" ? 1 : 0,
            
            // Decimal charges
            MonthlyCharges: parseFloat(data.MonthlyCharges),
            TotalCharges: parseFloat(data.TotalCharges),
            
            // One-hot encoded MultipleLines (base case "No" represents both flags = 0)
            MultipleLines_No_phone_service: data.MultipleLines === "No phone service" ? 1 : 0,
            MultipleLines_Yes: data.MultipleLines === "Yes" ? 1 : 0,
            
            // One-hot encoded InternetService (base case "DSL" represents both flags = 0)
            InternetService_Fiber_optic: data.InternetService === "Fiber optic" ? 1 : 0,
            InternetService_No: data.InternetService === "No" ? 1 : 0,
            
            // One-hot encoded OnlineSecurity (base case "No" represents both flags = 0)
            OnlineSecurity_No_internet_service: data.OnlineSecurity === "No internet service" ? 1 : 0,
            OnlineSecurity_Yes: data.OnlineSecurity === "Yes" ? 1 : 0,
            
            // One-hot encoded OnlineBackup (base case "No" represents both flags = 0)
            OnlineBackup_No_internet_service: data.OnlineBackup === "No internet service" ? 1 : 0,
            OnlineBackup_Yes: data.OnlineBackup === "Yes" ? 1 : 0,
            
            // One-hot encoded DeviceProtection (base case "No" represents both flags = 0)
            DeviceProtection_No_internet_service: data.DeviceProtection === "No internet service" ? 1 : 0,
            DeviceProtection_Yes: data.DeviceProtection === "Yes" ? 1 : 0,
            
            // One-hot encoded TechSupport (base case "No" represents both flags = 0)
            TechSupport_No_internet_service: data.TechSupport === "No internet service" ? 1 : 0,
            TechSupport_Yes: data.TechSupport === "Yes" ? 1 : 0,
            
            // One-hot encoded StreamingTV (base case "No" represents both flags = 0)
            StreamingTV_No_internet_service: data.StreamingTV === "No internet service" ? 1 : 0,
            StreamingTV_Yes: data.StreamingTV === "Yes" ? 1 : 0,
            
            // One-hot encoded StreamingMovies (base case "No" represents both flags = 0)
            StreamingMovies_No_internet_service: data.StreamingMovies === "No internet service" ? 1 : 0,
            StreamingMovies_Yes: data.StreamingMovies === "Yes" ? 1 : 0,
            
            // One-hot encoded Contract (base case "Month-to-month" represents both flags = 0)
            Contract_One_year: data.Contract === "One year" ? 1 : 0,
            Contract_Two_year: data.Contract === "Two year" ? 1 : 0,
            
            // One-hot encoded PaymentMethod (base case "Bank transfer (automatic)" represents all three flags = 0)
            PaymentMethod_Credit_card_automatic: data.PaymentMethod === "Credit card (automatic)" ? 1 : 0,
            PaymentMethod_Electronic_check: data.PaymentMethod === "Electronic check" ? 1 : 0,
            PaymentMethod_Mailed_check: data.PaymentMethod === "Mailed check" ? 1 : 0
        };
    };

    // Reconstructs readable labels from DB rows which contain one-hot encoded flags
    const getReconstructedContract = (record) => {
        if (record.Contract) return record.Contract; // Fallback if string is saved
        if (record.Contract_Two_year === 1) return "Two year";
        if (record.Contract_One_year === 1) return "One year";
        return "Month-to-month";
    };

    const getReconstructedInternet = (record) => {
        if (record.InternetService) return record.InternetService; // Fallback if string is saved
        if (record.InternetService_No === 1) return "No Internet";
        if (record.InternetService_Fiber_optic === 1) return "Fiber optic";
        return "DSL";
    };

    // Fetch prediction history logs
    const fetchHistory = useCallback(async () => {
        if (!userId) return;
        setHistoryLoading(true);
        setHistoryError("");
        try {
            const response = await getPredictionHistory(userId);
            if (response.data) {
                setHistory(Array.isArray(response.data) ? response.data : []);
            }
        } catch (err) {
            console.error("Failed to load prediction history:", err);
            setHistoryError("Unable to load history logs. Verify database connection.");
        } finally {
            setHistoryLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Parse types based on names
        let parsedValue = value;
        if (name === "tenure" || name === "SeniorCitizen") {
            parsedValue = parseInt(value, 10) || 0;
        } else if (name === "MonthlyCharges" || name === "TotalCharges") {
            parsedValue = parseFloat(value) || 0;
        }

        setFormData((prev) => {
            const nextData = {
                ...prev,
                [name]: parsedValue,
            };

            // Estimate TotalCharges based on tenure and monthly charges for ease of use
            if (name === "MonthlyCharges" || name === "tenure") {
                const calculatedTotal = nextData.MonthlyCharges * nextData.tenure;
                nextData.TotalCharges = parseFloat(calculatedTotal.toFixed(2));
            }
            return nextData;
        });
    };

    const handleReset = () => {
        setFormData(defaultForm);
        setResult(null);
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setResult(null);

        // Convert the form values to the exact schema expected by FastAPI Pydantic Model
        const requestPayload = mapFormToPredictionRequest(formData, userId);

        try {
            // Call predict API (POST /prediction/)
            const response = await predictChurn(requestPayload);
            const data = response.data;

            // Handle output prediction status and probability response from FastAPI
            let predictedVal = "Not Churn";
            let probVal = 0;

            // Parse prediction output
            if (data.prediction !== undefined) {
                const p = data.prediction;
                if (p === 1 || p === "1" || p === "Yes" || p === "Churn" || p === true) {
                    predictedVal = "Churn";
                }
            }

            // Parse probability score
            if (data.probability !== undefined) {
                probVal = parseFloat(data.probability);
                if (probVal <= 1.0) {
                    probVal = probVal * 100;
                }
            } else if (predictedVal === "Churn") {
                probVal = 85;
            } else {
                probVal = 15;
            }

            setResult({
                prediction: predictedVal,
                probability: Math.round(probVal),
                raw: data,
            });

            // Refresh history table logs
            fetchHistory();
        } catch (err) {
            console.error("Prediction failed:", err);
            const msg = err.response?.data?.detail || "Could not connect to model server.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    // Deletion Handler
    const handleDeleteRecord = async (id) => {
        if (!window.confirm("Are you sure you want to delete this prediction entry?")) {
            return;
        }

        try {
            await deletePrediction(id);
            fetchHistory();
        } catch (err) {
            console.error("Failed to delete prediction entry:", err);
            alert("Failed to delete record: " + (err.response?.data?.detail || "Connection lost."));
        }
    };

    return (
        <div className="prediction-page-container">
            <div className="prediction-content-wrapper">
                {/* Form Input Side */}
                <form onSubmit={handleSubmit} className="predict-form">
                    <div className="predict-form-grid">
                        
                        {/* Section 1: Demographics & Account */}
                        <div className="predict-section">
                            <h3>Demographics & Tenure</h3>
                            
                            <div className="predict-field">
                                <label htmlFor="gender">Gender</label>
                                <select id="gender" name="gender" value={formData.gender} onChange={handleInputChange}>
                                    <option value="Female">Female</option>
                                    <option value="Male">Male</option>
                                </select>
                            </div>

                            <div className="predict-field">
                                <label htmlFor="SeniorCitizen">Senior Citizen</label>
                                <select id="SeniorCitizen" name="SeniorCitizen" value={formData.SeniorCitizen} onChange={handleInputChange}>
                                    <option value={0}>No (0)</option>
                                    <option value={1}>Yes (1)</option>
                                </select>
                            </div>

                            <div className="predict-field">
                                <label htmlFor="Partner">Has Partner</label>
                                <select id="Partner" name="Partner" value={formData.Partner} onChange={handleInputChange}>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>

                            <div className="predict-field">
                                <label htmlFor="Dependents">Has Dependents</label>
                                <select id="Dependents" name="Dependents" value={formData.Dependents} onChange={handleInputChange}>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>

                            <div className="predict-field">
                                <label htmlFor="tenure">Tenure (Months)</label>
                                <input
                                    id="tenure"
                                    name="tenure"
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={formData.tenure}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Section 2: Subscribed Services */}
                        <div className="predict-section">
                            <h3>Service Subscriptions</h3>

                            <div className="predict-field">
                                <label htmlFor="PhoneService">Phone Service</label>
                                <select id="PhoneService" name="PhoneService" value={formData.PhoneService} onChange={handleInputChange}>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>

                            <div className="predict-field">
                                <label htmlFor="MultipleLines">Multiple Lines</label>
                                <select id="MultipleLines" name="MultipleLines" value={formData.MultipleLines} onChange={handleInputChange}>
                                    <option value="No">No</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No phone service">No phone service</option>
                                </select>
                            </div>

                            <div className="predict-field">
                                <label htmlFor="InternetService">Internet Connection</label>
                                <select id="InternetService" name="InternetService" value={formData.InternetService} onChange={handleInputChange}>
                                    <option value="Fiber optic">Fiber optic</option>
                                    <option value="DSL">DSL</option>
                                    <option value="No">No Internet Service</option>
                                </select>
                            </div>

                            <div className="predict-field">
                                <label htmlFor="OnlineSecurity">Online Security</label>
                                <select id="OnlineSecurity" name="OnlineSecurity" value={formData.OnlineSecurity} onChange={handleInputChange}>
                                    <option value="No">No</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No internet service">No internet service</option>
                                </select>
                            </div>

                            <div className="predict-field">
                                <label htmlFor="OnlineBackup">Online Backup</label>
                                <select id="OnlineBackup" name="OnlineBackup" value={formData.OnlineBackup} onChange={handleInputChange}>
                                    <option value="No">No</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No internet service">No internet service</option>
                                </select>
                            </div>

                            <div className="predict-field">
                                <label htmlFor="DeviceProtection">Device Protection</label>
                                <select id="DeviceProtection" name="DeviceProtection" value={formData.DeviceProtection} onChange={handleInputChange}>
                                    <option value="No">No</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No internet service">No internet service</option>
                                </select>
                            </div>

                            <div className="predict-field">
                                <label htmlFor="TechSupport">Tech Support</label>
                                <select id="TechSupport" name="TechSupport" value={formData.TechSupport} onChange={handleInputChange}>
                                    <option value="No">No</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No internet service">No internet service</option>
                                </select>
                            </div>

                            <div className="predict-field">
                                <label htmlFor="StreamingTV">Streaming TV</label>
                                <select id="StreamingTV" name="StreamingTV" value={formData.StreamingTV} onChange={handleInputChange}>
                                    <option value="No">No</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No internet service">No internet service</option>
                                </select>
                            </div>

                            <div className="predict-field">
                                <label htmlFor="StreamingMovies">Streaming Movies</label>
                                <select id="StreamingMovies" name="StreamingMovies" value={formData.StreamingMovies} onChange={handleInputChange}>
                                    <option value="No">No</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No internet service">No internet service</option>
                                </select>
                            </div>
                        </div>

                        {/* Section 3: Contract & Charges */}
                        <div className="predict-section">
                            <h3>Contract & Billing</h3>

                            <div className="predict-field">
                                <label htmlFor="Contract">Contract Type</label>
                                <select id="Contract" name="Contract" value={formData.Contract} onChange={handleInputChange}>
                                    <option value="Month-to-month">Month-to-month</option>
                                    <option value="One year">One year</option>
                                    <option value="Two year">Two year</option>
                                </select>
                            </div>

                            <div className="predict-field">
                                <label htmlFor="PaperlessBilling">Paperless Invoice</label>
                                <select id="PaperlessBilling" name="PaperlessBilling" value={formData.PaperlessBilling} onChange={handleInputChange}>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>

                            <div className="predict-field">
                                <label htmlFor="PaymentMethod">Payment Gateway</label>
                                <select id="PaymentMethod" name="PaymentMethod" value={formData.PaymentMethod} onChange={handleInputChange}>
                                    <option value="Electronic check">Electronic check</option>
                                    <option value="Mailed check">Mailed check</option>
                                    <option value="Bank transfer (automatic)">Bank transfer (automatic)</option>
                                    <option value="Credit card (automatic)">Credit card (automatic)</option>
                                </select>
                            </div>

                            <div className="predict-field">
                                <label htmlFor="MonthlyCharges">Monthly Charges ($)</label>
                                <input
                                    id="MonthlyCharges"
                                    name="MonthlyCharges"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.MonthlyCharges}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="predict-field">
                                <label htmlFor="TotalCharges">Total Charges ($)</label>
                                <input
                                    id="TotalCharges"
                                    name="TotalCharges"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.TotalCharges}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="predict-form-actions">
                        <button type="button" className="predict-reset-btn" onClick={handleReset} disabled={loading}>
                            Reset Details
                        </button>
                        <button type="submit" className="predict-submit-btn" disabled={loading}>
                            {loading ? <div className="loading-spinner button-spinner"></div> : "Analyze Attrition Risk"}
                        </button>
                    </div>
                </form>

                {/* Single Diagnostic Response Sidebar */}
                <div className="predict-report-sidebar">
                    {error && (
                        <div className="auth-alert error">
                            <span className="alert-icon">⚠️</span>
                            <span className="alert-text">{error}</span>
                        </div>
                    )}

                    {result ? (
                        <div className={`report-card ${result.prediction === "Churn" ? "risk-high" : "risk-low"}`}>
                            <div className="report-header">
                                <h4>Attrition Assessment</h4>
                                <span className="report-pill">Complete</span>
                            </div>

                            <div className="report-radial-gauge">
                                <div className="radial-score">
                                    <span className="score-val">{result.probability}%</span>
                                    <span className="score-label">Churn Risk</span>
                                </div>
                            </div>

                            <div className="report-metrics-breakdown">
                                <div className="breakdown-item">
                                    <span className="item-label">Suggested Status:</span>
                                    <span className={`item-value badge ${result.prediction === "Churn" ? "badge-red" : "badge-green"}`}>
                                        {result.prediction === "Churn" ? "HIGH CHURN RISK" : "LOYAL PROFILE"}
                                    </span>
                                </div>
                                <div className="breakdown-explanation">
                                    {result.prediction === "Churn" ? (
                                        <p>
                                            This customer profile is statistically correlated with elevated termination behavior. 
                                            Common factors include month-to-month contract configurations, high monthly tariffs, and 
                                            short active lifespans. We recommend targeted engagement or discounting.
                                        </p>
                                    ) : (
                                        <p>
                                            This profile is indicative of stable customer tenure and solid retention parameters. 
                                            Multi-year contracting combined with low incident reports contribute to high baseline loyalty.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        !error && (
                            <div className="report-placeholder">
                                <div className="placeholder-icon">📊</div>
                                <h4>Awaiting Data Submission</h4>
                                <p>Configure parameters on the left and submit to trigger model classification and risk diagnostics.</p>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* History Table Container */}
            <div className="history-table-container">
                <div className="history-table-header">
                    <h3>Prediction History Logs</h3>
                    <button className="history-refresh-btn" onClick={fetchHistory} disabled={historyLoading}>
                        {historyLoading ? "Refreshing..." : "↻ Refresh History"}
                    </button>
                </div>

                {historyError && (
                    <div className="auth-alert warning">
                        <span className="alert-icon">⚠️</span>
                        <span className="alert-text">{historyError}</span>
                    </div>
                )}

                {historyLoading && history.length === 0 ? (
                    <div className="history-loading-msg">
                        <div className="loading-spinner button-spinner"></div>
                        <span>Retrieving historical data...</span>
                    </div>
                ) : history.length === 0 ? (
                    <div className="history-empty-msg">
                        <span>No historical predictions logged under this user. Run a prediction above!</span>
                    </div>
                ) : (
                    <div className="history-list-grid">
                        {history.map((record) => {
                            const isChurnRisk =
                                record.prediction === 1 ||
                                record.prediction === "1" ||
                                record.prediction === "Yes" ||
                                record.prediction === "Churn" ||
                                record.prediction === true;

                            const probabilityPct = Math.round(
                                record.probability > 1.0 ? record.probability : record.probability * 100
                            );

                            return (
                                <div key={record.id || record.prediction_id} className={`history-card ${isChurnRisk ? "risk-high" : "risk-low"}`}>
                                    <div className="history-card-header">
                                        <span className="record-id">Record #{record.id || record.prediction_id}</span>
                                        <button
                                            className="record-delete-btn"
                                            onClick={() => handleDeleteRecord(record.id || record.prediction_id)}
                                            title="Delete Record"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                    <div className="history-card-body">
                                        <div className="history-data-pills">
                                            <span className="data-pill">Tenure: {record.tenure} mo</span>
                                            <span className="data-pill">Contract: {getReconstructedContract(record)}</span>
                                            <span className="data-pill">Monthly: ${record.MonthlyCharges}</span>
                                            <span className="data-pill">Internet: {getReconstructedInternet(record)}</span>
                                        </div>
                                        <div className="history-card-outcome">
                                            <span className={`status-text ${isChurnRisk ? "text-red" : "text-green"}`}>
                                                {isChurnRisk ? "Churn Risk" : "Loyal Client"}
                                            </span>
                                            <span className="probability-text">{probabilityPct}% score</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PredictionForm;
