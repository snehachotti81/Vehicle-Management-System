from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/components/", include("components.urls")),
    path("api/vehicles/", include("vehicles.urls")),
    path("api/services/", include("services.urls")),
    path("api/revenue/", include("dashboard.urls")),
]
