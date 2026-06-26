from __future__ import annotations

import os
import sys

# apps/ 를 import 경로에 추가 → bounded context를 `users.xxx` / `map.xxx` 로 임포트
# (main.py와 동일 방식). DB 없이 InMemory/Mock 경로로 단위 테스트한다.
_ROOT = os.path.dirname(os.path.dirname(__file__))
sys.path.insert(0, _ROOT)
sys.path.insert(0, os.path.join(_ROOT, "apps"))
