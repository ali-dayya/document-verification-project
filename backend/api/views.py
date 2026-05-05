from django.conf import settings
from rest_framework.authtoken.models import Token
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView

from .models import BlockchainRecord, Dispute, Document, Factory
from .permissions import IsSupplierOrBoth
from .serializers import DisputeSerializer, DocumentListSerializer, FactorySerializer, LoginSerializer, RegisterSerializer
from .services import analyze_risk, api_response, calculate_trust_score, create_blockchain_record, hash_uploaded_file, verify_hash_on_blockchain


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return api_response(False, serializer.errors, status_code=400)
        user = serializer.save()
        return api_response(
            True,
            "User registered successfully",
            {
                "user_id": user.id,
                "full_name": user.full_name,
                "email": user.email,
                "role": user.role,
                "message": "User registered successfully",
            },
            201,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return api_response(False, "Invalid email or password", status_code=400)
        user = serializer.validated_data["user"]
        token, _ = Token.objects.get_or_create(user=user)
        return api_response(
            True,
            "Login successful",
            {
                "user_id": user.id,
                "full_name": user.full_name,
                "email": user.email,
                "role": user.role,
                "token": token.key,
                "message": "Login successful",
            },
        )


class DocumentUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsSupplierOrBoth]

    def post(self, request):
        uploaded_file = request.FILES.get("file")
        document_type = request.data.get("document_type")
        factory_id = request.data.get("factory_id")

        if not uploaded_file or not document_type or not factory_id:
            return api_response(False, "file, document_type, and factory_id are required", status_code=400)
        if uploaded_file.size > 10 * 1024 * 1024:
            return api_response(False, "File size must be 10MB or less", status_code=400)
        if uploaded_file.content_type not in ["application/pdf", "image/png", "image/jpeg"]:
            return api_response(False, "Only PDF, PNG, and JPEG files are allowed", status_code=400)

        try:
            factory = Factory.objects.get(id=factory_id, owner=request.user)
        except Factory.DoesNotExist:
            return api_response(False, "Factory not found for this supplier", status_code=404)

        file_hash = hash_uploaded_file(uploaded_file)

        # We do not accept the same exact document twice.
        duplicate_exists = Document.objects.filter(file_hash=file_hash).exists()
        if duplicate_exists:
            return api_response(False, "Duplicate document hash already exists", status_code=409)

        document = Document.objects.create(
            uploader=request.user,
            factory=factory,
            file=uploaded_file,
            original_filename=uploaded_file.name,
            document_type=document_type,
            file_hash=file_hash,
            status=Document.VALID,
        )

        # After upload we save the hash, check risk, and update the factory score.
        blockchain_record = create_blockchain_record(document)
        risk = analyze_risk(document)
        calculate_trust_score(factory)

        return api_response(
            True,
            "Document uploaded successfully",
            {
                "document_id": document.id,
                "status": document.status,
                "risk_level": risk.risk_level,
                "blockchain_transaction_id": blockchain_record.transaction_id,
                "message": "Document uploaded successfully",
            },
            201,
        )


class DocumentVerifyView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        document_id = request.data.get("document_id")
        uploaded_file = request.FILES.get("file")

        if document_id:
            document = Document.objects.filter(id=document_id).first()
            if not document:
                return api_response(
                    True,
                    "Verification completed",
                    {
                        "verification_result": "Not Found",
                        "risk_level": None,
                        "message": "Document not found",
                    },
                )

            exists = BlockchainRecord.objects.filter(document=document, document_hash=document.file_hash).exists()
            result = "Valid" if exists else "Modified"
            risk_level = getattr(getattr(document, "fraud_analysis", None), "risk_level", "Low")
            return api_response(
                True,
                "Verification completed",
                {
                    "verification_result": result,
                    "risk_level": risk_level,
                    "message": "Verification completed",
                },
            )

        if uploaded_file:
            file_hash = hash_uploaded_file(uploaded_file)
            record = BlockchainRecord.objects.filter(document_hash=file_hash).select_related("document").first()
            if not verify_hash_on_blockchain(file_hash):
                return api_response(
                    True,
                    "Verification completed",
                    {
                        "verification_result": "Not Found",
                        "risk_level": None,
                        "message": "Document not found",
                    },
                )

            risk_level = "Low"
            if record:
                risk_level = getattr(getattr(record.document, "fraud_analysis", None), "risk_level", "Low")
            return api_response(
                True,
                "Verification completed",
                {
                    "verification_result": "Valid",
                    "risk_level": risk_level,
                    "message": "Verification completed",
                },
            )

        return api_response(False, "file or document_id is required", status_code=400)


class DocumentListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = Document.objects.select_related("factory", "fraud_analysis")
        if request.user.role == "Supplier":
            queryset = queryset.filter(uploader=request.user)
        serializer = DocumentListSerializer(queryset.order_by("-uploaded_at"), many=True)
        return api_response(True, "Documents retrieved successfully", serializer.data)


class FactoryListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = Factory.objects.all()
        category = request.query_params.get("category")
        location = request.query_params.get("location")
        trust_score = request.query_params.get("trust_score")

        if category:
            queryset = queryset.filter(category__icontains=category)
        if location:
            queryset = queryset.filter(location__icontains=location)

        factories = list(queryset)
        factories.sort(key=lambda factory: float(calculate_trust_score(factory).trust_score), reverse=True)
        if trust_score:
            factories = [
                factory
                for factory in factories
                if float(calculate_trust_score(factory).trust_score) >= float(trust_score)
            ]

        serializer = FactorySerializer(factories, many=True)
        return api_response(True, "Factories retrieved successfully", serializer.data)


class FactoryDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, factory_id):
        try:
            factory = Factory.objects.get(id=factory_id)
        except Factory.DoesNotExist:
            return api_response(False, "Factory not found", status_code=404)
        return api_response(True, "Factory retrieved successfully", FactorySerializer(factory).data)


class FactoryProfileView(APIView):
    permission_classes = [IsSupplierOrBoth]

    def post(self, request):
        factory, _ = Factory.objects.update_or_create(
            owner=request.user,
            defaults={
                "factory_name": request.data.get("factory_name", ""),
                "description": request.data.get("description", ""),
                "category": request.data.get("category", ""),
                "location": request.data.get("location", ""),
            },
        )
        calculate_trust_score(factory)
        return api_response(
            True,
            "Factory profile saved successfully",
            {
                "factory_id": factory.id,
                "message": "Factory profile saved successfully",
            },
        )


class DisputeListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        disputes = Dispute.objects.select_related("document", "factory")
        if request.user.role == "Supplier":
            disputes = disputes.filter(factory__owner=request.user)
        elif request.user.role == "Buyer":
            disputes = disputes.filter(created_by=request.user)
        serializer = DisputeSerializer(disputes.order_by("-created_at"), many=True)
        return api_response(True, "Disputes retrieved successfully", serializer.data)

    def post(self, request):
        document_id = request.data.get("document_id")
        reason = request.data.get("reason")
        if not document_id or not reason:
            return api_response(False, "document_id and reason are required", status_code=400)
        try:
            document = Document.objects.select_related("factory").get(id=document_id)
        except Document.DoesNotExist:
            return api_response(False, "Document not found", status_code=404)
        dispute = Dispute.objects.create(
            created_by=request.user,
            document=document,
            factory=document.factory,
            reason=reason,
        )
        calculate_trust_score(document.factory)
        return api_response(
            True,
            "Dispute created successfully",
            {
                "dispute_id": dispute.id,
                "status": dispute.status,
                "message": "Dispute created successfully",
            },
            201,
        )


class DisputeUpdateView(APIView):
    permission_classes = [IsSupplierOrBoth]

    def post(self, request, dispute_id):
        try:
            dispute = Dispute.objects.select_related("factory").get(
                id=dispute_id,
                factory__owner=request.user,
            )
        except Dispute.DoesNotExist:
            return api_response(False, "Dispute not found for this supplier", status_code=404)

        supplier_response = request.data.get("supplier_response", "")
        status_value = request.data.get("status", Dispute.UNDER_REVIEW)

        if status_value not in [Dispute.OPEN, Dispute.UNDER_REVIEW, Dispute.RESOLVED]:
            return api_response(False, "Invalid dispute status", status_code=400)

        if supplier_response:
            dispute.supplier_response = supplier_response
        dispute.status = status_value
        dispute.save()

        calculate_trust_score(dispute.factory)

        return api_response(
            True,
            "Dispute updated successfully",
            {
                "dispute_id": dispute.id,
                "status": dispute.status,
                "supplier_response": dispute.supplier_response,
                "message": "Dispute updated successfully",
            },
        )


class TrustScoreView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, factory_id):
        try:
            factory = Factory.objects.get(id=factory_id)
        except Factory.DoesNotExist:
            return api_response(False, "Factory not found", status_code=404)
        score = calculate_trust_score(factory)
        return api_response(
            True,
            "Trust score retrieved successfully",
            {
                "factory_id": factory.id,
                "trust_score": float(score.trust_score),
                "trust_label": score.trust_label,
                "verification_badge": score.verification_badge,
                "score_reason": score.score_reason,
            },
        )


class SystemStatusView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return api_response(
            True,
            "System status retrieved successfully",
            {
                "backend": "running",
                "blockchain": "real" if settings.BLOCKCHAIN_MODE == "real" else "simulated",
                "risk_detection": "rule-based",
                "database": "SQLite for demo, PostgreSQL-ready",
            },
        )
