// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract Fibration {
    // Struct to hold the Merkle root and the associated timestamp
    struct StateCommitment {
        bytes32 merkleRoot;
        uint256 timestamp;
    }

    // Mapping of batch ID to state commitment
    mapping(uint256 => StateCommitment) private stateCommitments;

    // Counter to track the current batch ID
    uint256 private currentBatchId;

    // Variable to hold the latest state
    bytes32 public latestState;

    // Event emitted when a new state is committed
    event StateCommitted(uint256 batchId, bytes32 merkleRoot, uint256 timestamp);

    // Event emitted when a new state is processed
    event StateProcessed(bytes32 newState);

    constructor() {
        currentBatchId = 0; // Initialize the batch ID counter
    }

    // Function to commit a new state (Merkle root)
    function commitState(bytes32 _merkleRoot) external returns (uint256) {
        stateCommitments[currentBatchId] = StateCommitment({
            merkleRoot: _merkleRoot,
            timestamp: block.timestamp
        });

        emit StateCommitted(currentBatchId, _merkleRoot, block.timestamp);

        currentBatchId++;

        return currentBatchId - 1; // Return the batch ID of the committed state
    }

    // Function to retrieve the Merkle root for a given batch ID
    function getStateRoot(uint256 _batchId) external view returns (bytes32, uint256) {
        require(_batchId < currentBatchId, "Invalid batch ID");

        StateCommitment memory commitment = stateCommitments[_batchId];
        return (commitment.merkleRoot, commitment.timestamp);
    }

    // Function to process a new state (this will be called from the execution environment)
    function processNewState(bytes32 _newState) external {
        // Update the latest state with the provided new state
        latestState = _newState;

        // Emit an event to signal that the state has been processed
        emit StateProcessed(_newState);
    }
}