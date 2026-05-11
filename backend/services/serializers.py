from rest_framework import serializers

from components.serializers import ComponentSerializer
from vehicles.serializers import VehicleSerializer

from .models import ServiceRecord


class ServiceRecordSerializer(serializers.ModelSerializer):
    vehicle_detail = VehicleSerializer(source="vehicle", read_only=True)
    component_detail = ComponentSerializer(source="selected_component", read_only=True)

    class Meta:
        model = ServiceRecord
        fields = [
            "id",
            "vehicle",
            "vehicle_detail",
            "issue_description",
            "selected_component",
            "component_detail",
            "service_type",
            "labor_charge",
            "quantity",
            "total_amount",
            "created_at",
        ]
        read_only_fields = ["total_amount", "created_at"]

    def validate(self, attrs):
        component = attrs.get("selected_component") or getattr(self.instance, "selected_component", None)
        service_type = attrs.get("service_type") or getattr(self.instance, "service_type", None)
        quantity = attrs.get("quantity") or getattr(self.instance, "quantity", 1)
        if service_type == ServiceRecord.ServiceType.REPLACE and component and quantity > component.stock_quantity:
            raise serializers.ValidationError("Not enough stock for replacement.")
        return attrs
