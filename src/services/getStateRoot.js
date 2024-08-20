const { ContractCallQuery, ContractFunctionParameters } = require("@hashgraph/sdk");
const { createClient } = require("../config/client");

async function getStateRoot(contractId, batchId) {
    const client = createClient();

    const contractCall = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("getStateRoot", new ContractFunctionParameters().addUint256(batchId));

    try {
        const response = await contractCall.execute(client);
        const merkleRoot = response.getBytes32(0);
        const timestamp = response.getUint256(1);

        console.log("Merkle Root:", merkleRoot.toString('hex'));
        console.log("Timestamp:", new Date(timestamp.toNumber() * 1000).toLocaleString());

        return {
            merkleRoot: merkleRoot.toString('hex'),
            timestamp: new Date(timestamp.toNumber() * 1000),
        };
    } catch (error) {
        console.error("Error retrieving state root:", error);
        throw error;
    }
}

module.exports = { getStateRoot };
