from django.db import models

class QuoteRequest(models.Model):
    origin_city = models.CharField(max_length=100)
    destination_city = models.CharField(max_length=100)
    service_type = models.CharField(max_length=50)
    weight_kg = models.DecimalField(max_digits=10, decimal_places=2)
    cargo_value_naira = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    includes_insurance = models.BooleanField(default=False)
    
    calculated_amount_naira = models.DecimalField(max_digits=12, decimal_places=2)
    estimated_days = models.IntegerField(default=2)
    
    user_email = models.EmailField(blank=True, null=True)
    user_phone = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Quote #{self.id}: {self.origin_city} -> {self.destination_city} (₦{self.calculated_amount_naira:,.2f})"
