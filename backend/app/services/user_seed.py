from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.services.auth_service import hash_password

DEFAULT_USERS = [
    {
        "username": "admin",
        "email": "admin@nexus.city",
        "password": "Admin123!",
        "role": "admin",
        "full_name": "City Administrator",
    },
    {
        "username": "operator",
        "email": "ops@nexus.city",
        "password": "Ops12345!",
        "role": "operator",
        "full_name": "Operations Center Lead",
    },
    {
        "username": "analyst",
        "email": "ai@nexus.city",
        "password": "Analyst123!",
        "role": "analyst",
        "full_name": "AI Analytics Specialist",
    },
]


async def seed_default_users(db: AsyncSession) -> None:
    for entry in DEFAULT_USERS:
        result = await db.execute(select(User).where(User.username == entry["username"]))
        if result.scalar_one_or_none():
            continue
        db.add(
            User(
                username=entry["username"],
                email=entry["email"],
                hashed_password=hash_password(entry["password"]),
                role=entry["role"],
                full_name=entry["full_name"],
                is_active=True,
            )
        )
    await db.flush()
