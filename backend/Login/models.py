from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# Create your models here.

class CustomUserManager(BaseUserManager):
    def create_user(self, ehrms_code, email, first_name, password=None, **extra_fields):
        if not ehrms_code:
            raise ValueError('EHRMS Code is required')
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(ehrms_code=ehrms_code, email=email, first_name = first_name, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, ehrms_code, email, first_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        return self.create_user(ehrms_code, email, first_name, password, **extra_fields)

GENDER_CHOICES = [('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')]
QUESTION_CHOICES = [
    ("pet_name", "What is the name of your first pet?"),
    ("school_name", "What is the name of your first school?"),
    ("birth_city", "In which city were you born?"),
    ("best_friend", "What is the name of your childhood best friend?"),
    ("favorite_food", "What is your favorite food?"),
    ("favorite_book", "What is your favorite book?"),
    ("nickname", "What was your childhood nickname?")
]

class User(AbstractBaseUser, PermissionsMixin):
    ehrms_code = models.CharField(max_length=20, unique=True)
    # username = models.CharField(max_length=100)

    first_name = models.CharField(max_length=30, default = 'First')
    middle_name = models.CharField(max_length=30, blank=True, null=True)
    last_name = models.CharField(max_length=30, default='Last')

    email = models.EmailField(unique=True)
    mobile_number = models.CharField(max_length=15)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    institute_name = models.CharField(max_length=255)
    branch = models.TextField(max_length=100, default="Polytechnic")
    designation = models.CharField(max_length=50)
    security_question = models.CharField(max_length=50, choices=QUESTION_CHOICES, default="pet_name")
    security_answer = models.CharField( max_length=50)


    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_coordinator = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    USERNAME_FIELD = 'ehrms_code'
    REQUIRED_FIELDS = ["password","email", "first_name"]

    objects = CustomUserManager()

    def __str__(self):
        return f"{self.first_name} ({self.ehrms_code})"

    