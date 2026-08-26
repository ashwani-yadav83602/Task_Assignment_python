from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    database_url: str = "sqlite:///./tasks.db"
    jwt_secret: str = "dev-only-change-me"
    jwt_expire_minutes: int = 480
    cors_origins: str = "http://localhost:5173"
    external_api_url: str = "https://jsonplaceholder.typicode.com"
    external_api_timeout: float = 8.0

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
