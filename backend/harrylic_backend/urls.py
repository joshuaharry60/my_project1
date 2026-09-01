from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def home_view(request):
    return JsonResponse({
        'status': 'online',
        'service': 'B.Harry Logistics API',
        'version': '1.0.0',
        'frontend_url': 'https://harrylic-frontend.vercel.app',
        'endpoints': {
            'admin_portal': '/admin/',
            'auth': '/api/auth/',
            'tracking': '/api/tracking/',
            'quotes': '/api/quotes/'
        }
    })

urlpatterns = [
    path('', home_view, name='home'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.authentication.urls')),
    path('api/tracking/', include('apps.tracking.urls')),
    path('api/shipments/', include('apps.tracking.urls')),
    path('api/quotes/', include('apps.quotes.urls')),
]


