from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    # We use the same role names that we agreed on in the API contract.
    BUYER = "Buyer"
    SUPPLIER = "Supplier"
    BOTH = "Both"
    ROLE_CHOICES = [(BUYER, BUYER), (SUPPLIER, SUPPLIER), (BOTH, BOTH)]

    username = models.CharField(max_length=150, unique=True, blank=True)
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    phone_number = models.CharField(max_length=30, blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name", "role"]

    def save(self, *args, **kwargs):
        if not self.username:
            self.username = self.email
        super().save(*args, **kwargs)


class Factory(models.Model):
    # A supplier can create one factory profile.
    owner = models.OneToOneField(User, on_delete=models.CASCADE, related_name="factory")
    factory_name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=120)
    location = models.CharField(max_length=120)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.factory_name


class Document(models.Model):
    # The real file is saved in media/documents.
    # The blockchain part only stores the hash, not the file itself.
    PENDING = "Pending"
    VALID = "Valid"
    MODIFIED = "Modified"
    NOT_FOUND = "Not Found"
    STATUS_CHOICES = [(PENDING, PENDING), (VALID, VALID), (MODIFIED, MODIFIED), (NOT_FOUND, NOT_FOUND)]

    uploader = models.ForeignKey(User, on_delete=models.CASCADE, related_name="documents")
    factory = models.ForeignKey(Factory, on_delete=models.CASCADE, related_name="documents")
    file = models.FileField(upload_to="documents/")
    original_filename = models.CharField(max_length=255)
    document_type = models.CharField(max_length=120)
    file_hash = models.CharField(max_length=64, db_index=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=VALID)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.document_type} - {self.original_filename}"


class BlockchainRecord(models.Model):
    # This is our simulated blockchain table for the demo.
    # In a real blockchain, this data would be written by a smart contract.
    document = models.OneToOneField(Document, on_delete=models.CASCADE, related_name="blockchain_record")
    document_hash = models.CharField(max_length=64, unique=True)
    block_number = models.PositiveIntegerField()
    transaction_id = models.CharField(max_length=80, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.transaction_id


class FraudAnalysis(models.Model):
    # For this phase, fraud detection is rule-based and simple.
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    RISK_CHOICES = [(LOW, LOW), (MEDIUM, MEDIUM), (HIGH, HIGH)]

    document = models.OneToOneField(Document, on_delete=models.CASCADE, related_name="fraud_analysis")
    risk_level = models.CharField(max_length=10, choices=RISK_CHOICES)
    reason = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


class TrustScore(models.Model):
    # The score is recalculated whenever documents or disputes change.
    factory = models.OneToOneField(Factory, on_delete=models.CASCADE, related_name="trust_score_record")
    trust_score = models.DecimalField(max_digits=3, decimal_places=1, default=0)
    trust_label = models.CharField(max_length=40, default="New")
    verification_badge = models.BooleanField(default=False)
    score_reason = models.TextField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)


class Dispute(models.Model):
    # Buyers open disputes, and suppliers can respond later.
    OPEN = "Open"
    UNDER_REVIEW = "Under Review"
    RESOLVED = "Resolved"
    STATUS_CHOICES = [(OPEN, OPEN), (UNDER_REVIEW, UNDER_REVIEW), (RESOLVED, RESOLVED)]

    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="created_disputes")
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name="disputes")
    factory = models.ForeignKey(Factory, on_delete=models.CASCADE, related_name="disputes")
    reason = models.TextField()
    supplier_response = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=OPEN)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
