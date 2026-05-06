# Local Blockchain Setup

This project can use Ganache as a local Ethereum blockchain.

## 1. Install blockchain tools

```powershell
cd backend/blockchain_tools
npm.cmd install
```

## 2. Start Ganache

Open a terminal in `backend` and run:

```powershell
.\start_ganache.ps1
```

Keep this terminal open.

## 3. Copy a private key

Ganache prints local accounts and private keys in the terminal.

Copy one private key and set it in a second terminal:

```powershell
$env:BLOCKCHAIN_PRIVATE_KEY="paste_private_key_here"
```

## 4. Deploy the contract

In the same second terminal:

```powershell
.\deploy_contract.ps1
```

The script prints the contract address and the environment variables needed by Django.

## 5. Run Django in real blockchain mode

Set the values printed by the deploy script, then run:

```powershell
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

Open:

```text
http://127.0.0.1:8000/api/system/status
```

The blockchain value should be:

```json
"real"
```
