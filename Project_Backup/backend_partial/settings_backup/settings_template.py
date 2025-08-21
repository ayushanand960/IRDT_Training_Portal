# Dummy Django settings (reference only – not runnable)
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent.parent  # points near backend_partial/

SECRET_KEY = "REPLACE_IN_DEPLOYMENT"
DEBUG = False
ALLOWED_HOSTS = []

INSTALLED_APPS = [
    'django.contrib.admin','django.contrib.auth','django.contrib.contenttypes',
    'django.contrib.sessions','django.contrib.messages','django.contrib.staticfiles',
    'rest_framework','corsheaders',
    # project apps (not included here): Login, Training, Enrollment, Certificate, api
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'REPLACE_IN_DEPLOYMENT'
TEMPLATES = []
WSGI_APPLICATION = 'REPLACE_IN_DEPLOYMENT'

DATABASES = { 'default': { 'ENGINE': 'django.db.backends.sqlite3', 'NAME': BASE_DIR / 'db.sqlite3', } }

STATIC_URL = '/static/'
TIME_ZONE = 'Asia/Kolkata'
LANGUAGE_CODE = 'en-us'
USE_I18N = True
USE_TZ = True
