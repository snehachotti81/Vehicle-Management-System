from django.contrib import admin

from .models import ServiceRecord


@admin.register(ServiceRecord)
class ServiceRecordAdmin(admin.ModelAdmin):
    list_display = ("vehicle", "selected_component", "service_type", "quantity", "labor_charge", "total_amount", "created_at")
    list_filter = ("service_type", "created_at")
    search_fields = ("vehicle__vehicle_number", "issue_description", "selected_component__component_name")
