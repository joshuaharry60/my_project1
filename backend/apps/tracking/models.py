from django.db import models
from django.conf import UserSettingsHolder

class Shipment(models.Model):
    STATUS_CHOICES = (
        ('BOOKED', 'Order Received'),
        ('DISPATCHED', 'Dispatched from Hub'),
        ('IN_TRANSIT', 'In Transit'),
        ('OUT_FOR_DELIVERY', 'Out for Delivery'),
        ('DELIVERED', 'Delivered'),
    )

    SERVICE_TYPES = (
        ('INTERSTATE', 'Interstate Heavy Haulage'),
        ('EXPRESS', 'Last-Mile Express Delivery'),
        ('COLD_CHAIN', 'Cold Storage & Temperature Controlled'),
        ('MARITIME', 'Apapa & Port Freight Clearance'),
    )

    tracking_code = models.CharField(max_length=50, unique=True)
    sender_name = models.CharField(max_length=100)
    recipient_name = models.CharField(max_length=100)
    origin_city = models.CharField(max_length=100, default='Lagos')
    destination_city = models.CharField(max_length=100, default='Abuja')
    service_type = models.CharField(max_length=50, choices=SERVICE_TYPES, default='INTERSTATE')
    weight_kg = models.DecimalField(max_digits=10, decimal_places=2, default=25.0)
    
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='IN_TRANSIT')
    
    # Real-Time Telemetry & Nigerian GPS Coordinates
    current_lat = models.FloatField(default=7.3775)   # Default around Ibadan / Highway
    current_lng = models.FloatField(default=3.9470)
    current_location_name = models.CharField(max_length=200, default="Lagos-Ibadan Expressway, Km 45")
    
    speed_kmh = models.IntegerField(default=78)
    temperature_celsius = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True, default=4.5)
    
    driver_name = models.CharField(max_length=100, default="Captain Emeka Okafor")
    driver_phone = models.CharField(max_length=20, default="+234 803 456 7890")
    truck_number = models.CharField(max_length=30, default="BHL-TRK-902-NG")
    
    estimated_delivery = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.tracking_code} - {self.origin_city} to {self.destination_city} ({self.status})"

class Waypoint(models.Model):
    shipment = models.ForeignKey(Shipment, related_name='waypoints', on_delete=models.CASCADE)
    location_name = models.CharField(max_length=200)
    lat = models.FloatField()
    lng = models.FloatField()
    passed = models.BooleanField(default=False)
    passed_at = models.DateTimeField(null=True, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.shipment.tracking_code} - {self.location_name} ({'Passed' if self.passed else 'Pending'})"
