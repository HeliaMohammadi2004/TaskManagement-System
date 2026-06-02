import os
from pathlib import Path

# مسیر اصلی پروژه
BASE_DIR = Path(__file__).resolve().parent.parent

# کلید امنیتی (برای محیط توسعه)
SECRET_KEY = 'django-insecure-your-secret-key-here'

# حالت دیباگ
DEBUG = True

ALLOWED_HOSTS = []

# --- اپلیکیشن‌های نصب شده ---
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # پکیج‌های جانبی که نصب کردیم
    'rest_framework',
    'corsheaders',
    'rest_framework_simplejwt',

    # اپلیکیشن اصلی پروژه ما
    'base',
]

# --- میدل‌ورها ---
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # حتماً باید اولین مورد باشد
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
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

WSGI_APPLICATION = 'core.wsgi.application'



DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'clickup_db',
        'USER': 'postgres',
        'PASSWORD': '123456', # همان که عوض کردیم
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}

# --- اعتبارسنجی پسورد ---
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# --- تنظیمات زبان و زمان ---
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# --- تنظیمات اختصاصی ما ---

# اجازه به تمام دامنه‌ها برای اتصال (CORS)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]


# تنظیم Rest Framework برای استفاده از JWT
REST_FRAMEWORK = {
"DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
}
