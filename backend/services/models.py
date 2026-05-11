from decimal import Decimal

from django.core.validators import MinValueValidator
from django.db import models

from components.models import Component
from vehicles.models import Vehicle


class ServiceRecord(models.Model):
    class ServiceType(models.TextChoices):
        REPAIR = "Repair", "Repair"
        REPLACE = "Replace", "Replace"

    vehicle = models.ForeignKey(Vehicle, related_name="service_records", on_delete=models.CASCADE)
    issue_description = models.TextField()
    selected_component = models.ForeignKey(Component, related_name="service_records", on_delete=models.PROTECT)
    service_type = models.CharField(max_length=10, choices=ServiceType.choices)
    labor_charge = models.DecimalField(
        max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal("0.00"))]
    )
    quantity = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def component_price(self):
        if self.service_type == self.ServiceType.REPAIR:
            return self.selected_component.repair_price
        return self.selected_component.purchase_price

    def calculate_total(self):
        return (self.component_price() * Decimal(self.quantity)) + self.labor_charge

    def save(self, *args, **kwargs):
        self.total_amount = self.calculate_total()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.vehicle.vehicle_number} - {self.service_type}"
