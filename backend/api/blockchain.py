import json
import uuid
from pathlib import Path

from django.conf import settings

from .models import BlockchainRecord


def blockchain_mode():
    return settings.BLOCKCHAIN_MODE.lower()


def store_hash_on_blockchain(document):
    if blockchain_mode() == "real":
        return store_hash_on_real_blockchain(document)
    return store_hash_in_database(document)


def hash_exists_on_blockchain(document_hash):
    if blockchain_mode() == "real":
        return hash_exists_on_real_blockchain(document_hash)
    return BlockchainRecord.objects.filter(document_hash=document_hash).exists()


def store_hash_in_database(document):
    last_block = BlockchainRecord.objects.order_by("-block_number").first()
    next_block = last_block.block_number + 1 if last_block else 1

    return BlockchainRecord.objects.create(
        document=document,
        document_hash=document.file_hash,
        block_number=next_block,
        transaction_id=f"SIM-{uuid.uuid4().hex[:16].upper()}",
        network_name="simulated",
    )


def get_contract():
    from web3 import Web3

    abi_path = Path(settings.BASE_DIR) / "contracts" / "DocumentRegistry.abi.json"
    abi = json.loads(abi_path.read_text())

    web3 = Web3(Web3.HTTPProvider(settings.WEB3_PROVIDER_URL))
    contract = web3.eth.contract(
        address=Web3.to_checksum_address(settings.BLOCKCHAIN_CONTRACT_ADDRESS),
        abi=abi,
    )
    return web3, contract


def store_hash_on_real_blockchain(document):
    if not settings.WEB3_PROVIDER_URL or not settings.BLOCKCHAIN_CONTRACT_ADDRESS or not settings.BLOCKCHAIN_PRIVATE_KEY:
        raise ValueError("Real blockchain mode needs provider URL, contract address, and private key.")

    web3, contract = get_contract()
    if not web3.is_connected():
        raise ValueError("Cannot connect to blockchain provider.")

    account = web3.eth.account.from_key(settings.BLOCKCHAIN_PRIVATE_KEY)
    transaction = contract.functions.storeDocumentHash(document.file_hash).build_transaction(
        {
            "from": account.address,
            "nonce": web3.eth.get_transaction_count(account.address),
            "gas": 200000,
            "gasPrice": web3.eth.gas_price,
        }
    )
    signed_transaction = account.sign_transaction(transaction)
    raw_transaction = getattr(signed_transaction, "rawTransaction", signed_transaction.raw_transaction)
    transaction_hash = web3.eth.send_raw_transaction(raw_transaction)
    receipt = web3.eth.wait_for_transaction_receipt(transaction_hash)

    return BlockchainRecord.objects.create(
        document=document,
        document_hash=document.file_hash,
        block_number=receipt.blockNumber,
        transaction_id=transaction_hash.hex(),
        contract_address=settings.BLOCKCHAIN_CONTRACT_ADDRESS,
        network_name=settings.BLOCKCHAIN_NETWORK_NAME,
    )


def hash_exists_on_real_blockchain(document_hash):
    web3, contract = get_contract()
    if not web3.is_connected():
        raise ValueError("Cannot connect to blockchain provider.")
    return contract.functions.verifyDocumentHash(document_hash).call()
