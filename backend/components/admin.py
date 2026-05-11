from django.contrib import admin

from .models import Component


@admin.register(Component)
class ComponentAdmin(admin.ModelAdmin):
    list_display = ("component_name", "component_type", "purchase_price", "repair_price", "stock_quantity")
    search_fields = ("component_name", "component_type")
