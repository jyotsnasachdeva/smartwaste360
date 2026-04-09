from __future__ import annotations

import hashlib
import json
import random
from datetime import datetime, timedelta

from database import Alert, Bin, BlockchainLedger, Complaint, User

PATIALA_CENTER = (30.7046, 76.7179)

BIN_NAMES = [
    "Main Bazaar Bin",
    "Railway Station Bin",
    "Govt Medical College",
    "Mall Road Bin",
    "Phul Mandi Bin",
    "Sanauri Gate Bin",
    "Lehal Chowk Bin",
    "Urban Estate Bin",
    "Model Town Bin",
    "Thapar University Gate",
    "Tripuri Chowk Bin",
    "Bus Stand Bin",
    "Adalat Bazaar Bin",
    "Sirhind Road Bin",
    "Rajpura Colony Bin",
    "Anardana Chowk Bin",
    "YPS Market Bin",
    "Heritage Walk Bin",
    "Fountain Chowk Bin",
    "Old City Gate Bin",
]

INDIAN_NAMES = [
    "Rajveer Singh",
    "Simran Kaur",
    "Arjun Mehta",
    "Priya Sharma",
    "Harleen Gill",
    "Devansh Batra",
    "Ishita Arora",
    "Kabir Malhotra",
    "Meher Sandhu",
    "Aarav Verma",
    "Ritika Saini",
    "Yuvraj Grewal",
    "Navya Kapoor",
    "Karanpreet Singh",
    "Jasleen Kaur",
    "Sarthak Gupta",
    "Ananya Bansal",
    "Rohan Bedi",
    "Mannat Chawla",
    "Vihaan Joshi",
]


def _make_tx(seed: str) -> str:
    return "0x" + hashlib.sha256(seed.encode()).hexdigest()


def _random_payload(event_type: str) -> dict:
    waste_types = ["plastic_bottle", "paper", "food_waste", "metal_can", "glass_bottle"]
    return {
        "event": event_type,
        "waste_type": random.choice(waste_types),
        "points": random.choice([5, 10, 15]),
        "source": random.choice(["citizen_app", "municipal_panel", "camera_feed"]),
    }


def seed_database(db) -> None:
    if not db.query(Bin).count():
        for idx, name in enumerate(BIN_NAMES, start=1):
            lat_jitter = random.uniform(-0.018, 0.018)
            lng_jitter = random.uniform(-0.03, 0.03)
            bin_type = random.choice(["Blue", "Green", "Red", "Black"])
            db.add(
                Bin(
                    id=idx,
                    name=name,
                    lat=PATIALA_CENTER[0] + lat_jitter,
                    lng=PATIALA_CENTER[1] + lng_jitter,
                    fill_level=round(random.uniform(20, 95), 1),
                    bin_type=bin_type,
                    last_collected=datetime.utcnow() - timedelta(hours=random.randint(1, 8)),
                )
            )

    if not db.query(User).count():
        db.add(
            User(
                id=1,
                name="Rajveer Singh",
                email="rajveer@demo.com",
                green_points=340,
                items_classified=68,
                items_recycled=42,
            )
        )
        for idx, name in enumerate(INDIAN_NAMES[1:], start=2):
            db.add(
                User(
                    id=idx,
                    name=name,
                    email=f"{name.lower().replace(' ', '.')}@demo.com",
                    green_points=random.randint(120, 980),
                    items_classified=random.randint(20, 120),
                    items_recycled=random.randint(10, 90),
                    created_at=datetime.utcnow() - timedelta(days=random.randint(60, 420)),
                )
            )

    if not db.query(BlockchainLedger).count():
        event_types = [
            "BIN_FILLED",
            "BIN_COLLECTED",
            "ALERT_RAISED",
            "DISPOSAL_LOGGED",
            "COMPLAINT_LOGGED",
            "ROUTE_COMPLETED",
            "POINTS_AWARDED",
        ]
        for idx in range(50):
            event_type = random.choice(event_types)
            payload = _random_payload(event_type)
            db.add(
                BlockchainLedger(
                    tx_hash=_make_tx(f"ledger-{idx}-{event_type}-{random.random()}"),
                    event_type=event_type,
                    payload_json=payload,
                    timestamp=datetime.utcnow() - timedelta(minutes=idx * random.randint(3, 21)),
                    verified=True,
                )
            )

    if not db.query(Complaint).count():
        statuses = ["Pending", "In Review", "Resolved"]
        complaint_types = ["Overflow Bin", "Illegal Dumping", "Missed Collection", "Damaged Bin", "Foul Smell"]
        locations = ["Near Main Bazaar Gate 2", "Opp. Railway Station", "Model Town Park", "Sanauri Gate"]
        for idx in range(15):
            created = datetime.utcnow() - timedelta(days=random.randint(1, 20), hours=random.randint(1, 23))
            payload = {
                "title": f"{random.choice(complaint_types)} issue #{idx + 1}",
                "location": random.choice(locations),
            }
            tx_hash = _make_tx(json.dumps(payload) + created.isoformat())
            db.add(
                Complaint(
                    user_id=1,
                    title=payload["title"],
                    type=random.choice(complaint_types),
                    description="Waste accumulation observed and requires municipal attention for timely clearance.",
                    location=payload["location"],
                    status=random.choice(statuses),
                    tx_hash=tx_hash,
                    created_at=created,
                )
            )

    if not db.query(Alert).count():
        for idx in range(4):
            created = datetime.utcnow() - timedelta(hours=idx * 3 + 1)
            db.add(
                Alert(
                    camera_id=f"CAM-0{idx + 1}",
                    location=random.choice(BIN_NAMES[:8]),
                    detected_class=random.choice(["bulk_waste", "trash_bag_open", "hazardous_container"]),
                    confidence=round(random.uniform(0.74, 0.94), 2),
                    is_illegal=True,
                    status=random.choice(["Open", "Acknowledged", "Resolved"]),
                    tx_hash=_make_tx(f"alert-{idx}-{created.isoformat()}"),
                    created_at=created,
                )
            )
