from rest_framework.test import APITestCase


class VehicleAPITests(APITestCase):
    def test_create_and_search_vehicle(self):
        self.client.post(
            "/api/vehicles/",
            {
                "vehicle_number": "MH12AB1234",
                "owner_name": "Asha Rao",
                "phone_number": "9876543210",
                "vehicle_model": "Honda City",
                "service_status": "Pending",
            },
            format="json",
        )
        response = self.client.get("/api/vehicles/?search=MH12")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]["owner_name"], "Asha Rao")
