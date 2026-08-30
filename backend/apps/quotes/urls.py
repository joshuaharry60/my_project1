from django.urls import path
from .views import CalculateQuoteView

urlpatterns = [
    path('calculate/', CalculateQuoteView.as_view(), name='calculate_quote'),
]
