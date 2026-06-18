import uuid
from collections.abc import Sequence
from app.models.rating import Rating
from app.schemas.rating import RatingCreate, RatingUpdate


class RatingRepository:
    """Interface repository containing method stubs for Rating database actions."""

    def create(self, schema: RatingCreate) -> Rating:
        """Creates a new rating record in the data store."""
        raise NotImplementedError()

    def update(self, id: uuid.UUID, schema: RatingUpdate) -> Rating | None:
        """Updates an existing rating record in the data store."""
        raise NotImplementedError()

    def delete(self, id: uuid.UUID) -> bool:
        """Removes a rating record from the data store."""
        raise NotImplementedError()

    def get_by_id(self, id: uuid.UUID) -> Rating | None:
        """Retrieves a rating record by its unique identifier."""
        raise NotImplementedError()

    def get_all(self, skip: int = 0, limit: int = 100) -> Sequence[Rating]:
        """Retrieves a list of rating records with pagination."""
        raise NotImplementedError()

    def search(self, query: str) -> Sequence[Rating]:
        """Searches rating reviews text content."""
        raise NotImplementedError()

    def filter(self, **kwargs) -> Sequence[Rating]:
        """Filters rating records dynamically (e.g. filter by driver_id)."""
        raise NotImplementedError()
