from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel

from app.core.config import get_settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{get_settings().API_V1_PREFIX}/auth/login"
)


class TokenData(BaseModel):
    username: Optional[str] = None
    role: str = "operator"


class UserInDB(BaseModel):
    username: str
    email: str
    hashed_password: str
    role: str
    full_name: str


# Demo users for RBAC (pre-hashed to avoid bcrypt init at import)
DEMO_USERS: dict[str, UserInDB] = {
    "admin": UserInDB(
        username="admin",
        email="admin@nexus.city",
        hashed_password="$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.G2oXyKjKzqKzqK",
        role="admin",
        full_name="City Administrator",
    ),
    "operator": UserInDB(
        username="operator",
        email="ops@nexus.city",
        hashed_password="$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.G2oXyKjKzqKzqK",
        role="operator",
        full_name="Operations Center Lead",
    ),
    "analyst": UserInDB(
        username="analyst",
        email="ai@nexus.city",
        hashed_password="$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.G2oXyKjKzqKzqK",
        role="analyst",
        full_name="AI Analytics Specialist",
    ),
}

# Plain-text demo passwords mapped for reliable auth without bcrypt version issues
DEMO_PASSWORDS: dict[str, str] = {
    "admin": "admin123",
    "operator": "ops123",
    "analyst": "ai123",
}


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    settings = get_settings()
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


async def get_current_user(token: str = Depends(oauth2_scheme)) -> UserInDB:
    settings = get_settings()
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = DEMO_USERS.get(username)
    if user is None:
        raise credentials_exception
    return user


def require_role(*roles: str):
    async def checker(user: UserInDB = Depends(get_current_user)) -> UserInDB:
        if user.role != "admin" and user.role not in roles:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return user

    return checker
