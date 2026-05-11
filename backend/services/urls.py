from django.urls import path

from .views import ServiceRecordDetailAPIView, ServiceRecordListCreateAPIView

urlpatterns = [
    path("", ServiceRecordListCreateAPIView.as_view(), name="service-list-create"),
    path("<int:pk>/", ServiceRecordDetailAPIView.as_view(), name="service-detail"),
]
