from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database import get_db

from app.schemas.prediction import (
    PredictionRequest
)

from app.services.prediction_service import (
    run_prediction,
    get_predictions_by_user_id,
    delete_prediction_by_id
)

router = APIRouter(
    prefix="/prediction",
    tags=["Prediction"]
)


@router.post("/")
def predict(
    request: PredictionRequest,
    db: Session = Depends(get_db)
):

    return run_prediction(
        db,
        request
    )


@router.get("/{user_id}")
def prediction_history(
    user_id: int,
    db: Session = Depends(get_db)
):

    return get_predictions_by_user_id(
        db,
        user_id
    )


@router.delete("/{prediction_id}")
def delete_prediction(
    prediction_id: int,
    db: Session = Depends(get_db)
):

    result = delete_prediction_by_id(
        db,
        prediction_id
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Prediction not found"
        )

    return result