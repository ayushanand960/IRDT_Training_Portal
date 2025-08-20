from django.db import models
from PIL import Image
import os
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# Create your models here.

# Piyush  
# def user_photo_path(instance, filename):
#     ext = filename.split('.')[-1]  # keep original extension
#     return f"user_photo_path/{instance.ehrms_code}.{ext}"

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

GENDER_CHOICES = [('Male', 'Male'), ('Female', 'Female'), ('Transgender', 'Transgender')]
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
    ehrms_code = models.CharField(max_length=10, primary_key=True)
    # username = models.CharField(max_length=100)

    first_name = models.CharField(max_length=30, default = 'First')
    middle_name = models.CharField(max_length=30, blank=True, null=True)
    last_name = models.CharField(max_length=30, blank=True, null=True)

    email = models.EmailField(unique=True)
    mobile_number = models.CharField(max_length=10)
    gender = models.CharField(max_length=15, choices=GENDER_CHOICES)
    institute_name = models.CharField(max_length=255)
    branch = models.TextField(max_length=100, default="Polytechnic")
    designation = models.CharField(max_length=50)
    date_of_joining = models.DateField(null=True, blank=True)

    security_question = models.CharField(max_length=50, choices=QUESTION_CHOICES, default="pet_name")
    security_answer = models.CharField( max_length=50)
    profile_picture = models.ImageField(
        upload_to='profile_pictures/',
        null=True,
        blank=True,
        default='profile_pictures/default.jpg'
    )

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_coordinator = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    USERNAME_FIELD = 'ehrms_code'
    REQUIRED_FIELDS = ["password","email", "first_name"]

    objects = CustomUserManager()


    @property
    def full_name(self):
        return " ".join(filter(None, [self.first_name, self.middle_name, self.last_name])).strip()
    

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.profile_picture and os.path.exists(self.profile_picture.path):
            try:
                img = Image.open(self.profile_picture.path)
                img = img.convert('RGB')
                img.thumbnail((300, 300))
                img.save(self.profile_picture.path, 'JPEG', quality=70, optimize=True)
            except Exception:
                pass  # silently fail if not a valid image

    
    def __str__(self):
            # first
            # return f"{self.first_name} ({self.ehrms_code})"
    
            # second
            # full_name = " ".join(filter(None, [self.first_name, self.middle_name, self.last_name])).strip()
            # return f"{full_name} ({self.ehrms_code})"
        
            # third
        return " ".join(filter(None, [self.first_name, self.middle_name, self.last_name]))

    