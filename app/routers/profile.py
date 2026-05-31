from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.schemas.profile import (
    ProfileCreate,
    ProfileUpdate
)

from app.services.profile_service import (
    create_profile,
    get_profile_by_user_id,
    update_profile
)

router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)


@router.post("/")
def create_user_profile(
    profile: ProfileCreate,
    db: Session = Depends(get_db)
):

    existing_profile = get_profile_by_user_id(
        db,
        profile.user_id
    )

    if existing_profile:
        raise HTTPException(
            status_code=400,
            detail="Profile already exists"
        )

    new_profile = create_profile(
        db,
        profile
    )

    return new_profile


@router.get("/{user_id}")
def get_profile(
    user_id: int,
    db: Session = Depends(get_db)
):

    profile = get_profile_by_user_id(
        db,
        user_id
    )

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profile not found"
        )

    return profile


@router.put("/{user_id}")
def update_user_profile(
    user_id: int,
    profile_data: ProfileUpdate,
    db: Session = Depends(get_db)
):

    profile = get_profile_by_user_id(
        db,
        user_id
    )

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profile not found"
        )

    updated_profile = update_profile(
        db,
        profile,
        profile_data
    )

    return updated_profile