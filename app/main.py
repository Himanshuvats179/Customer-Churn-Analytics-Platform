from fastapi import FastAPI

from app.database import engine, Base
from fastapi.middleware.cors import CORSMiddleware
from app.models.user import User
from app.models.profile import Profile
from app.models.prediction import Prediction
from app.routers.auth import router as auth_router
from app.routers.profile import router as profile_router
from app.routers.prediction import (
    router as prediction_router
)


Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(prediction_router)
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "FastAPI Running"}