from django.contrib import admin
from .models import Shipment, Waypoint

class WaypointInline(admin.TabularInline):
    model = Waypoint
    extra = 1

@admin.register(Shipment)
class ShipmentAdmin(admin.ModelAdmin):
    list_display = ('tracking_code', 'origin_city', 'destination_city', 'service_type', 'status', 'speed_kmh', 'estimated_delivery')
    list_filter = ('status', 'service_type', 'origin_city', 'destination_city')
    search_fields = ('tracking_code', 'sender_name', 'recipient_name', 'driver_name', 'truck_number')
    inlines = [WaypointInline]

@admin.register(Waypoint)
class WaypointAdmin(admin.ModelAdmin):
    list_display = ('shipment', 'location_name', 'lat', 'lng', 'passed', 'order')
    list_filter = ('passed',)
    search_fields = ('location_name', 'shipment__tracking_code')
