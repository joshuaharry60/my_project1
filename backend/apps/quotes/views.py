import math
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import QuoteRequest

# Coordinates of key Nigerian hubs for distance calculation
NIGERIAN_CITIES = {
    'lagos': {'name': 'Lagos (Apapa / Ikeja)', 'lat': 6.5244, 'lng': 3.3792},
    'abuja': {'name': 'Abuja (FCT / Idu)', 'lat': 9.0765, 'lng': 7.3986},
    'portharcourt': {'name': 'Port Harcourt (Trans-Amadi)', 'lat': 4.8156, 'lng': 7.0498},
    'kano': {'name': 'Kano (Sharada)', 'lat': 12.0022, 'lng': 8.5920},
    'ibadan': {'name': 'Ibadan (Oyo State)', 'lat': 7.3775, 'lng': 3.9470},
    'enugu': {'name': 'Enugu (Enugu State)', 'lat': 6.4584, 'lng': 7.5464},
    'benin': {'name': 'Benin City (Edo State)', 'lat': 6.3350, 'lng': 5.6037},
    'onitsha': {'name': 'Onitsha (Anambra State)', 'lat': 6.1499, 'lng': 6.7858},
    'calabar': {'name': 'Calabar (Cross River)', 'lat': 4.9757, 'lng': 8.3417},
    'kaduna': {'name': 'Kaduna (Kaduna State)', 'lat': 10.5105, 'lng': 7.4165},
    'jos': {'name': 'Jos (Plateau State)', 'lat': 9.8965, 'lng': 8.8583},
    'asaba': {'name': 'Asaba (Delta State)', 'lat': 6.1983, 'lng': 6.7275},
}

def calculate_haversine_km(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c * 1.25  # Multiply by road winding factor

class CalculateQuoteView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        origin_key = str(request.data.get('origin', 'lagos')).lower()
        dest_key = str(request.data.get('destination', 'abuja')).lower()
        service_type = request.data.get('service_type', 'INTERSTATE')
        weight = float(request.data.get('weight_kg', 10))
        cargo_value = float(request.data.get('cargo_value', 0))
        includes_insurance = bool(request.data.get('insurance', False))

        origin = NIGERIAN_CITIES.get(origin_key, NIGERIAN_CITIES['lagos'])
        dest = NIGERIAN_CITIES.get(dest_key, NIGERIAN_CITIES['abuja'])

        distance_km = calculate_haversine_km(origin['lat'], origin['lng'], dest['lat'], dest['lng'])
        if distance_km < 10:
            distance_km = 15.0  # minimum intra-city distance

        # Service multipliers & base pricing in Naira (₦)
        # Base handling fee
        base_fee = 15000.0
        
        # Per KM rate
        km_rate = 180.0
        
        # Weight rate per KG
        weight_rate = 120.0 if weight < 100 else (80.0 if weight < 1000 else 45.0)

        # Service type multiplier
        multipliers = {
            'INTERSTATE': 1.0,
            'EXPRESS': 1.45,
            'COLD_CHAIN': 1.65,
            'MARITIME': 1.30,
        }
        mult = multipliers.get(service_type, 1.0)

        raw_price = (base_fee + (distance_km * km_rate) + (weight * weight_rate)) * mult

        # Insurance fee (1.2% of declared cargo value)
        insurance_fee = (cargo_value * 0.012) if includes_insurance and cargo_value > 0 else 0.0
        total_price_naira = round(raw_price + insurance_fee, -2) # Round to nearest 100 Naira

        # Estimated delivery days calculation
        if distance_km < 50:
            est_days = 1
        elif distance_km < 400:
            est_days = 1 if service_type == 'EXPRESS' else 2
        elif distance_km < 800:
            est_days = 2 if service_type == 'EXPRESS' else 3
        else:
            est_days = 3 if service_type == 'EXPRESS' else 4

        # Save quote request
        quote_obj = QuoteRequest.objects.create(
            origin_city=origin['name'],
            destination_city=dest['name'],
            service_type=service_type,
            weight_kg=weight,
            cargo_value_naira=cargo_value,
            includes_insurance=includes_insurance,
            calculated_amount_naira=total_price_naira,
            estimated_days=est_days,
            user_email=request.data.get('email', ''),
            user_phone=request.data.get('phone', '')
        )

        return Response({
            'quote_id': quote_obj.id,
            'origin': origin['name'],
            'destination': dest['name'],
            'distance_km': round(distance_km, 1),
            'service_type': service_type,
            'weight_kg': weight,
            'base_cost': round(raw_price, 2),
            'insurance_cost': round(insurance_fee, 2),
            'total_amount_naira': total_price_naira,
            'currency': 'NGN (₦)',
            'formatted_amount': f"₦{total_price_naira:,.2f}",
            'estimated_days': est_days,
            'estimated_delivery_text': f"{est_days} Business Day{'s' if est_days > 1 else ''}"
        })
