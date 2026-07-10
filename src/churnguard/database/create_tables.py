"""
Create Database Tables
"""

from churnguard.database.db import engine
from churnguard.database.models import Base


def create_tables():

    Base.metadata.create_all(bind=engine)

    print("=" * 50)
    print("Database Tables Created")
    print("=" * 50)


if __name__ == "__main__":
    create_tables()