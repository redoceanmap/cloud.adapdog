from __future__ import annotations

from core.config import ANIMAL_HOSPITAL_CSV_PATH
from map.adapter.outbound.repositories.animal_hospital_repository import (
    CsvAnimalHospitalRepository,
)
from map.app.ports.input.animal_hospital_use_case import AnimalHospitalUseCase
from map.app.ports.output.animal_hospital_port import AnimalHospitalPort
from map.app.use_cases.animal_hospital_interactor import AnimalHospitalInteractor

# CSV는 1회 로드 후 캐시되므로 레포는 싱글톤으로 유지(재파싱 방지).
_repo: AnimalHospitalPort = CsvAnimalHospitalRepository(csv_path=ANIMAL_HOSPITAL_CSV_PATH)


def get_animal_hospital_use_case() -> AnimalHospitalUseCase:
    return AnimalHospitalInteractor(hospitals=_repo)
