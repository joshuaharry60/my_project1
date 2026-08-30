from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'phone_number', 'company_name', 'is_google_account', 'profile_picture', 'created_at')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ('email', 'username', 'first_name', 'last_name', 'password', 'phone_number', 'company_name')

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data.get('username') or validated_data['email'].split('@')[0],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            password=validated_data['password'],
            phone_number=validated_data.get('phone_number', ''),
            company_name=validated_data.get('company_name', '')
        )
        return user

class GoogleAuthSerializer(serializers.Serializer):
    id_token = serializers.CharField(required=False)
    email = serializers.EmailField(required=True)
    name = serializers.CharField(required=False)
    picture = serializers.URLField(required=False)
