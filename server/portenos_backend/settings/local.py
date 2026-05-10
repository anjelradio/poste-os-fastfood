from .base import *
import dj_database_url
import os
from dotenv import load_dotenv

load_dotenv()

# Database
# https://docs.djangoproject.com/en/6.0/ref/settings/#databases

database_url = os.environ.get("DATABASE_URL")

if database_url and not database_url.startswith("sqlite"):
    DATABASES = {
        'default': dj_database_url.config(
            default=database_url,
            conn_max_age=600,
            ssl_require=True
        )
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }
