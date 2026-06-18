from collections.abc import Generator

from sqlalchemy.orm import Session

from app.database.session import SessionLocal


def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency injection provider for synchronous SQLAlchemy sessions.
    Guarantees session cleanup/close even on request failure.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
