from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers

from .models import Dispute, Document, Factory
from .services import calculate_trust_score

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["id", "full_name", "email", "password", "role", "phone_number"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(username=attrs["email"], password=attrs["password"])
        if not user:
            raise serializers.ValidationError("Invalid email or password.")
        attrs["user"] = user
        return attrs


class FactorySerializer(serializers.ModelSerializer):
    factory_id = serializers.IntegerField(source="id", read_only=True)
    trust_score = serializers.SerializerMethodField()
    verification_badge = serializers.SerializerMethodField()
    verified_documents = serializers.SerializerMethodField()

    class Meta:
        model = Factory
        fields = [
            "factory_id",
            "factory_name",
            "description",
            "category",
            "location",
            "trust_score",
            "verification_badge",
            "verified_documents",
        ]

    def get_trust_score(self, obj):
        return float(calculate_trust_score(obj).trust_score)

    def get_verification_badge(self, obj):
        return calculate_trust_score(obj).verification_badge

    def get_verified_documents(self, obj):
        return obj.documents.filter(status=Document.VALID).count()


class DocumentListSerializer(serializers.ModelSerializer):
    document_id = serializers.IntegerField(source="id")
    upload_date = serializers.DateTimeField(source="uploaded_at")
    risk_level = serializers.CharField(source="fraud_analysis.risk_level", default="Low")
    factory_id = serializers.IntegerField(source="factory.id")

    class Meta:
        model = Document
        fields = ["document_id", "document_type", "status", "upload_date", "risk_level", "factory_id"]


class DisputeSerializer(serializers.ModelSerializer):
    dispute_id = serializers.IntegerField(source="id", read_only=True)
    document_id = serializers.IntegerField(source="document.id", read_only=True)

    class Meta:
        model = Dispute
        fields = ["dispute_id", "document_id", "reason", "status", "supplier_response", "created_at"]
