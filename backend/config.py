import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # Database
    DB_HOST: str = os.getenv("DB_HOST", "localhost")
    DB_PORT: int = int(os.getenv("DB_PORT", 3306))
    DB_USER: str = os.getenv("DB_USER", "root")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD", "")
    DB_NAME: str = os.getenv("DB_NAME", "ai_career_toolkit")

    DB_URL: str = os.getenv("DATABASE_URL", "")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "fallback-secret-key")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
    
    # App
    APP_NAME: str = os.getenv("APP_NAME", "AI Career Toolkit")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    
    @property
    def database_url(self) -> str:
        # Use DATABASE_URL if provided (Railway), otherwise use SQLite for development
        if os.getenv("DATABASE_URL"):
            return os.getenv("DATABASE_URL")
        # Use SQLite for local development
        return "sqlite:///./ai_career_toolkit.db"

settings = Settings()