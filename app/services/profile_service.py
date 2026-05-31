
from sqlalchemy.orm import Session

from app.models.profile import Profile


def create_profile(
    db: Session,
    profile_data
):

    profile = Profile(
        user_id=profile_data.user_id,
        full_name=profile_data.full_name,
        email=profile_data.email,
        phone=profile_data.phone,
        city=profile_data.city,
        experience=profile_data.experience
    )

    db.add(profile)
    db.commit()
    db.refresh(profile)

    return profile


def get_profile_by_user_id(
    db: Session,
    user_id: int
):

    return (
        db.query(Profile)
        .filter(Profile.user_id == user_id)
        .first()
    )


def update_profile(
    db: Session,
    profile: Profile,
    profile_data
):

    profile.full_name = profile_data.full_name
    profile.email = profile_data.email
    profile.phone = profile_data.phone
    profile.city = profile_data.city
    profile.experience = profile_data.experience

    db.commit()
    db.refresh(profile)

    return profile