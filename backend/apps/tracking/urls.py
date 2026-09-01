from django.urls import path
from .views import TrackShipmentView, ListShipmentsView

urlpatterns = [
    path('list/', ListShipmentsView.as_view(), name='shipments_list'),
    path('track/<str:tracking_code>/', TrackShipmentView.as_view(), name='track_shipment_alt'),
    path('<str:tracking_code>/', TrackShipmentView.as_view(), name='track_shipment'),
]

