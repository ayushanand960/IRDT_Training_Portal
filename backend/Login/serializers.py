#from django.contrib.auth.models import User
from .models import User
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password


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
            "ehrms_code", "first_name", "middle_name","last_name", "gender","email", "mobile_number","username", "password", "institute_name", "branch", "designation","security_question", "security_answer"
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
