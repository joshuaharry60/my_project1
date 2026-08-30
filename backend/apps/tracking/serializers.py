from rest_framework import serializers
from .models import Shipment, Waypoint

class WaypointSerializer(serializers.ModelSerializer):
    class Meta:
        model = Waypoint
        fields = ('id', 'location_name', 'lat', 'lng', 'passed', 'passed_at', 'order')

class ShipmentSerializer(serializers.ModelSerializer):
    waypoints = WaypointSerializer(many=True, read_only=True)

    class Meta:
        model = Shipment
        fields = (
            'id', 'tracking_code', 'sender_name', 'recipient_name',
            'origin_city', 'destination_city', 'service_type', 'weight_kg',
            'status', 'current_lat', 'current_lng', 'current_location_name',
            'speed_kmh', 'temperature_celsius', 'driver_name', 'driver_phone',
            'truck_number', 'estimated_delivery', 'waypoints', 'created_at', 'updated_at'
        )
