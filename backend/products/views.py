from rest_framework import generics, filters
from rest_framework.permissions import AllowAny, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from .models import Product
from .serializers import ProductSerializer
from .permissions import IsOwnerOrReadOnly
from .filters import ProductFilter


class ProductListCreateView(generics.ListCreateAPIView):

    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = ProductFilter

    search_fields = [
        'title',
        'description',
    ]

    ordering_fields = [
        'price',
        'created_at',
        'title',
    ]

    ordering = ['-created_at']

    def get_permissions(self):

        if self.request.method == 'POST':
            return [IsAuthenticated()]

        return [AllowAny()]

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)


class ProductDetailView(
    generics.RetrieveUpdateDestroyAPIView
):

    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsOwnerOrReadOnly]