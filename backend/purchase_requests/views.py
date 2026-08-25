from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import PurchaseRequest
from .serializers import PurchaseRequestSerializer


class PurchaseRequestListCreateView(generics.ListCreateAPIView):
    serializer_class = PurchaseRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        return PurchaseRequest.objects.filter(
            buyer=user
        ) | PurchaseRequest.objects.filter(
            product__seller=user
        )

    def perform_create(self, serializer):
        serializer.save(
            buyer=self.request.user
        )


class AcceptPurchaseRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):

        try:
            purchase_request = PurchaseRequest.objects.get(pk=pk)
        except PurchaseRequest.DoesNotExist:
            return Response(
                {'detail': 'Request not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        product = purchase_request.product

        if product.seller != request.user:
            return Response(
                {'detail': 'Only the seller can accept this request.'},
                status=status.HTTP_403_FORBIDDEN
            )

        if purchase_request.status != 'PENDING':
            return Response(
                {'detail': 'Only pending requests can be accepted.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if product.status != 'AVAILABLE':
            return Response(
                {'detail': 'Product is no longer available.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        purchase_request.status = 'ACCEPTED'
        purchase_request.save()

        product.status = 'RESERVED'
        product.save()

        return Response({
            'message': 'Purchase request accepted.',
            'request_status': purchase_request.status,
            'product_status': product.status,
        })


class RejectPurchaseRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):

        try:
            purchase_request = PurchaseRequest.objects.get(pk=pk)
        except PurchaseRequest.DoesNotExist:
            return Response(
                {'detail': 'Request not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        product = purchase_request.product

        if product.seller != request.user:
            return Response(
                {'detail': 'Only the seller can reject this request.'},
                status=status.HTTP_403_FORBIDDEN
            )

        if purchase_request.status != 'PENDING':
            return Response(
                {'detail': 'Only pending requests can be rejected.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        purchase_request.status = 'REJECTED'
        purchase_request.save()

        return Response({
            'message': 'Purchase request rejected.',
            'status': purchase_request.status
        })


class CancelPurchaseRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):

        try:
            purchase_request = PurchaseRequest.objects.get(pk=pk)
        except PurchaseRequest.DoesNotExist:
            return Response(
                {'detail': 'Request not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        if purchase_request.buyer != request.user:
            return Response(
                {'detail': 'Only the buyer can cancel this request.'},
                status=status.HTTP_403_FORBIDDEN
            )

        if purchase_request.status != 'PENDING':
            return Response(
                {'detail': 'Only pending requests can be cancelled.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        purchase_request.status = 'CANCELLED'
        purchase_request.save()

        return Response({
            'message': 'Purchase request cancelled.',
            'status': purchase_request.status
        })


class CompletePurchaseRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):

        try:
            purchase_request = PurchaseRequest.objects.get(pk=pk)
        except PurchaseRequest.DoesNotExist:
            return Response(
                {'detail': 'Request not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        product = purchase_request.product

        if product.seller != request.user:
            return Response(
                {'detail': 'Only the seller can complete the transaction.'},
                status=status.HTTP_403_FORBIDDEN
            )

        if purchase_request.status != 'ACCEPTED':
            return Response(
                {'detail': 'Only accepted requests can be completed.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        product.status = 'SOLD'
        product.save()

        return Response({
            'message': 'Transaction completed.',
            'product_status': product.status
        })
