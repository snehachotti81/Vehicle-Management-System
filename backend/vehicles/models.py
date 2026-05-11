from django.db import models


class Vehicle(models.Model):
    class Status(models.TextChoices):
        PENDING = "Pending", "Pending"
        IN_PROGRESS = "In Progress", "In Progress"
        COMPLETED = "Completed", "Completed"
        DELIVERED = "Delivered", "Delivered"

    vehicle_number = models.CharField(max_length=30, unique=True)
    owner_name = models.CharField(max_length=120)
    phone_number = models.CharField(max_length=20)
    vehicle_model = models.CharField(max_length=120)
    service_status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["vehicle_number"]

    def __str__(self):
        return f"{self.vehicle_number} - {self.owner_name}"
