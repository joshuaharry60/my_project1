from django.urls import path
from .views import TrackShipmentView, ListShipmentsView

urlpatterns = [
    path('list/', ListShipmentsView.as_view(), name='shipments_list'),
    path('<str:tracking_code>/', TrackShipmentView.as_view(), name='track_shipment'),
]
