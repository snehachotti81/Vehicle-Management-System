from django.contrib import admin

from .models import Vehicle


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ("vehicle_number", "owner_name", "phone_number", "vehicle_model", "service_status")
    search_fields = ("vehicle_number", "owner_name", "phone_number")
    list_filter = ("service_status",)
