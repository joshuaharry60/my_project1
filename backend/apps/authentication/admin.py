from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'username', 'first_name', 'last_name', 'phone_number', 'company_name', 'is_google_account', 'is_staff')
    list_filter = ('is_staff', 'is_superuser', 'is_google_account', 'is_active')
    fieldsets = BaseUserAdmin.fieldsets + (
        ('B.Harry Custom Info', {'fields': ('phone_number', 'company_name', 'is_google_account', 'profile_picture')}),
    )
