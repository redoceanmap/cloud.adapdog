"""
SQLAlchemy Base 클래스.
각 도메인이 독립적으로 상속해 사용한다. 도메인 간 직접 의존은 없다.
"""
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass
