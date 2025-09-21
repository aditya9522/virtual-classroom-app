from datetime import datetime, timezone

def to_naive_utc(dt: datetime | None) -> datetime | None:
    """
    Converts an aware datetime to UTC and strips tzinfo so that it can be
    stored in a DB column defined as TIMESTAMP WITHOUT TIME ZONE.
    """
    if dt and dt.tzinfo:
        return dt.astimezone(timezone.utc).replace(tzinfo=None)
    return dt
