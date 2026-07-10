from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import (
    Column,
    Integer,
    Float,
    DateTime
)

from datetime import datetime


class Base(
    DeclarativeBase
):
    pass


class PredictionLog(Base):

    __tablename__ = "prediction_logs"

    id = Column(
        Integer,
        primary_key=True
    )

    probability = Column(
        Float
    )

    prediction = Column(
        Integer
    )

    latency = Column(
        Float
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )