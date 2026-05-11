from django.urls import path

from .views import ComponentDetailAPIView, ComponentListCreateAPIView

urlpatterns = [
    path("", ComponentListCreateAPIView.as_view(), name="component-list-create"),
    path("<int:pk>/", ComponentDetailAPIView.as_view(), name="component-detail"),
]
