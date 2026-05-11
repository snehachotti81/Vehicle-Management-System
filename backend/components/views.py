from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status

from .models import Component
from .serializers import ComponentSerializer


class ComponentListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = ComponentSerializer

    def get_queryset(self):
        queryset = Component.objects.all()
        search = self.request.query_params.get("search")
        component_type = self.request.query_params.get("type")
        if search:
            queryset = queryset.filter(component_name__icontains=search)
        if component_type:
            queryset = queryset.filter(component_type__icontains=component_type)
        return queryset


class ComponentDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Component.objects.all()
    serializer_class = ComponentSerializer

    def destroy(self, request, *args, **kwargs):
        component = self.get_object()
        if component.service_records.exists():
            return Response(
                {
                    "detail": (
                        "This component is used in service history and cannot be deleted. "
                        "Delete related service records first, or keep it for invoice history."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        return super().destroy(request, *args, **kwargs)
