from sqlalchemy.orm import Session

from app.models.prediction import Prediction

from app.ml.predictor import predict_churn


def run_prediction(
    db: Session,
    request
):

    data = request.model_dump()

    user_id = data.pop("user_id")

    prediction, probability = predict_churn(
        data
    )

    prediction_record = Prediction(
        user_id=user_id,
        prediction=prediction,
        probability=probability
    )

    db.add(prediction_record)

    db.commit()

    db.refresh(prediction_record)

    return {
        "prediction_id": prediction_record.id,
        "prediction": prediction,
        "probability": probability
    }


def get_predictions_by_user_id(
    db: Session,
    user_id: int
):

    return (
        db.query(Prediction)
        .filter(Prediction.user_id == user_id)
        .all()
    )


def delete_prediction_by_id(
    db: Session,
    prediction_id: int
):

    prediction = (
        db.query(Prediction)
        .filter(Prediction.id == prediction_id)
        .first()
    )

    if not prediction:
        return None

    db.delete(prediction)

    db.commit()

    return {
        "message": "Prediction deleted"
    }