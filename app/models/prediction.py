from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey
from datetime import datetime

from app.database import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    prediction = Column(Integer, nullable=False)

    probability = Column(Float, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)