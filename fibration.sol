// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./hedera/HederaConsensusService.sol"; 

contract HederaStateLogger {
    // logging state
    event StateTransitionLogged(address indexed user, bytes32 stateHash, uint256 timestamp);

    // hash state save
    bytes32 public currentStateHash;

    // init
    constructor() {
        currentStateHash = keccak256(abi.encodePacked(block.timestamp, msg.sender));
        logStateTransition(currentStateHash);
    }

    // update stete
    function updateState(bytes32 newStateHash) external {
        require(newStateHash != currentStateHash, "New state must be different from the current state");
        currentStateHash = newStateHash;
        logStateTransition(newStateHash);
    }

    // logging state on Hedera
    function logStateTransition(bytes32 stateHash) internal {
        uint256 currentTimestamp = block.timestamp;

        // call HCS for saving and timestep
        HederaConsensusService.logEvent(stateHash, currentTimestamp);

        emit StateTransitionLogged(msg.sender, stateHash, currentTimestamp);
    }

    // get current hash stete
    function getCurrentStateHash() external view returns (bytes32) {
        return currentStateHash;
    }
}

