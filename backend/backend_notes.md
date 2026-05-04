# Backend Notes

This backend is built with Django and Django REST Framework. The main goal is to let users upload business documents and verify later if the document is still original.

## Main Idea

When a supplier uploads a document, the backend does not put the full file on the blockchain. Instead, it creates a SHA-256 hash. This hash works like a fingerprint for the file.

If someone edits the file, even a small edit, the hash will become different. This is how we know if a document is valid or modified.

## Main Files

- `api/models.py`: database tables
- `api/views.py`: API endpoints
- `api/serializers.py`: checks and formats request/response data
- `api/services.py`: helper functions for hashing, risk, trust score, and simulated blockchain
- `api/urls.py`: endpoint routes

## Database Tables

- `User`: stores account information and role
- `Factory`: stores supplier factory profile
- `Document`: stores uploaded document information
- `BlockchainRecord`: stores the document hash as a simulated blockchain record
- `FraudAnalysis`: stores simple risk level
- `TrustScore`: stores score and badge for a factory
- `Dispute`: stores buyer complaints about a document

## Upload Flow

1. Supplier sends file, document type, and factory ID.
2. Backend checks file type and size.
3. Backend creates SHA-256 hash.
4. Backend checks if this hash already exists.
5. Backend saves the document.
6. Backend saves the hash in `BlockchainRecord`.
7. Backend calculates risk level.
8. Backend updates factory trust score.

## Verification Flow

The user can verify in two ways:

- By sending a document ID
- By uploading a file again

The backend checks if the hash exists in `BlockchainRecord`.

Results:

- `Valid`: hash exists and matches
- `Modified`: document exists but blockchain hash does not match
- `Not Found`: no record was found

## Risk Level

For this phase, risk detection is simple rule-based logic:

- `Low`: normal document
- `Medium`: duplicate or large file
- `High`: suspicious file name such as fake, edited, copy, modified, or test

This is not full AI yet. It is a simple version that can later be replaced by an AI model.

## Trust Score

Trust score starts at 5 out of 10.

It increases when a factory has verified documents.

It decreases when there are open disputes or risky documents.

A factory gets a verification badge when:

- trust score is at least 8
- it has at least 3 verified documents
- it has no open disputes
- it has no high-risk documents

## Good Sentence to Say

"Our backend focuses on the core logic first. We simulate the blockchain in a database table because the important software engineering idea is the same: store the hash, then compare hashes during verification."

## Tests

The project includes simple tests for register, login, upload, verification, disputes, and system status.
