import httpx

from app.core.config import get_settings
from app.core.exceptions import AppError


class ExternalDirectoryClient:
    def fetch_users(self) -> list[dict]:
        settings = get_settings()
        timeout = httpx.Timeout(settings.external_api_timeout)
        url = f"{settings.external_api_url.rstrip('/')}/users"
        last_error: Exception | None = None

        for attempt in range(2):
            try:
                with httpx.Client(timeout=timeout) as client:
                    response = client.get(url)
                if response.status_code in {429, 500, 502, 503, 504} and attempt == 0:
                    last_error = AppError(
                        "External directory is temporarily unavailable",
                        status_code=502,
                        code="upstream_unavailable",
                    )
                    continue
                if response.status_code >= 400:
                    raise AppError(
                        "External directory request failed",
                        status_code=502,
                        code="upstream_error",
                    )
                payload = response.json()
                return [
                    {
                        "id": item.get("id"),
                        "name": item.get("name"),
                        "email": item.get("email"),
                        "company": (item.get("company") or {}).get("name"),
                        "website": item.get("website"),
                    }
                    for item in payload
                ]
            except httpx.TimeoutException as exc:
                last_error = AppError(
                    "External directory timed out",
                    status_code=502,
                    code="upstream_timeout",
                )
                if attempt == 0:
                    continue
                raise last_error from exc
            except httpx.HTTPError as exc:
                raise AppError(
                    "External directory is unreachable",
                    status_code=502,
                    code="upstream_unreachable",
                ) from exc

        if last_error:
            raise last_error
        raise AppError("External directory request failed", status_code=502, code="upstream_error")
