from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


def user_photo_path(instance, filename):
    ext = filename.split('.')[-1]  # keep original extension
    return f"user_photo_path/{instance.ehrms_code}.{ext}"





class UserManager(BaseUserManager):
    def create_user(self, ehrms_code, password=None, **extra_fields):
        if not ehrms_code:
            raise ValueError('EHRMS Code is required')
        user = self.model(ehrms_code=ehrms_code, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, ehrms_code, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(ehrms_code, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    ehrms_code = models.CharField(max_length=8, unique=True)
    first_name = models.CharField(max_length=30)
    middle_name = models.CharField(max_length=30, blank=True, null=True)
    last_name = models.CharField(max_length=30, blank=True, null=True)
    email = models.EmailField(unique=True)
    mobile_number = models.CharField(max_length=15)
    gender = models.CharField(max_length=10)
    institute_name = models.CharField(max_length=100)
    branch = models.CharField(max_length=100)
    designation = models.CharField(max_length=20)  # e.g., Trainee, Coordinator
    security_question = models.CharField(max_length=100)
    security_answer = models.CharField(max_length=100)
    photo = models.ImageField(upload_to=user_photo_path, null=True, blank=True)


    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_coordinator = models.BooleanField(default=False)


    objects = UserManager()

    USERNAME_FIELD = 'ehrms_code'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.ehrms_code

    @property
    def full_name(self):
        parts = [self.first_name, self.middle_name, self.last_name]
        return ' '.join([p for p in parts if p])


    
