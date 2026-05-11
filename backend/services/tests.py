from decimal import Decimal

from django.test import TestCase
from rest_framework.test import APITestCase

from components.models import Component
from vehicles.models import Vehicle

from .models import ServiceRecord


class BillCalculationTests(TestCase):
    def setUp(self):
        self.component = Component.objects.create(
            component_name="Clutch Plate",
            component_type="Transmission",
            purchase_price=Decimal("3000.00"),
            repair_price=Decimal("700.00"),
            stock_quantity=5,
        )
        self.vehicle = Vehicle.objects.create(
            vehicle_number="KA01AA1111",
            owner_name="Neeraj",
            phone_number="9876543210",
            vehicle_model="Swift",
        )

    def test_repair_uses_repair_price(self):
        record = ServiceRecord.objects.create(
            vehicle=self.vehicle,
            selected_component=self.component,
            issue_description="Noise while shifting",
            service_type="Repair",
            labor_charge=Decimal("200.00"),
            quantity=2,
        )
        self.assertEqual(record.total_amount, Decimal("1600.00"))

    def test_replace_uses_purchase_price(self):
        record = ServiceRecord.objects.create(
            vehicle=self.vehicle,
            selected_component=self.component,
            issue_description="Worn out",
            service_type="Replace",
            labor_charge=Decimal("500.00"),
            quantity=1,
        )
        self.assertEqual(record.total_amount, Decimal("3500.00"))


class ServiceAPITests(APITestCase):
    def test_create_service_record(self):
        component = Component.objects.create(
            component_name="Air Filter",
            component_type="Engine",
            purchase_price=Decimal("900.00"),
            repair_price=Decimal("100.00"),
            stock_quantity=3,
        )
        vehicle = Vehicle.objects.create(
            vehicle_number="DL05CC4321",
            owner_name="Meera",
            phone_number="9123456780",
            vehicle_model="i20",
        )
        response = self.client.post(
            "/api/services/",
            {
                "vehicle": vehicle.id,
                "selected_component": component.id,
                "issue_description": "Filter clogged",
                "service_type": "Replace",
                "labor_charge": "150.00",
                "quantity": 2,
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["total_amount"], "1950.00")
