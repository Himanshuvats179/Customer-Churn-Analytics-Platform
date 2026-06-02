from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os


try:
    # DATABASE_URL = "postgresql+psycopg2://user:password@host:5432/churndb"
    DATABASE_URL = os.getenv("DATABASE_URL")

    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True
    )

    with engine.connect() as conn:
        print("Connected to PostgreSQL")

except Exception:
    print("PostgreSQL unavailable, using SQLite")

    DATABASE_URL = "sqlite:///churn.db"

    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()