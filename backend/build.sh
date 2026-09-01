#!/usr/bin/env bash
# exit on error
set -o errexit

pip install --upgrade pip
pip install -r requirements.txt

python manage.py collectstatic --noinput
python manage.py migrate

# Create default admin superuser automatically on deployment if not present
python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='harry').exists() or User.objects.create_superuser('harry', 'joshuaharry60@gmail.com', 'Admin@2026!')" || true


