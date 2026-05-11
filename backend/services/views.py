from django.db import transaction
from rest_framework import generics

from .models import ServiceRecord
from .serializers import ServiceRecordSerializer


class ServiceRecordListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = ServiceRecordSerializer

    def get_queryset(self):
        queryset = ServiceRecord.objects.select_related("vehicle", "selected_component")
        vehicle = self.request.query_params.get("vehicle")
        service_type = self.request.query_params.get("service_type")
        if vehicle:
            queryset = queryset.filter(vehicle_id=vehicle)
        if service_type:
            queryset = queryset.filter(service_type=service_type)
        return queryset

    @transaction.atomic
    def perform_create(self, serializer):
        record = serializer.save()
        if record.service_type == ServiceRecord.ServiceType.REPLACE:
            component = record.selected_component
            component.stock_quantity -= record.quantity
            component.save(update_fields=["stock_quantity"])


class ServiceRecordDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ServiceRecord.objects.select_related("vehicle", "selected_component")
    serializer_class = ServiceRecordSerializer
