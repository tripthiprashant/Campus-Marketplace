from django.conf import settings
from django.db import models


class Product(models.Model):

    CONDITION_CHOICES = [
        ('new', 'New'),
        ('like_new', 'Like New'),
        ('good', 'Good'),
        ('fair', 'Fair'),
    ]

    seller = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='products'
    )

    category = models.ForeignKey(
        'categories.Category',
        on_delete=models.SET_NULL,
        null=True,
        related_name='products'
    )

    title = models.CharField(max_length=200)

    description = models.TextField()

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    condition = models.CharField(
        max_length=20,
        choices=CONDITION_CHOICES,
        default='good'
    )

    image = models.ImageField(
        upload_to='products/',
        blank=True,
        null=True
    )
    
    is_available = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)
    STATUS_CHOICES = [
    ('AVAILABLE', 'Available'),
    ('RESERVED', 'Reserved'),
    ('SOLD', 'Sold'),
    ]

    status = models.CharField(
    max_length=20,
    choices=STATUS_CHOICES,
    default='AVAILABLE'
    )

    def __str__(self):
        return self.title
