from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model, authenticate
from .serializers import UserSerializer, RegisterSerializer, GoogleAuthSerializer, PasswordResetSerializer

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
        # Format DRF error dict into clear message string if needed
        errors = serializer.errors
        err_msg = 'Registration failed.'
        if 'email' in errors:
            err_msg = errors['email'][0]
        elif 'password' in errors:
            err_msg = errors['password'][0]
        elif errors:
            first_key = list(errors.keys())[0]
            err_msg = f"{first_key}: {errors[first_key][0]}"
        return Response({'error': err_msg, 'details': errors}, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        password = request.data.get('password', '')

        if not email or not password:
            return Response({'error': 'Please enter both your email address and password.'}, status=status.HTTP_400_BAD_REQUEST)

        # Try authenticating by email or username
        user = authenticate(request, username=email, password=password)
        if not user:
            try:
                user_obj = User.objects.get(email__iexact=email)
                if user_obj.check_password(password):
                    user = user_obj
            except User.DoesNotExist:
                user = None

        if user:
            if not user.is_active:
                return Response({'error': 'This account has been deactivated.'}, status=status.HTTP_403_FORBIDDEN)
            tokens = get_tokens_for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'tokens': tokens,
                'message': 'Logged in successfully!'
            })
        return Response({'error': 'Invalid email address or password. Please check your credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

class GoogleAuthView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = GoogleAuthSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email'].strip().lower()
            name = serializer.validated_data.get('name', '')
            picture = serializer.validated_data.get('picture', '')

            name_parts = name.split(' ') if name else ['', '']
            first_name = name_parts[0]
            last_name = ' '.join(name_parts[1:]) if len(name_parts) > 1 else ''

            base_user = email.split('@')[0]
            username = base_user
            counter = 1
            while User.objects.filter(username=username).exclude(email__iexact=email).exists():
                username = f"{base_user}{counter}"
                counter += 1

            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': username,
                    'first_name': first_name,
                    'last_name': last_name,
                    'is_google_account': True,
                    'profile_picture': picture
                }
            )
            if not created:
                user.is_google_account = True
                if picture and not user.profile_picture:
                    user.profile_picture = picture
                if first_name and not user.first_name:
                    user.first_name = first_name
                    user.last_name = last_name
                user.save()

            tokens = get_tokens_for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'tokens': tokens,
                'created': created,
                'message': 'Signed in with Google successfully!'
            })
        return Response({'error': 'Invalid Google Sign-In data provided.'}, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetRequestView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email'].strip().lower()
            # Check if user exists
            exists = User.objects.filter(email__iexact=email).exists()
            return Response({
                'message': f'If an account exists for {email}, password reset instructions have been sent.',
                'email_sent': True
            }, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid email address.'}, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'user': UserSerializer(user).data,
                'message': 'Profile updated successfully!'
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

