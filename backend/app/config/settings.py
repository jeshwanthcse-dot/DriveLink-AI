from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    APP_NAME: str = Field(default="DriveLink AI Backend")
    APP_VERSION: str = Field(default="1.0.0")
    DEBUG: bool = Field(default=False)
    
    DATABASE_URL: str = Field(default="postgresql+psycopg2://postgres:postgres@localhost:5432/drivelink")
    SUPABASE_URL: str = Field(default="https://placeholder.supabase.co")
    SUPABASE_KEY: str = Field(default="placeholder-supabase-key")
    GEMINI_API_KEY: str = Field(default="placeholder-gemini-key")
    OPENROUTE_API_KEY: str | None = Field(default=None)
    SECRET_KEY: str = Field(default="placeholder-secret-key-change-in-production")
    LOG_LEVEL: str = Field(default="INFO")
    
    # Twilio and Safety configuration fields for Sprint 14
    TWILIO_ACCOUNT_SID: str = Field(default="placeholder-twilio-sid")
    TWILIO_AUTH_TOKEN: str = Field(default="placeholder-twilio-token")
    TWILIO_PHONE_NUMBER: str = Field(default="placeholder-twilio-phone")
    PUBLIC_BACKEND_URL: str = Field(default="http://localhost:8000")
    SAFETY_STOP_THRESHOLD_MINUTES: int = Field(default=20)


# Instantiate settings for global imports
settings = Settings()

