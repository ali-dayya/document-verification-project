from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase


class BackendFlowTests(APITestCase):
    def register_user(self, email, role):
        response = self.client.post(
            "/api/auth/register",
            {
                "full_name": "Test User",
                "email": email,
                "password": "password123",
                "role": role,
                "phone_number": "70123456",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)

    def login_user(self, email):
        response = self.client.post(
            "/api/auth/login",
            {
                "email": email,
                "password": "password123",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        token = response.data["data"]["token"]
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token)

    def create_factory(self):
        response = self.client.post(
            "/api/factories/profile",
            {
                "factory_name": "Cedar Textiles",
                "description": "Supplier of textile products",
                "category": "Textiles",
                "location": "Beirut",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        return response.data["data"]["factory_id"]

    def upload_document(self, factory_id, file_name="invoice.pdf", file_content=b"invoice number 1"):
        uploaded_file = SimpleUploadedFile(
            file_name,
            file_content,
            content_type="application/pdf",
        )
        response = self.client.post(
            "/api/documents/upload",
            {
                "file": uploaded_file,
                "document_type": "Invoice",
                "factory_id": factory_id,
            },
            format="multipart",
        )
        self.assertEqual(response.status_code, 201)
        return response.data["data"]["document_id"]

    def test_register_and_login(self):
        self.register_user("buyer@example.com", "Buyer")
        self.login_user("buyer@example.com")

    def test_supplier_can_upload_and_verify_document(self):
        self.register_user("supplier@example.com", "Supplier")
        self.login_user("supplier@example.com")

        factory_id = self.create_factory()
        document_id = self.upload_document(factory_id)

        response = self.client.post(
            "/api/documents/verify",
            {"document_id": document_id},
            format="multipart",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["data"]["verification_result"], "Valid")
        self.assertEqual(response.data["data"]["risk_level"], "Low")

    def test_unknown_document_returns_not_found(self):
        self.register_user("buyer@example.com", "Buyer")
        self.login_user("buyer@example.com")

        response = self.client.post(
            "/api/documents/verify",
            {"document_id": 999},
            format="multipart",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["data"]["verification_result"], "Not Found")

    def test_dispute_flow(self):
        self.register_user("supplier@example.com", "Supplier")
        self.login_user("supplier@example.com")
        factory_id = self.create_factory()
        document_id = self.upload_document(factory_id)

        self.register_user("buyer@example.com", "Buyer")
        self.login_user("buyer@example.com")
        response = self.client.post(
            "/api/disputes",
            {
                "document_id": document_id,
                "reason": "The payment proof is not clear.",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        dispute_id = response.data["data"]["dispute_id"]

        self.login_user("supplier@example.com")
        response = self.client.post(
            f"/api/disputes/{dispute_id}/response",
            {
                "supplier_response": "We checked it and uploaded the original file.",
                "status": "Resolved",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["data"]["status"], "Resolved")

    def test_system_status_endpoint(self):
        response = self.client.get("/api/system/status")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["data"]["backend"], "running")
        self.assertEqual(response.data["data"]["blockchain"], "simulated")
        self.assertEqual(response.data["data"]["risk_detection"], "rule-based")
