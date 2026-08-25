from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = [
        'username',
        'email',
        'college',
        'phone',
        'is_staff',
        'is_active',
    ]

    search_fields = [
        'username',
        'email',
        'college',
        'phone',
    ]

    fieldsets = UserAdmin.fieldsets + (
        (
            'Marketplace Profile',
            {
                'fields': (
                    'college',
                    'phone',
                    'profile_image',
                )
            },
        ),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        (
            'Marketplace Profile',
            {
                'fields': (
                    'email',
                    'college',
                    'phone',
                    'profile_image',
                )
            },
        ),
    )


