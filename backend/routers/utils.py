from __future__ import annotations

import hashlib
import json
from datetime import datetime

from database import BlockchainLedger


def create_tx_hash(payload: dict) -> str:
    raw = json.dumps(payload, sort_keys=True, default=str) + datetime.utcnow().isoformat()
    return "0x" + hashlib.sha256(raw.encode()).hexdigest()


def log_blockchain_event(db, event_type: str, payload: dict) -> BlockchainLedger:
    record = BlockchainLedger(
        tx_hash=create_tx_hash({"event_type": event_type, **payload}),
        event_type=event_type,
        payload_json=payload,
        timestamp=datetime.utcnow(),
        verified=True,
    )
    db.add(record)
    db.flush()
    return record
