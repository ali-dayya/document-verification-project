// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DocumentRegistry {
    mapping(string => bool) private documentHashes;

    event DocumentHashStored(string documentHash, address indexed storedBy);

    function storeDocumentHash(string memory documentHash) public {
        require(bytes(documentHash).length == 64, "Invalid SHA-256 hash");
        require(!documentHashes[documentHash], "Hash already exists");

        documentHashes[documentHash] = true;
        emit DocumentHashStored(documentHash, msg.sender);
    }

    function verifyDocumentHash(string memory documentHash) public view returns (bool) {
        return documentHashes[documentHash];
    }
}
