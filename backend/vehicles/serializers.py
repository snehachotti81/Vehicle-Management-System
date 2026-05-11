from rest_framework import serializers

from .models import Vehicle


class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = [
            "id",
            "vehicle_number",
            "owner_name",
            "phone_number",
            "vehicle_model",
            "service_status",
            "created_at",
        ]

    def validate_phone_number(self, value):
        cleaned = value.replace(" ", "").replace("-", "")
        if not cleaned.isdigit() or len(cleaned) < 10:
            raise serializers.ValidationError("Enter a valid phone number.")
        return value
