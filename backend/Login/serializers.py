#from django.contrib.auth.models import User
from .models import User
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserSerializer(serializers.ModelSerializer):

    
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
    class Meta:
        model = User
        fields = [
            "ehrms_code", "first_name", "middle_name","last_name","email", "mobile_number","gender", "institute_name", "branch", "designation","password", "security_question", "security_answer","name", "profile_picture"
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
    ehrms_code = serializers.CharField()
    is_coordinator = serializers.BooleanField(required=True)

    def validate_ehrms_code(self, value):
        try:
            user = User.objects.get(ehrms_code=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found.")
        return value



class UserListSerializer(serializers.ModelSerializer):
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
            'security_answer'

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

    class Meta:
        model = User
        fields = [
            'first_name', 'middle_name', 'last_name', 'email',
            'mobile_number', 'gender', 'institute_name', 'branch',
            'designation', 'is_superuser', 'is_coordinator', 'role'
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
