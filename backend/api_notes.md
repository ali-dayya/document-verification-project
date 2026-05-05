# API Notes

Base URL:

```text
http://127.0.0.1:8000
```

After login, send the returned token on protected endpoints:

```http
Authorization: Token YOUR_TOKEN
```

## Register

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "full_name": "Ali Backend",
  "email": "ali@example.com",
  "password": "password123",
  "role": "Both",
  "phone_number": "70123456"
}
```

## Login

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "ali@example.com",
  "password": "password123"
}
```

## Create or Update Factory Profile

```http
POST /api/factories/profile
Authorization: Token YOUR_TOKEN
Content-Type: application/json
```

```json
{
  "factory_name": "Cedar Textiles",
  "description": "Supplier of textile products",
  "category": "Textiles",
  "location": "Beirut"
}
```

## Upload Document

Use `multipart/form-data`.

```http
POST /api/documents/upload
Authorization: Token YOUR_TOKEN
```

Fields:

```text
file: invoice.pdf
document_type: Invoice
factory_id: 1
```

Important response fields:

```json
{
  "document_id": 1,
  "status": "Valid",
  "risk_level": "Low",
  "blockchain_transaction_id": "SIM-123456789"
}
```

In real blockchain mode, `blockchain_transaction_id` will be the real transaction hash returned by the blockchain network.

## Verify Document

By uploaded file:

```http
POST /api/documents/verify
Authorization: Token YOUR_TOKEN
```

Fields:

```text
file: invoice.pdf
```

Or by existing document ID:

```json
{
  "document_id": 1
}
```

If real blockchain mode is enabled, the `blockchain` value will be `real`.

## Search Factories

```http
GET /api/factories?category=Textiles&location=Beirut&trust_score=5
Authorization: Token YOUR_TOKEN
```

## Create Dispute

```http
POST /api/disputes
Authorization: Token YOUR_TOKEN
Content-Type: application/json
```

```json
{
  "document_id": 1,
  "reason": "Payment proof is unclear"
}
```

## Supplier Responds to Dispute

```http
POST /api/disputes/1/response
Authorization: Token SUPPLIER_TOKEN
Content-Type: application/json
```

```json
{
  "supplier_response": "We checked the invoice and uploaded the original document.",
  "status": "Under Review"
}
```

## Trust Score

```http
GET /api/trust-score/1
Authorization: Token YOUR_TOKEN
```

## System Status

```http
GET /api/system/status
```

Example response:

```json
{
  "success": true,
  "message": "System status retrieved successfully",
  "data": {
    "backend": "running",
    "blockchain": "simulated",
    "risk_detection": "rule-based",
    "database": "SQLite for demo, PostgreSQL-ready"
  }
}
```
