from django.conf import settings
from django.core.cache import cache
import time


class LoginCooldownService:
    def __init__(self, username: str):
        self.username = (username or "").strip().lower()

    @property
    def _can_track(self) -> bool:
        return bool(self.username)

    @property
    def max_failed_attempts(self) -> int:
        return int(getattr(settings, "LOGIN_MAX_FAILED_ATTEMPTS", 3))

    @property
    def _lock_seconds(self) -> int:
        return int(getattr(settings, "LOGIN_LOCK_SECONDS", 60))

    @property
    def _failure_window_seconds(self) -> int:
        return int(getattr(settings, "LOGIN_FAILURE_WINDOW_SECONDS", 300))

    @property
    def _fail_key(self) -> str:
        return f"auth:login:fail:{self.username}"

    @property
    def _lock_key(self) -> str:
        return f"auth:login:lock:{self.username}"

    def get_lock_seconds_remaining(self) -> int:
        if not self._can_track:
            return 0

        lock_expires_at = cache.get(self._lock_key)
        if not lock_expires_at:
            return 0

        return max(0, int(float(lock_expires_at) - time.time()))

    def is_locked(self) -> bool:
        if not self._can_track:
            return False

        return self.get_lock_seconds_remaining() > 0

    def register_failed_attempt(self) -> int:
        if not self._can_track:
            return 0

        current_attempts = cache.get(self._fail_key, 0) + 1
        cache.set(self._fail_key, current_attempts, timeout=self._failure_window_seconds)

        if current_attempts >= self.max_failed_attempts:
            lock_expires_at = time.time() + self._lock_seconds
            cache.set(self._lock_key, lock_expires_at, timeout=self._lock_seconds)

        return current_attempts

    def clear_attempts(self) -> None:
        if not self._can_track:
            return

        cache.delete(self._fail_key)
        cache.delete(self._lock_key)
