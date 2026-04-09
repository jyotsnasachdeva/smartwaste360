from __future__ import annotations

import os
from contextlib import contextmanager
from datetime import datetime

from dotenv import load_dotenv
from sqlalchemy import JSON, Boolean, Column, DateTime, Float, Integer, String, Text, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./smartwaste360.db")

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Bin(Base):
    __tablename__ = "bins"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    fill_level = Column(Float, nullable=False, default=0)
    bin_type = Column(String(30), nullable=False)
    last_collected = Column(DateTime, nullable=False, default=datetime.utcnow)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)


class BlockchainLedger(Base):
    __tablename__ = "blockchain_ledger"

    id = Column(Integer, primary_key=True, index=True)
    tx_hash = Column(String(128), unique=True, index=True, nullable=False)
    event_type = Column(String(60), nullable=False, index=True)
    payload_json = Column(JSON, nullable=False, default=dict)
    timestamp = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)
    verified = Column(Boolean, nullable=False, default=True)


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    title = Column(String(160), nullable=False)
    type = Column(String(60), nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String(200), nullable=False)
    status = Column(String(30), nullable=False, default="Pending")
    tx_hash = Column(String(128), nullable=False, index=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(160), unique=True, nullable=False)
    green_points = Column(Integer, nullable=False, default=0)
    items_classified = Column(Integer, nullable=False, default=0)
    items_recycled = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    camera_id = Column(String(40), nullable=False)
    location = Column(String(120), nullable=False)
    detected_class = Column(String(80), nullable=False)
    confidence = Column(Float, nullable=False)
    is_illegal = Column(Boolean, nullable=False, default=False)
    status = Column(String(30), nullable=False, default="Open")
    tx_hash = Column(String(128), nullable=False, index=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)


def init_db() -> None:
    Base.metadata.create_all(bind=engine)


@contextmanager
def db_session():
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
