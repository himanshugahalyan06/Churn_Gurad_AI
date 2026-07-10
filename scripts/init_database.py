"""
Initialize Database
"""

from churnguard.database.create_tables import create_tables


def main():

    print("=" * 60)
    print("INITIALIZING DATABASE")
    print("=" * 60)

    create_tables()

    print("=" * 60)
    print("DATABASE READY")
    print("=" * 60)


if __name__ == "__main__":
    main()