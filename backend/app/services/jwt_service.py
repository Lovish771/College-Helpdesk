import os
import hmac
import hashlib
import base64
import json
import time
import secrets
from typing import Optional, Dict, Any

class JWTService:
    @staticmethod
    def _b64e(data: bytes) -> str:
        return base64.urlsafe_b64encode(data).decode('utf-8').rstrip('=')

    @staticmethod
    def _b64d(data: str) -> bytes:
        pad = (4 - len(data) % 4) % 4
        return base64.urlsafe_b64decode(data + '=' * pad)

    @classmethod
    def get_secret(cls) -> str:
        return os.environ.get('SECRET_KEY', 'lpu-helpdesk-super-secure-production-jwt-key-2026')

    @classmethod
    def encode(cls, payload: Dict[str, Any], expires_in_seconds: int = 7 * 86400) -> str:
        secret = cls.get_secret()
        header = {"alg": "HS256", "typ": "JWT"}
        data = payload.copy()
        now = time.time()
        data['iat'] = int(now)
        data['exp'] = int(now + expires_in_seconds)

        b64_header = cls._b64e(json.dumps(header, separators=(',', ':')).encode('utf-8'))
        b64_payload = cls._b64e(json.dumps(data, separators=(',', ':')).encode('utf-8'))
        message = f"{b64_header}.{b64_payload}".encode('utf-8')
        sig = cls._b64e(hmac.new(secret.encode('utf-8'), message, hashlib.sha256).digest())
        return f"{b64_header}.{b64_payload}.{sig}"

    @classmethod
    def decode(cls, token: str) -> Optional[Dict[str, Any]]:
        if not token:
            return None
        secret = cls.get_secret()
        parts = token.split('.')
        if len(parts) != 3:
            return None

        b64_header, b64_payload, signature = parts
        message = f"{b64_header}.{b64_payload}".encode('utf-8')
        expected_sig = cls._b64e(hmac.new(secret.encode('utf-8'), message, hashlib.sha256).digest())

        if not secrets.compare_digest(signature, expected_sig):
            return None

        try:
            payload = json.loads(cls._b64d(b64_payload).decode('utf-8'))
            if 'exp' in payload and time.time() > payload['exp']:
                return None
            return payload
        except Exception:
            return None
