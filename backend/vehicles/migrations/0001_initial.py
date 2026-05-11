from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Vehicle",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("vehicle_number", models.CharField(max_length=30, unique=True)),
                ("owner_name", models.CharField(max_length=120)),
                ("phone_number", models.CharField(max_length=20)),
                ("vehicle_model", models.CharField(max_length=120)),
                ("service_status", models.CharField(choices=[("Pending", "Pending"), ("In Progress", "In Progress"), ("Completed", "Completed"), ("Delivered", "Delivered")], default="Pending", max_length=20)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={"ordering": ["vehicle_number"]},
        ),
    ]
