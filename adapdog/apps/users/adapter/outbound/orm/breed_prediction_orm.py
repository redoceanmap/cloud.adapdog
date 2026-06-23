from __future__ import annotations

from sqlalchemy import Float, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from core.database.base import Base


class BreedPredictionOrm(Base):
    """견종 인식 후보 (ERD: breed_prediction). pet당 상위 후보. 데이터는 mock 시드."""

    __tablename__ = "breed_prediction"
    __table_args__ = (UniqueConstraint("pet_id", "rank", name="uq_breed_prediction_pet_rank"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    pet_id: Mapped[int] = mapped_column(ForeignKey("pet.id"), index=True)
    candidate_breed: Mapped[str] = mapped_column(String)
    similarity: Mapped[float] = mapped_column(Float)
    rank: Mapped[int] = mapped_column(Integer)
