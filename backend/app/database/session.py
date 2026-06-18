from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.config.settings import settings

db_url = settings.DATABASE_URL

# Automatically convert postgresql:// to postgresql+psycopg2:// if required by SQLAlchemy
if db_url.startswith("postgresql://") and not db_url.startswith("postgresql+psycopg2://"):
    db_url = db_url.replace("postgresql://", "postgresql+psycopg2://", 1)

# Configure the production engine with connection pooling parameters
engine = create_engine(
    db_url,
    pool_pre_ping=True,  # Disconnect protection/recovery
    pool_size=10,         # Standard connection limit
    max_overflow=20,      # Buffer connections on spike
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)
