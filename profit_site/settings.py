from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-change-this-secret-key'

DEBUG = True

ALLOWED_HOSTS = ['zhanaidarovv.pythonanywhere.com',
                 'www.profit-bus.kz',
                 '127.0.0.1',
                 'localhost',
                 ]


INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'main',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'profit_site.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        # Можно использовать общую папку templates при необходимости
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,  # ищет шаблоны в app/templates
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'profit_site.wsgi.application'

# База данных не используется, оставим стандартную настройку (можно игнорировать)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_PASSWORD_VALIDATORS = []

LANGUAGE_CODE = 'ru-ru'
TIME_ZONE = 'Asia/Almaty'
USE_I18N = True
USE_TZ = True

# GitHub Pages: SITE_BASE_PATH=/PROFIT1 (project site at username.github.io/PROFIT1/)
_site_base = os.environ.get('SITE_BASE_PATH', '').strip().rstrip('/')
SITE_BASE_PATH = f'/{_site_base.lstrip("/")}' if _site_base else ''

# Настройки static
if SITE_BASE_PATH:
    STATIC_URL = f'{SITE_BASE_PATH}/static/'
else:
    STATIC_URL = 'static/'

# Дополнительные директории со статикой (по требованию)
_static_dir = BASE_DIR / 'static'
STATICFILES_DIRS = [_static_dir] if _static_dir.is_dir() else []
# Для collectstatic (на будущее)
STATIC_ROOT = BASE_DIR / 'staticfiles'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'