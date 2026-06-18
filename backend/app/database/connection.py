import structlog
from sqlalchemy import text

from app.database.session import engine

logger = structlog.get_logger("app.database.connection")


def check_db_connection() -> bool:
    """
    Pings the database to verify connectivity.
    Returns True if connectivity is verified, False otherwise.
    """
    try:
        # Check connection using simple connection check query
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        logger.info("database_connectivity_verified")
        return True
    except Exception as exc:
        logger.error("database_connectivity_check_failed", error=str(exc))
        return False
