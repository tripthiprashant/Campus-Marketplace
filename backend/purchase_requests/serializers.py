from rest_framework import serializers

from .models import PurchaseRequest


class PurchaseRequestSerializer(
    serializers.ModelSerializer
):

    buyer = serializers.ReadOnlyField(
        source='buyer.username'
    )

    class Meta:
        model = PurchaseRequest

        fields = [
            'id',
            'product',
            'buyer',
            'status',
            'created_at',
            'updated_at',
        ]

        read_only_fields = [
            'id',
            'buyer',
            'status',
            'created_at',
            'updated_at',
        ]