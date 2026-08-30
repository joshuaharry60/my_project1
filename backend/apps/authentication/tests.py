from django.test import TestCase
from django.contrib.auth import get_user_model

User = get_user_model()

class AuthTestCase(TestCase):
    def test_create_user(self):
        user = User.objects.create_user(
            email='test@bharrylogistics.com',
            username='testuser',
            password='Password123!'
        )
        self.assertEqual(user.email, 'test@bharrylogistics.com')
        self.assertTrue(user.check_password('Password123!'))
