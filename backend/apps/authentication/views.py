from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model, authenticate
from .serializers import UserSerializer, RegisterSerializer, GoogleAuthSerializer

User = get_user_model()

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            tokens = get_tokens_for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'tokens': tokens,
                'message': 'Account created successfully!'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({'error': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Try authenticating
        user = authenticate(request, username=email, password=password)
        if not user:
            try:
                user_obj = User.objects.get(email=email)
                if user_obj.check_password(password):
                    user = user_obj
            except User.DoesNotExist:
                user = None

        if user:
            tokens = get_tokens_for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'tokens': tokens,
                'message': 'Logged in successfully!'
            })
        return Response({'error': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

class GoogleAuthView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = GoogleAuthSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            name = serializer.validated_data.get('name', '')
            picture = serializer.validated_data.get('picture', '')

            name_parts = name.split(' ') if name else ['', '']
            first_name = name_parts[0]
            last_name = ' '.join(name_parts[1:]) if len(name_parts) > 1 else ''

            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': email.split('@')[0],
                    'first_name': first_name,
                    'last_name': last_name,
                    'is_google_account': True,
                    'profile_picture': picture
                }
            )
            if not created and not user.is_google_account:
                user.is_google_account = True
                if picture:
                    user.profile_picture = picture
                user.save()

            tokens = get_tokens_for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'tokens': tokens,
                'created': created,
                'message': 'Google authentication successful!'
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)
