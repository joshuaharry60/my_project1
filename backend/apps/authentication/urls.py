from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, LoginView, GoogleAuthView, UserProfileView, PasswordResetRequestView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', LoginView.as_view(), name='auth_login'),
    path('google/', GoogleAuthView.as_view(), name='auth_google'),
    path('reset-password/', PasswordResetRequestView.as_view(), name='auth_reset_password'),
    path('profile/', UserProfileView.as_view(), name='auth_profile'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

