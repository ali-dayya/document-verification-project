# Blockchain-Based Document Verification Backend

This is the Django REST backend for the software engineering project.

The backend handles:

- user registration and login
- buyer, supplier, and both roles
- factory profiles
- document upload
- SHA-256 document hashing
- simulated or real blockchain records
- document verification
- simple risk detection
- trust score and badge
- disputes and supplier responses

## Setup

Install the required packages:

```powershell
pip install -r requirements.txt
```

Prepare the database:

```powershell
python manage.py makemigrations
python manage.py migrate
```

Run the backend:

```powershell
python manage.py runserver 127.0.0.1:8000
```

Or use the helper script:

```powershell
.\run_backend.ps1
```

The backend runs at:

```text
http://127.0.0.1:8000
```

## Database

By default, the project uses SQLite. This is enough for local testing and presentation.

The settings file also supports PostgreSQL using environment variables:

```powershell
$env:POSTGRES_DB="document_verification"
$env:POSTGRES_USER="postgres"
$env:POSTGRES_PASSWORD="your_password"
$env:POSTGRES_HOST="localhost"
$env:POSTGRES_PORT="5432"
```

## Blockchain

The backend has two blockchain modes.

Default local mode:

```text
BLOCKCHAIN_MODE=simulated
```

Real blockchain mode uses the Solidity contract in:

```text
contracts/DocumentRegistry.sol
```

Required environment variables:

```powershell
$env:BLOCKCHAIN_MODE="real"
$env:BLOCKCHAIN_NETWORK_NAME="local"
$env:WEB3_PROVIDER_URL="http://127.0.0.1:8545"
$env:BLOCKCHAIN_CONTRACT_ADDRESS="your_contract_address"
$env:BLOCKCHAIN_PRIVATE_KEY="your_wallet_private_key"
```

The frontend still uses the same upload and verify endpoints.

Local setup steps are written in:

```text
blockchain_setup.md
```

## Run Tests

```powershell
python manage.py test
```

## Authentication

Login returns a token. Protected APIs need this header:

```http
Authorization: Token YOUR_TOKEN
```

## API Response Format

Success:

```json
{
  "success": true,
  "message": "Action completed successfully",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Something went wrong",
  "data": null
}
```

## Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/documents/upload`
- `POST /api/documents/verify`
- `GET /api/documents`
- `GET /api/factories`
- `GET /api/factories/{id}`
- `POST /api/factories/profile`
- `POST /api/disputes`
- `GET /api/disputes`
- `POST /api/disputes/{id}/response`
- `GET /api/trust-score/{factory_id}`
- `GET /api/system/status`
