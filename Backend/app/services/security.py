# pyrefly: ignore [missing-import]
import hashlib
import hmac
import secrets
from datetime import datetime, timedelta, timezone

from app.core.config import settings

PBKDF2_ALGORITHM = "pbkdf2_sha256"
PBKDF2_ITERATIONS = 200_000
TOKEN_TTL_SECONDS = int(timedelta(hours=12).total_seconds())


def hash_password(password: str) -> str:
    """
    Hash a password using PBKDF2-HMAC-SHA256 (stdlib only — no extra pip packages).
    Stored format: pbkdf2_sha256$<iterations>$<salt_hex>$<hash_hex>
    """
    salt = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        bytes.fromhex(salt),
        PBKDF2_ITERATIONS,
    )
    return f"{PBKDF2_ALGORITHM}${PBKDF2_ITERATIONS}${salt}${digest.hex()}"


def verify_password(password: str, stored: str) -> bool:
    """Safely verify a plaintext password against a stored PBKDF2 hash."""
    try:
        algorithm, iterations, salt, expected = stored.split("$")
        if algorithm != PBKDF2_ALGORITHM:
            return False
        digest = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            bytes.fromhex(salt),
            int(iterations),
        )
        return hmac.compare_digest(digest.hex(), expected)
    except Exception:
        return False


def create_session_token(employee_id: str) -> str:
    """Create an HMAC-SHA256 signed session token: <employee_id>.<expiry>.<signature>."""
    now = int(datetime.now(timezone.utc).timestamp())
    payload = f"{employee_id}.{now + TOKEN_TTL_SECONDS}"
    signature = hmac.new(
        settings.SECRET_KEY.encode("utf-8"),
        payload.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()
    return f"{payload}.{signature}"


def verify_session_token(token: str) -> str | None:
    """Verify a session token and return the employee_id, or None if invalid/expired."""
    try:
        payload, signature = token.rsplit(".", 1)
        expected = hmac.new(
            settings.SECRET_KEY.encode("utf-8"),
            payload.encode("utf-8"),
            hashlib.sha256,
        ).hexdigest()
        if not hmac.compare_digest(signature, expected):
            return None

        employee_id, expiry = payload.split(".", 1)
        if int(expiry) < int(datetime.now(timezone.utc).timestamp()):
            return None
        return employee_id
    except Exception:
        return None
