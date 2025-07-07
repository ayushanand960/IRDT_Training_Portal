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


    class Meta:
        model = User
        fields = [
            "ehrms_code", "first_name", "middle_name","last_name","email", "mobile_number","gender", "institute_name", "branch", "designation","password", "security_question", "security_answer"
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
            'refresh': str(self.get_token(self.user)),
            'access': str(self.get_token(self.user).access_token),
            'ehrms_code': self.user.ehrms_code,
            'is_superuser': self.user.is_superuser,
            'is_coordinator': self.user.is_coordinator,
            'first_name': self.user.first_name,
            'email': self.user.email,
        })
        return data

 # ...................................................
    
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
        fields = ['id', 'email', 'full_name', 'role', 'ehrms_code']

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

    def get_role(self, obj):
        if obj.is_superuser:
            return "admin"
        elif obj.is_coordinator:
            return "coordinator"
        else:
            return "staff"