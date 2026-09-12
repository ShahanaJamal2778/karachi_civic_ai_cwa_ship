import os
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    # App
    ENVIRONMENT: str = "development"
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    FRONTEND_URL: str = "http://localhost:5173"

    # Supabase
    SUPABASE_URL: str = "https://raqcvzaxufmymrfltgrw.supabase.co"
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""

    # AI Keys
    GROQ_API_KEY: str = ""
    GROQ_FALLBACK_API_KEY: Optional[str] = None
    GEMINI_API_KEY: str = ""
 
    # Gmail SMTP Configuration
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = "shahmanjamal9@gmail.com"
    SMTP_PASSWORD: str = ""
    EMAIL_FROM: str = "shahmanjamal9@gmail.com"
    EMAIL_FROM_NAME: str = "cwa_chip"
    SMTP_USE_TLS: bool = True
    AUTHORITY_TEST_EMAIL: Optional[str] = None

    # Geocoding
    GEOCODING_API_KEY: Optional[str] = None

settings = Settings()
