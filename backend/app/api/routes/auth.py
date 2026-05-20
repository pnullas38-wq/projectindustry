from datetime import timedelta
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from app.core.config import get_settings
from app.core.security import DEMO_USERS, DEMO_PASSWORDS, create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    full_name: str


class UserResponse(BaseModel):
    username: str
    email: str
    role: str
    full_name: str


@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest):
    user = DEMO_USERS.get(body.username)
    expected = DEMO_PASSWORDS.get(body.username)
    if not user or not expected or body.password != expected:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    settings = get_settings()
    token = create_access_token(
        {"sub": user.username, "role": user.role},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return TokenResponse(
        access_token=token,
        role=user.role,
        full_name=user.full_name,
    )


@router.get("/users/demo")
async def demo_users():
    return {
        "users": [
            {"username": "admin", "password": "admin123", "role": "admin"},
            {"username": "operator", "password": "ops123", "role": "operator"},
            {"username": "analyst", "password": "ai123", "role": "analyst"},
        ]
    }
