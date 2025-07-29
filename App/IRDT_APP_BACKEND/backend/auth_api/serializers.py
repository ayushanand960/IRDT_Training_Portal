from rest_framework import serializers
from .models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import re
from django.contrib.auth.password_validation import validate_password
from django.conf import settings




class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'ehrms_code', 'first_name', 'middle_name', 'last_name',
            'email', 'mobile_number', 'gender', 'institute_name',
            'branch', 'designation', 'security_question', 'security_answer',
            'password'
        ]

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class LoginSerializer(serializers.Serializer):
    ehrms_code = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data['ehrms_code'], password=data['password'])
        if user and user.is_active:
            return user 
        raise serializers.ValidationError("Invalid credentials")



class PasswordResetSerializer(serializers.Serializer):
    ehrms_code = serializers.CharField()
    new_password = serializers.CharField(write_only=True)

    def validate_new_password(self, value):
        validate_password(value)  
        return value
    
    def save(self):
        user = User.objects.get(ehrms_code=self.validated_data['ehrms_code'])
        user.set_password(self.validated_data['new_password'])
        user.save()


class UserProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    photo = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "ehrms_code",
            "full_name",
            "email",
            "mobile_number",
            "gender",
            "institute_name",
            "branch",
            "designation",
            "photo"
        ]

    def get_full_name(self, obj):
        parts = [obj.first_name, obj.middle_name, obj.last_name]
        return ' '.join([p for p in parts if p])
    def get_photo(self, obj):
        request = self.context.get('request')
        if obj.photo and hasattr(obj.photo, 'url'):
            return request.build_absolute_uri(obj.photo.url) if request else obj.photo.url
        # Return default image if photo doesn't exist
        # default_url = '/media/profile_photos/default_profile.jpg'
        default_url = settings.MEDIA_URL + 'profile_photos/default_profile.jpg'
        return request.build_absolute_uri(default_url) if request else default_url

    


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['ehrms_code'] = user.ehrms_code  # Optional extra claim
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Include user details in response
        data['user'] = {
            'ehrms_code': self.user.ehrms_code,
            'full_name': self.user.full_name,
            'email': self.user.email,
            'mobile_number': self.user.mobile_number,
            'gender': self.user.gender,
            'institute_name': self.user.institute_name,
            'branch': self.user.branch,
            'designation': self.user.designation,
        }
        return data

