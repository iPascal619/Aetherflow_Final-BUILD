"""
Shared database configuration and utilities for AetherFlow v2.0
"""

import os
from functools import lru_cache
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from pydantic_settings import BaseSettings


class DatabaseSettings(BaseSettings):
    """Database configuration settings"""
    
    database_url: str = os.getenv(
        "DATABASE_URL", 
        "postgresql+asyncpg://aetherflow_user:aetherflow_password@localhost:5432/aetherflow_db"
    )
    database_echo: bool = os.getenv("DATABASE_ECHO", "false").lower() == "true"
    pool_size: int = int(os.getenv("DATABASE_POOL_SIZE", "10"))
    max_overflow: int = int(os.getenv("DATABASE_MAX_OVERFLOW", "20"))
    
    class Config:
        env_file = ".env"


class Base(DeclarativeBase):
    """Base class for all database models"""
    pass


class DatabaseManager:
    """Manages database connections and sessions"""
    
    def __init__(self, settings: DatabaseSettings):
        self.settings = settings
        self.engine = create_async_engine(
            settings.database_url,
            echo=settings.database_echo,
            pool_size=settings.pool_size,
            max_overflow=settings.max_overflow,
            pool_pre_ping=True,
            pool_recycle=3600,  # Recycle connections every hour
        )
        self.async_session = async_sessionmaker(
            self.engine,
            class_=AsyncSession,
            expire_on_commit=False,
        )
    
    async def get_session(self) -> AsyncGenerator[AsyncSession, None]:
        """Get database session"""
        async with self.async_session() as session:
            try:
                yield session
            except Exception:
                await session.rollback()
                raise
            finally:
                await session.close()
    
    async def close(self):
        """Close database connections"""
        await self.engine.dispose()


@lru_cache()
def get_database_settings() -> DatabaseSettings:
    """Get cached database settings"""
    return DatabaseSettings()


# Global database manager instance
db_settings = get_database_settings()
database_manager = DatabaseManager(db_settings)


# Dependency for FastAPI
async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency to get database session"""
    async for session in database_manager.get_session():
        yield session