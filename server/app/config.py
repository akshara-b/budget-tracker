from pydantic_settings import BaseSettings
from typing import Optional, Union
import os

class Settings(BaseSettings):
    # Database settings
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "budget_ai"
    
    # JWT settings
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # API settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Budget AI API"
    
    # CORS settings
    BACKEND_CORS_ORIGINS: Union[str, list] = ["http://localhost:3000", "http://localhost:5173"]
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Parse CORS origins from string if needed
        if isinstance(self.BACKEND_CORS_ORIGINS, str):
            self.BACKEND_CORS_ORIGINS = [origin.strip() for origin in self.BACKEND_CORS_ORIGINS.split(",")]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create settings instance
settings = Settings()

# Override with environment variables if present
if os.getenv("MONGODB_URL"):
    settings.MONGODB_URL = os.getenv("MONGODB_URL")

if os.getenv("SECRET_KEY"):
    settings.SECRET_KEY = os.getenv("SECRET_KEY")

if os.getenv("DATABASE_NAME"):
    settings.DATABASE_NAME = os.getenv("DATABASE_NAME")
