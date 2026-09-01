from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.authentication.urls')),
    path('api/tracking/', include('apps.tracking.urls')),
    path('api/shipments/', include('apps.tracking.urls')),
    path('api/quotes/', include('apps.quotes.urls')),
]

