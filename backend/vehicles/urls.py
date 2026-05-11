from django.urls import path

from .views import VehicleDetailAPIView, VehicleListCreateAPIView

urlpatterns = [
    path("", VehicleListCreateAPIView.as_view(), name="vehicle-list-create"),
    path("<int:pk>/", VehicleDetailAPIView.as_view(), name="vehicle-detail"),
]
