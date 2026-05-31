from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.schemas.user import (
    UserRegister,
    UserLogin
)

from app.services.auth_service import (
    create_user,
    get_user_by_username
)

from app.utils.password import (
    hash_password,
    verify_password
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register(
    user: UserRegister,
    db: Session = Depends(get_db)
):

    existing_user = get_user_by_username(
        db,
        user.username
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )

    hashed_password = hash_password(
        user.password
    )

    new_user = create_user(
        db,
        user.username,
        hashed_password
    )

    return {
        "id": new_user.id,
        "username": new_user.username
    }


@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    existing_user = get_user_by_username(
        db,
        user.username
    )

    if not existing_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    is_valid = verify_password(
        user.password,
        existing_user.hashed_password
    )

    if not is_valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    return {
        "user_id": existing_user.id,
        "username": existing_user.username
    }