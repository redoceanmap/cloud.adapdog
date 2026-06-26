from __future__ import annotations

from users.domain.entities.breed_prediction_entity import BreedPrediction


class BreedPredictionMapper:
    """BreedPredictionOrm Row → BreedPrediction 엔티티 (DbBreedPredictionRepository용).

    현재는 mock repository를 쓰지만, DB 시드로 전환 시 이 매퍼로 row를
    도메인 엔티티로 옮긴다. 도메인은 ORM을 모른다(의존성 역전).
    """

    @staticmethod
    def to_entity(orm) -> BreedPrediction:
        return BreedPrediction(
            id=orm.id,
            pet_id=orm.pet_id,
            candidate_breed=orm.candidate_breed,
            similarity=orm.similarity,
            rank=orm.rank,
        )
