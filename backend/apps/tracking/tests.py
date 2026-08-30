from django.test import TestCase
from django.utils import timezone
from datetime import timedelta
from .models import Shipment, Waypoint

class TrackingTestCase(TestCase):
    def test_shipment_creation(self):
        shipment = Shipment.objects.create(
            tracking_code='BHL-TEST-001',
            sender_name='Test Sender',
            recipient_name='Test Recipient',
            origin_city='Lagos',
            destination_city='Abuja',
            estimated_delivery=timezone.now() + timedelta(days=1)
        )
        self.assertEqual(shipment.tracking_code, 'BHL-TEST-001')
        self.assertEqual(shipment.status, 'IN_TRANSIT')
