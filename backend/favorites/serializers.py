from rest_framework import serializers

from .models import Favorite

class FavoriteSerializer(serializers.ModelSerializer):

    user = serializers.ReadOnlyField(
        source='user.username'
    )

    class Meta:
        model = Favorite

        fields = [
            'id',
            'user',
            'product',
            'created_at',
        ]

        read_only_fields = [
            'id',
            'user',
            'created_at',
        ]