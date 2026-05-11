from decimal import Decimal

from django.core.validators import MinValueValidator
from django.db import models


class Component(models.Model):
    component_name = models.CharField(max_length=120)
    component_type = models.CharField(max_length=80)
    purchase_price = models.DecimalField(
        max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal("0.00"))]
    )
    repair_price = models.DecimalField(
        max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal("0.00"))]
    )
    stock_quantity = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["component_name"]

    def __str__(self):
        return self.component_name
