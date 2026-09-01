from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()

class AuthTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='existing@bharrylogistics.com',
            username='existinguser',
            password='Password123!',
            first_name='Existing',
            last_name='User'
        )

    def test_create_user_model(self):
        self.assertEqual(self.user.email, 'existing@bharrylogistics.com')
        self.assertTrue(self.user.check_password('Password123!'))

    def test_register_api(self):
        payload = {
            'email': 'newuser@bharrylogistics.com',
            'password': 'StrongPassword123!',
            'first_name': 'New',
            'last_name': 'Client',
            'phone_number': '+234 803 111 2222',
            'company_name': 'Logistics Inc'
        }
        response = self.client.post('/api/auth/register/', payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('tokens', response.data)
        self.assertEqual(response.data['user']['email'], 'newuser@bharrylogistics.com')

    def test_login_api_success(self):
        payload = {
            'email': 'existing@bharrylogistics.com',
            'password': 'Password123!'
        }
        response = self.client.post('/api/auth/login/', payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('tokens', response.data)

    def test_login_api_failure(self):
        payload = {
            'email': 'existing@bharrylogistics.com',
            'password': 'WrongPassword'
        }
        response = self.client.post('/api/auth/login/', payload)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('error', response.data)

    def test_google_auth_api(self):
        payload = {
            'email': 'googleclient@gmail.com',
            'name': 'Chief Olusegun Adeleke',
            'picture': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
        }
        response = self.client.post('/api/auth/google/', payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('tokens', response.data)
        self.assertTrue(response.data['user']['is_google_account'])
        self.assertEqual(response.data['user']['first_name'], 'Chief')

    def test_password_reset_api(self):
        payload = {'email': 'existing@bharrylogistics.com'}
        response = self.client.post('/api/auth/reset-password/', payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['email_sent'])
