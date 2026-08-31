from django.contrib import admin
from .models import QuoteRequest

@admin.register(QuoteRequest)
class QuoteRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'origin_city', 'destination_city', 'service_type', 'weight_kg', 'calculated_amount_naira', 'estimated_days', 'created_at')
    list_filter = ('service_type', 'origin_city', 'destination_city', 'includes_insurance')
    search_fields = ('origin_city', 'destination_city', 'user_email', 'user_phone')
