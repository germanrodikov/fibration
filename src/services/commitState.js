const { ContractExecuteTransaction, ContractFunctionParameters } = require("@hashgraph/sdk");
const { createClient } = require("../config/client");

async function commitState(contractId, merkleRoot) {
    const client = createClient();

    const contractExecuteTx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("commitState", new ContractFunctionParameters().addBytes32(merkleRoot));

    try {
        const response = await contractExecuteTx.execute(client);
        const receipt = await response.getReceipt(client);
        console.log("State committed with receipt:", receipt.status.toString());
        return receipt.status.toString();
    } catch (error) {
        console.error("Error committing state:", error);
        throw error;
    }
}

module.exports = { commitState };