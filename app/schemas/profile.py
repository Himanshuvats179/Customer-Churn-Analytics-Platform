from pydantic import BaseModel


class ProfileCreate(BaseModel):
    user_id: int
    full_name: str
    email: str
    phone: str
    city: str
    experience: str


class ProfileUpdate(BaseModel):
    full_name: str
    email: str
    phone: str
    city: str
    experience: str