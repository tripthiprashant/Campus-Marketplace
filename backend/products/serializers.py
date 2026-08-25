from rest_framework import serializers

from .models import Product


class ProductSerializer(serializers.ModelSerializer):

    seller = serializers.ReadOnlyField(
        source='seller.username'
    )

    class Meta:
        model = Product

        fields = [
            'id',
            'seller',
            'category',
            'title',
            'description',
            'price',
            'condition',
            'image',
            'is_available',
            'created_at',
            'updated_at',
        ]

        read_only_fields = [
            'id',
            'seller',
            'created_at',
            'updated_at',
        ]