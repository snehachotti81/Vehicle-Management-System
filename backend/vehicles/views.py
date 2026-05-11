from rest_framework import generics

from .models import Vehicle
from .serializers import VehicleSerializer


class VehicleListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = VehicleSerializer

    def get_queryset(self):
        queryset = Vehicle.objects.all()
        search = self.request.query_params.get("search")
        status = self.request.query_params.get("status")
        if search:
            queryset = queryset.filter(vehicle_number__icontains=search)
        if status:
            queryset = queryset.filter(service_status=status)
        return queryset


class VehicleDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
