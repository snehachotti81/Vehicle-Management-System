from django.db.models import Sum
from django.db.models.functions import TruncDate, TruncMonth, TruncYear
from rest_framework.response import Response
from rest_framework.views import APIView

from services.models import ServiceRecord


class RevenueBaseAPIView(APIView):
    truncator = None
    label_format = "%Y-%m-%d"

    def get(self, request):
        rows = (
            ServiceRecord.objects.annotate(period=self.truncator("created_at"))
            .values("period")
            .annotate(revenue=Sum("total_amount"))
            .order_by("period")
        )
        return Response(
            [
                {
                    "period": row["period"].strftime(self.label_format),
                    "revenue": float(row["revenue"] or 0),
                }
                for row in rows
            ]
        )


class DailyRevenueAPIView(RevenueBaseAPIView):
    truncator = TruncDate
    label_format = "%Y-%m-%d"


class MonthlyRevenueAPIView(RevenueBaseAPIView):
    truncator = TruncMonth
    label_format = "%Y-%m"


class YearlyRevenueAPIView(RevenueBaseAPIView):
    truncator = TruncYear
    label_format = "%Y"
