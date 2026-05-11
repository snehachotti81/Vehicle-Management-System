from django.urls import path

from .views import DailyRevenueAPIView, MonthlyRevenueAPIView, YearlyRevenueAPIView

urlpatterns = [
    path("daily/", DailyRevenueAPIView.as_view(), name="daily-revenue"),
    path("monthly/", MonthlyRevenueAPIView.as_view(), name="monthly-revenue"),
    path("yearly/", YearlyRevenueAPIView.as_view(), name="yearly-revenue"),
]
