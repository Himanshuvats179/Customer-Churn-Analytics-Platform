import pandas as pd

from app.ml.model_loader import model, scaler


def predict_churn(data: dict):
    # Retrieve the exact list of feature names the scaler expects
    feature_names = list(scaler.feature_names_in_)

    # Normalization helper to strip underscores, spaces, parenthesis, and case
    def normalize(name: str):
        return name.replace(" ", "").replace("_", "").replace("(", "").replace(")", "").lower()

    # Map normalized versions of the expected names to their original expected names
    expected_map = {normalize(name): name for name in feature_names}

    # Map incoming data keys to matching expected feature names
    mapped_data = {}
    for key, val in data.items():
        norm_key = normalize(key)
        if norm_key in expected_map:
            mapped_data[expected_map[norm_key]] = val
        else:
            mapped_data[key] = val

    # Create the dataframe and reorder columns to match the scaler
    df = pd.DataFrame([mapped_data])
    df = df[feature_names]

    scaled_data = scaler.transform(df)

    prediction = model.predict(scaled_data)[0]

    probability = model.predict_proba(
        scaled_data
    )[0][1]

    return (
        int(prediction),
        float(probability)
    )