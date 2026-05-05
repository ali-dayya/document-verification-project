import hashlib

from .blockchain import hash_exists_on_blockchain, store_hash_on_blockchain
from .models import Dispute, Document, FraudAnalysis, TrustScore


def api_response(success=True, message="Action completed successfully", data=None, status_code=200):
    from rest_framework.response import Response

    # All APIs return the same shape so frontend work is easier.
    return Response(
        {
            "success": success,
            "message": message,
            "data": data if success else None,
        },
        status=status_code,
    )


def hash_uploaded_file(uploaded_file):
    # SHA-256 gives the document a unique fingerprint.
    # If one letter in the file changes, the hash also changes.
    sha256 = hashlib.sha256()
    for chunk in uploaded_file.chunks():
        sha256.update(chunk)
    uploaded_file.seek(0)
    return sha256.hexdigest()


def create_blockchain_record(document):
    return store_hash_on_blockchain(document)


def verify_hash_on_blockchain(file_hash):
    return hash_exists_on_blockchain(file_hash)


def analyze_risk(document, duplicate_exists=False):
    # Simple rule-based risk check for the prototype.
    filename = document.original_filename.lower()
    suspicious_words = ["fake", "edited", "copy", "modified", "test"]

    if duplicate_exists:
        risk_level = FraudAnalysis.MEDIUM
        reason = "Duplicate document hash already exists."
    elif any(word in filename for word in suspicious_words):
        risk_level = FraudAnalysis.HIGH
        reason = "Filename contains suspicious wording."
    elif document.file.size > 5 * 1024 * 1024:
        risk_level = FraudAnalysis.MEDIUM
        reason = "Large file size requires extra review."
    else:
        risk_level = FraudAnalysis.LOW
        reason = "No suspicious rule-based indicators found."

    return FraudAnalysis.objects.create(document=document, risk_level=risk_level, reason=reason)


def calculate_trust_score(factory):
    # Start from 5/10, then add or subtract points.
    # This keeps the formula easy to explain and easy to change.
    documents = factory.documents.all()
    verified_count = documents.filter(status=Document.VALID).count()
    disputes = Dispute.objects.filter(factory=factory)
    open_disputes = disputes.exclude(status=Dispute.RESOLVED).count()
    high_risk = FraudAnalysis.objects.filter(document__factory=factory, risk_level=FraudAnalysis.HIGH).count()
    medium_risk = FraudAnalysis.objects.filter(document__factory=factory, risk_level=FraudAnalysis.MEDIUM).count()

    score = 5.0
    score += min(verified_count * 0.8, 3.0)
    score -= min(open_disputes * 1.0, 2.0)
    score -= min(high_risk * 1.5, 3.0)
    score -= min(medium_risk * 0.5, 1.5)
    score = round(max(0, min(10, score)), 1)

    if score >= 8:
        label = "High Trust"
    elif score >= 5:
        label = "Medium Trust"
    else:
        label = "Low Trust"

    badge = score >= 8 and verified_count >= 3 and open_disputes == 0 and high_risk == 0
    reason = f"{verified_count} verified documents, {open_disputes} open disputes, {high_risk} high risk documents."

    record, _ = TrustScore.objects.update_or_create(
        factory=factory,
        defaults={
            "trust_score": score,
            "trust_label": label,
            "verification_badge": badge,
            "score_reason": reason,
        },
    )
    return record
