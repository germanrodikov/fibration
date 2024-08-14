// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AdvancedHederaLogger {
    event StateTransitionLogged(address indexed user, bytes32 stateHash, uint256 timestamp, string data);

    bytes32 public currentStateHash;
    mapping(uint256 => bytes32) public stateHistory;
    uint256 public stateChangeCounter;

    constructor() {
        currentStateHash = keccak256(abi.encodePacked(block.timestamp, msg.sender));
        stateHistory[stateChangeCounter] = currentStateHash;
        emit StateTransitionLogged(msg.sender, currentStateHash, block.timestamp, "Initial State");
    }

    function updateState(bytes32 newStateHash, string memory data) external {
        require(newStateHash != currentStateHash, "New state must be different from the current state");
        currentStateHash = newStateHash;
        stateChangeCounter++;
        stateHistory[stateChangeCounter] = newStateHash;
        emit StateTransitionLogged(msg.sender, newStateHash, block.timestamp, data);
    }

    function getStateHistory(uint256 index) external view returns (bytes32) {
        require(index <= stateChangeCounter, "Index out of bounds");
        return stateHistory[index];
    }

    function getCurrentStateHash() external view returns (bytes32) {
        return currentStateHash;
    }
}