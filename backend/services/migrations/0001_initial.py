from django.db import migrations, models
import django.core.validators
import django.db.models.deletion
import decimal


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("components", "0001_initial"),
        ("vehicles", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="ServiceRecord",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("issue_description", models.TextField()),
                ("service_type", models.CharField(choices=[("Repair", "Repair"), ("Replace", "Replace")], max_length=10)),
                ("labor_charge", models.DecimalField(decimal_places=2, max_digits=10, validators=[django.core.validators.MinValueValidator(decimal.Decimal("0.00"))])),
                ("quantity", models.PositiveIntegerField(default=1, validators=[django.core.validators.MinValueValidator(1)])),
                ("total_amount", models.DecimalField(decimal_places=2, editable=False, max_digits=10)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("selected_component", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="service_records", to="components.component")),
                ("vehicle", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="service_records", to="vehicles.vehicle")),
            ],
            options={"ordering": ["-created_at"]},
        ),
    ]
