from rest_framework import serializers

from .models import Component


class ComponentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Component
        fields = [
            "id",
            "component_name",
            "component_type",
            "purchase_price",
            "repair_price",
            "stock_quantity",
            "created_at",
        ]
