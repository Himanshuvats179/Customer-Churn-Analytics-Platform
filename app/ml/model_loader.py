import pickle

MODEL_PATH = "models_storage/churn_model.pkl"
SCALER_PATH = "models_storage/scaler.pkl"

with open(MODEL_PATH, "rb") as file:
    model = pickle.load(file)

with open(SCALER_PATH, "rb") as file:
    scaler = pickle.load(file)