from decimal import Decimal

from rest_framework.test import APITestCase

from components.models import Component
from services.models import ServiceRecord
from vehicles.models import Vehicle


class RevenueAPITests(APITestCase):
    def test_daily_revenue(self):
        component = Component.objects.create(
            component_name="Tyre",
            component_type="Wheel",
            purchase_price=Decimal("2500.00"),
            repair_price=Decimal("300.00"),
            stock_quantity=2,
        )
        vehicle = Vehicle.objects.create(
            vehicle_number="TN10DD1111",
            owner_name="Kiran",
            phone_number="9876543210",
            vehicle_model="Nexon",
        )
        ServiceRecord.objects.create(
            vehicle=vehicle,
            selected_component=component,
            issue_description="Flat tyre",
            service_type="Repair",
            labor_charge=Decimal("100.00"),
            quantity=1,
        )
        response = self.client.get("/api/revenue/daily/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]["revenue"], 400.0)
