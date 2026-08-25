from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'password',
            'college',
            'phone',
            'profile_image',
        ]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            college=validated_data.get('college', ''),
            phone=validated_data.get('phone', ''),
            profile_image=validated_data.get('profile_image')
        )

        return user