#from django.contrib.auth.models import User
import re
from .models import User
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
# from django.conf import settings

BLOCKED_EMAIL_TLDS = {"cc", "tk", "ml", "ga", "cf", "gq", "ru", "work", "xyz", "top", "men", "loan", "win"}
class UserSerializer(serializers.ModelSerializer):
    date_of_joining = serializers.DateField(format="%d-%m-%Y") 
    
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message="Email already exists")]
    )
    ehrms_code = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message="EHRMS Code already exists")]
    )
    mobile_number = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message="Mobile number already exists")]
    )
    password = serializers.CharField(
        write_only=True,
        validators=[validate_password], 
        style={'input_type': 'password'}
    )
    name = serializers.SerializerMethodField()
    profile_picture = serializers.SerializerMethodField()

    def get_profile_picture(self, obj):
        if obj.profile_picture and hasattr(obj.profile_picture, 'url'):
            return obj.profile_picture.url
        return None

    def get_name(self, obj):
        full = f"{obj.first_name} {obj.middle_name or ''} {obj.last_name}".strip()
        return " ".join(full.split())
    

     # ---------- Field Validations ----------
    def validate_first_name(self, value):
        if not re.match(r'^[A-Za-z\s]+$', value):
            raise serializers.ValidationError("First name must contain only letters and spaces.")
        return value

    def validate_middle_name(self, value):
        if value and not re.match(r'^[A-Za-z\s]+$', value):
            raise serializers.ValidationError("Middle name must contain only letters and spaces.")
        return value

    def validate_last_name(self, value):
        if value and not re.match(r'^[A-Za-z\s]+$', value):
            raise serializers.ValidationError("Last name must contain only letters and spaces.")
        return value

    def validate_mobile_number(self, value):
        if not re.match(r'^[6-9]\d{9}$', value):
            raise serializers.ValidationError("Enter a valid 10-digit mobile number starting with 6-9.")
        return value

    

    def validate_email(self, value):
        domain = value.split('.')[-1].lower()
        if domain in BLOCKED_EMAIL_TLDS:
            raise serializers.ValidationError(f"Emails ending with '.{domain}' are not allowed.")
        return value


    # Piyush
    # def get_photo(self, obj):
    #     request = self.context.get('request')
    #     if obj.photo and hasattr(obj.photo, 'url'):
    #         return request.build_absolute_uri(obj.photo.url) if request else obj.photo.url
    #     default_url = settings.MEDIA_URL + 'profile_photos/default_profile.jpg'
    #     return request.build_absolute_uri(default_url) if request else default_url
    
    class Meta:
        model = User
        fields = [
            "ehrms_code", "first_name", "middle_name","last_name","email", "mobile_number","gender", "institute_name", "branch", "designation","password", "security_question", "security_answer","name", "profile_picture", "date_of_joining"
            ]
        extra_kwargs = {
            "password": {"write_only": True},#this will write the password from client to database but will not ready the password for security
            "first_name": {'required': True},
            "last_name": {'required': True},
            # 'username': {'required': True}, 
            'email': {'required': True},
            'mobile_number': {'required': True},
            'gender': {'required': True},
            'institute_name': {'required': True},
            'branch': {'required': True},
            'designation': {'required': True},
            'security_question': {'required': True},
            'security_answer': {'required': True},
            } 
    

    def create(self, validated_data):

        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user



class UserProfilePictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['profile_picture']


class PasswordResetSerializer(serializers.Serializer):
    ehrms_code = serializers.CharField()
    new_password = serializers.CharField(write_only=True)

    def validate_new_password(self, value):
        validate_password(value)
        return value
    

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        # Add custom user data to the token response
        data.update({
            'ehrms_code': self.user.ehrms_code,
            'is_superuser': self.user.is_superuser,
            'is_coordinator': self.user.is_coordinator,
            'first_name': self.user.first_name,
            'email': self.user.email,
        })
        return data
    

# Pawan addition for admin manage User

class UserRoleUpdateSerializer(serializers.Serializer):
    date_of_joining = serializers.DateField(format="%d-%m-%Y") 
    ehrms_code = serializers.CharField()
    is_coordinator = serializers.BooleanField(required=True)

    def validate_ehrms_code(self, value):
        try:
            user = User.objects.get(ehrms_code=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found.")
        return value



class UserListSerializer(serializers.ModelSerializer):
    date_of_joining = serializers.DateField(format="%d-%m-%Y") 
    full_name = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'ehrms_code',
            'first_name',
            'middle_name',
            'last_name',
            'email',
            'mobile_number',
            'institute_name',
            'branch',
            'designation',
            'role',
            'full_name',
            'security_question',
            'security_answer',
            'date_of_joining'

        ]

    def get_full_name(self, obj):
        # Handles optional middle name cleanly
        return f"{obj.first_name} {obj.middle_name or ''} {obj.last_name}".strip()

    def get_role(self, obj):
        if obj.is_superuser:
            return "admin"
        elif obj.is_coordinator:
            return "coordinator"
        else:
            return "staff"



from rest_framework import serializers
from .models import User

class EditUserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(required=False)
    date_of_joining = serializers.DateField(format="%d-%m-%Y", input_formats=["%d-%m-%Y", "%Y-%m-%d"])
    full_name = serializers.SerializerMethodField() 
    def get_full_name(self, obj):
        # Handles optional middle name cleanly
        return f"{obj.first_name} {obj.middle_name or ''} {obj.last_name}".strip()

    class Meta:
        model = User
        fields = [
            'first_name', 'middle_name', 'last_name', 'email',
            'mobile_number', 'gender', 'institute_name', 'branch',
            'designation', 'is_superuser', 'is_coordinator', 'role',
            'date_of_joining', 'full_name'
        ]
        extra_kwargs = {
            'email': {'required': False},
            'mobile_number': {'required': False},
            'first_name': {'required': False},
            'last_name': {'required': False},
            'gender': {'required': False},
            'institute_name': {'required': False},
            'branch': {'required': False},
            'designation': {'required': False},
            'is_superuser': {'required': False},
            'is_coordinator': {'required': False},
        }

    def update(self, instance, validated_data):
        role = validated_data.pop("role", None)

        # Update regular fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Handle role flag updates
        if role:
            role = role.lower()
            if role == "admin":
                instance.is_superuser = True
                instance.is_coordinator = False
            elif role == "coordinator":
                instance.is_superuser = False
                instance.is_coordinator = True
            else:
                instance.is_superuser = False
                instance.is_coordinator = False

        instance.save()
        return instance
