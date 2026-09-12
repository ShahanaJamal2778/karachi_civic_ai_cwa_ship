from typing import Optional
from fastapi import Header

def get_current_user_id(authorization: Optional[str] = Header(None)) -> Optional[str]:
    """
    Extracts user_id from Bearer token if present.
    In development or unauthenticated requests, allows anonymous complaint submission.
    """
    if not authorization:
        return None
    try:
        parts = authorization.split()
        if len(parts) == 2 and parts[0].lower() == "bearer":
            # For Supabase JWT or session token, return token or mock user id
            token = parts[1]
            if token and len(token) > 10:
                return token[:36]
    except Exception:
        pass
    return None
