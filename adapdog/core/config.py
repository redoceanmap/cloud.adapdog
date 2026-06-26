import os

from dotenv import load_dotenv

load_dotenv()

# 예: postgresql+asyncpg://user:password@localhost:5432/adapdog
# 설정하지 않으면 DB 없이 부팅된다 (목 골격 단계).
DATABASE_URL = os.getenv("DATABASE_URL")

# JWT 인증. 회원(account) 로그인 토큰 발급/검증에 사용.
# 운영 시 반드시 환경변수로 안전한 값을 주입한다(기본값은 로컬 개발용).
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-insecure-change-me")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "1440"))  # 기본 24시간

# Gemini 동선 에이전트. 키가 없으면 규칙기반 폴백 에이전트로 자동 대체된다.
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.1-flash-lite")

# 반려동물 동반 가능 문화시설 위치 (data.go.kr 15111389, odcloud 자동변환 API).
# 활용신청 후 본인 Swagger 페이지에서 엔드포인트(uddi 포함)와 서비스키를 발급받아 채운다.
# 둘 중 하나라도 비어 있으면 목 데이터로 폴백한다.
PETPLACE_API_ENDPOINT = os.getenv("PETPLACE_API_ENDPOINT")        # 예: https://api.odcloud.kr/api/15111389/v1/uddi:xxxxxxxx
PETPLACE_API_SERVICE_KEY = os.getenv("PETPLACE_API_SERVICE_KEY")  # 공공데이터포털 일반 인증키(Decoding)
PETPLACE_API_MAX_ROWS = int(os.getenv("PETPLACE_API_MAX_ROWS", "3000"))

# 전국 시티투어 코스와 함께하는 맛집 정보 (data.go.kr 15124908 → 한국문화정보원 kcisa).
# 동선 속 식당/맛집 추천에 사용. 호출 시 areaNm은 '시도명'(예: 전라북도)으로 줘야 한다(시군구명은 빈 응답).
# 키가 비어 있으면 맛집 추천 없이 동작한다(생략 폴백).
RESTAURANT_API_ENDPOINT = os.getenv(
    "RESTAURANT_API_ENDPOINT", "https://api.kcisa.kr/openapi/API_CNV_063/request"
)
RESTAURANT_API_SERVICE_KEY = os.getenv("RESTAURANT_API_SERVICE_KEY")  # 문화공공데이터광장(culture.go.kr) 인증키(UUID)
RESTAURANT_API_MAX_ROWS = int(os.getenv("RESTAURANT_API_MAX_ROWS", "1000"))

# data.go.kr 일반 인증키 — 승인된 KTO API 4종 공통. 인제스트가 API 데이터를 DB에 적재할 때 사용.
DATA_GO_KR_SERVICE_KEY = os.getenv("DATA_GO_KR_SERVICE_KEY")

# TheDogAPI (thedogapi.com) 견종 표준정보. breed_catalog 시드 인제스트가 사용.
# 키가 없으면 시드 없이 큐레이션 목 데이터로만 자동완성한다.
DOG_API_KEY = os.getenv("DOG_API_KEY")
DOG_API_ENDPOINT = os.getenv("DOG_API_ENDPOINT", "https://api.thedogapi.com/v1/breeds")

# 기상청 단기예보 조회서비스(초단기실황, data.go.kr 1360000). 별도 활용신청 필요.
# 키가 없으면 목 날씨로 폴백한다. 미지정 시 data.go.kr 공통 인증키를 재사용한다.
KMA_WEATHER_ENDPOINT = os.getenv(
    "KMA_WEATHER_ENDPOINT",
    "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst",
)
KMA_SERVICE_KEY = os.getenv("KMA_SERVICE_KEY") or DATA_GO_KR_SERVICE_KEY

# 전국길관광정보 표준데이터 CSV (둘레길 추천용). 좌표 없는 선형 코스 데이터.
_CSV_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "csv")
TRAIL_CSV_PATH = os.getenv("TRAIL_CSV_PATH", os.path.join(_CSV_DIR, "전국길관광정보표준데이터.csv"))
# 전국 반려동물 동반 가능 문화시설(좌표·입장가능크기 포함) — 자차 경유지 코리도어 필터링에 사용.
PETPLACE_CSV_PATH = os.getenv("PETPLACE_CSV_PATH", os.path.join(_CSV_DIR, "한국문화정보원_전국 반려동물 동반 가능 문화시설 위치 데이터_20250324.csv"))
# 행정안전부 전국 동물병원 표준데이터(영업상태·전화·TM좌표 EPSG:2097) — 응급 병원 안내에 사용.
ANIMAL_HOSPITAL_CSV_PATH = os.getenv("ANIMAL_HOSPITAL_CSV_PATH", os.path.join(_CSV_DIR, "동물_동물병원.csv"))
# 전주시 음식점 기본정보(좌표·전화·업태) — 여정 점심·저녁 식사 정류장 삽입에 사용.
RESTAURANT_BASIC_CSV_PATH = os.getenv("RESTAURANT_BASIC_CSV_PATH", os.path.join(_CSV_DIR, "전북특별자치도 전주시_음식점기본정보_20250604.csv"))
# 전주시 음식점 이미지정보(식당명→이미지 URL) — 식사 카드 썸네일에 사용(cp949).
RESTAURANT_IMAGE_CSV_PATH = os.getenv("RESTAURANT_IMAGE_CSV_PATH", os.path.join(_CSV_DIR, "전북특별자치도 전주시_음식점이미지정보_20220401.csv"))
# 전주시 모범음식점(좌표·업태) — 식당명 매칭으로 restaurant.recommended 품질 플래그 적재(cp949).
RESTAURANT_MODEL_CSV_PATH = os.getenv("RESTAURANT_MODEL_CSV_PATH", os.path.join(_CSV_DIR, "전북특별자치도 전주시_모범음식점_20260205.csv"))
# 전국 도시공원 표준데이터(좌표·공원구분) — 플래너 야외(산책) 슬롯 후보에 사용(cp949).
CITY_PARK_CSV_PATH = os.getenv("CITY_PARK_CSV_PATH", os.path.join(_CSV_DIR, "전국도시공원정보표준데이터.csv"))
