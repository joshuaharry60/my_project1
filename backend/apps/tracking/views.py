import random
from datetime import timedelta
from django.utils import timezone
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Shipment, Waypoint
from .serializers import ShipmentSerializer

def seed_sample_shipments():
    """Seed sample Nigerian logistics shipments if database is empty."""
    if Shipment.objects.exists():
        return

    now = timezone.now()

    # Shipment 1: Lagos to Abuja (In Transit via Lokoja)
    s1 = Shipment.objects.create(
        tracking_code='BHL-NG-88492',
        sender_name='Dangote Sugar Refineries, Apapa',
        recipient_name='Nafdac Central Stores, Abuja',
        origin_city='Lagos (Apapa Port)',
        destination_city='Abuja (Idu Industrial Park)',
        service_type='INTERSTATE',
        weight_kg=12500.0,
        status='IN_TRANSIT',
        current_lat=7.8023, # Lokoja area
        current_lng=6.7333,
        current_location_name='A2 Highway, Near Lokoja Bridge, Kogi State',
        speed_kmh=82,
        temperature_celsius=24.0,
        driver_name='Captain Babatunde Adebayo',
        driver_phone='+234 802 112 3456',
        truck_number='BHL-MACK-809-LAG',
        estimated_delivery=now + timedelta(hours=6)
    )
    waypoints_s1 = [
        ('Apapa Port Depot, Lagos', 6.4474, 3.3582, True),
        ('Berger Tollgate, Lagos-Ibadan Exp.', 6.6432, 3.3764, True),
        ('Ibadan Freight Interchange, Oyo', 7.3775, 3.9470, True),
        ('Ilorin Bypass Checkpoint, Kwara', 8.4799, 4.5418, True),
        ('Lokoja Transit Hub, Kogi', 7.8023, 6.7333, True),
        ('Abaji Expressway Depot, FCT', 8.4682, 6.9458, False),
        ('Idu Industrial Park Depot, Abuja', 9.0765, 7.3986, False),
    ]
    for order, (loc, lat, lng, passed) in enumerate(waypoints_s1):
        Waypoint.objects.create(
            shipment=s1,
            location_name=loc,
            lat=lat,
            lng=lng,
            passed=passed,
            passed_at=now - timedelta(hours=8 - order * 1.5) if passed else None,
            order=order
        )

    # Shipment 2: Port Harcourt to Kano (Cold Chain Freight)
    s2 = Shipment.objects.create(
        tracking_code='BHL-NG-90144',
        sender_name='PharmaCare Nig Ltd, Port Harcourt',
        recipient_name='Northern General Medical, Kano',
        origin_city='Port Harcourt (Trans-Amadi)',
        destination_city='Kano (Sharada Phase II)',
        service_type='COLD_CHAIN',
        weight_kg=4800.0,
        status='IN_TRANSIT',
        current_lat=6.4584, # Enugu area
        current_lng=7.5464,
        current_location_name='Enugu-Makurdi Highway, Enugu State',
        speed_kmh=75,
        temperature_celsius=3.8,
        driver_name='Captain Chidi Nnamdi',
        driver_phone='+234 803 998 7766',
        truck_number='BHL-VOLVO-402-PH',
        estimated_delivery=now + timedelta(hours=14)
    )
    waypoints_s2 = [
        ('Trans-Amadi Hub, Port Harcourt', 4.8156, 7.0498, True),
        ('Aba Expressway Checkpoint, Abia', 5.1065, 7.3667, True),
        ('Enugu Central Depot, Enugu', 6.4584, 7.5464, True),
        ('Makurdi Bridge Checkpoint, Benue', 7.7322, 8.5391, False),
        ('Jos Highway Logistics Hub, Plateau', 9.8965, 8.8583, False),
        ('Sharada Industrial Hub, Kano', 12.0022, 8.5920, False),
    ]
    for order, (loc, lat, lng, passed) in enumerate(waypoints_s2):
        Waypoint.objects.create(
            shipment=s2,
            location_name=loc,
            lat=lat,
            lng=lng,
            passed=passed,
            passed_at=now - timedelta(hours=5 - order * 2) if passed else None,
            order=order
        )

    # Shipment 3: Lagos Express Last-Mile
    s3 = Shipment.objects.create(
        tracking_code='BHL-NG-31088',
        sender_name='Jumia Fulfilment Hub, Ikeja',
        recipient_name='Eko Atlantic Towers, Victoria Island',
        origin_city='Lagos (Ikeja)',
        destination_city='Lagos (Victoria Island)',
        service_type='EXPRESS',
        weight_kg=18.5,
        status='OUT_FOR_DELIVERY',
        current_lat=6.4281,
        current_lng=3.4219,
        current_location_name='Ahmadu Bello Way, Victoria Island',
        speed_kmh=42,
        temperature_celsius=27.5,
        driver_name='Rider Tunde Bakare',
        driver_phone='+234 812 334 5566',
        truck_number='BHL-VAN-104-LAG',
        estimated_delivery=now + timedelta(minutes=45)
    )
    waypoints_s3 = [
        ('Ikeja Sort Center, Lagos', 6.6018, 3.3515, True),
        ('Third Mainland Bridge Interchange', 6.5000, 3.3900, True),
        ('Ikoyi Expressway Junction', 6.4500, 3.4300, True),
        ('Victoria Island Hub', 6.4281, 3.4219, True),
        ('Eko Atlantic Towers (Destination)', 6.4150, 3.4180, False),
    ]
    for order, (loc, lat, lng, passed) in enumerate(waypoints_s3):
        Waypoint.objects.create(
            shipment=s3,
            location_name=loc,
            lat=lat,
            lng=lng,
            passed=passed,
            passed_at=now - timedelta(minutes=90 - order * 20) if passed else None,
            order=order
        )

class TrackShipmentView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, tracking_code):
        seed_sample_shipments()
        code = tracking_code.strip().upper()
        try:
            shipment = Shipment.objects.get(tracking_code__iexact=code)
            # Add slight dynamic telemetry variance for live simulation feel
            shipment.speed_kmh = max(35, min(95, shipment.speed_kmh + random.randint(-3, 3)))
            shipment.save()
            return Response(ShipmentSerializer(shipment).data)
        except Shipment.DoesNotExist:
            return Response(
                {'error': f'Shipment with code {tracking_code} not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

class ListShipmentsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        seed_sample_shipments()
        shipments = Shipment.objects.all().order_by('-created_at')
        return Response(ShipmentSerializer(shipments, many=True).data)
