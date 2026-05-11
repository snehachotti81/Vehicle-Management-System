from decimal import Decimal

from django.test import TestCase
from rest_framework.test import APITestCase

from services.models import ServiceRecord
from vehicles.models import Vehicle

from .models import Component


class ComponentModelTests(TestCase):
    def test_component_string(self):
        component = Component.objects.create(
            component_name="Brake Pad",
            component_type="Brake",
            purchase_price=Decimal("1200.00"),
            repair_price=Decimal("300.00"),
            stock_quantity=8,
        )
        self.assertEqual(str(component), "Brake Pad")


class ComponentAPITests(APITestCase):
    def test_create_and_list_component(self):
        response = self.client.post(
            "/api/components/",
            {
                "component_name": "Battery",
                "component_type": "Electrical",
                "purchase_price": "4500.00",
                "repair_price": "500.00",
                "stock_quantity": 4,
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(self.client.get("/api/components/").data[0]["component_name"], "Battery")

    def test_delete_unused_component(self):
        component = Component.objects.create(
            component_name="Mirror",
            component_type="Body",
            purchase_price=Decimal("800.00"),
            repair_price=Decimal("100.00"),
            stock_quantity=2,
        )
        response = self.client.delete(f"/api/components/{component.id}/")
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Component.objects.filter(id=component.id).exists())

    def test_delete_component_used_in_service_returns_message(self):
        component = Component.objects.create(
            component_name="Brake Pad",
            component_type="Brake",
            purchase_price=Decimal("1200.00"),
            repair_price=Decimal("300.00"),
            stock_quantity=8,
        )
        vehicle = Vehicle.objects.create(
            vehicle_number="MH12AB1234",
            owner_name="Asha Rao",
            phone_number="9876543210",
            vehicle_model="Honda City",
        )
        ServiceRecord.objects.create(
            vehicle=vehicle,
            selected_component=component,
            issue_description="Brake noise",
            service_type="Repair",
            labor_charge=Decimal("200.00"),
            quantity=1,
        )
        response = self.client.delete(f"/api/components/{component.id}/")
        self.assertEqual(response.status_code, 400)
        self.assertIn("service history", response.data["detail"])
