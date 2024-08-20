// console.clear();
// require("dotenv").config();
// const {
//     AccountId,
//     PrivateKey,
//     Client,
//     ContractCreateFlow,
//     ContractFunctionParameters,
//     ContractExecuteTransaction,
//     ContractCallQuery,
// } = require("@hashgraph/sdk");
// const fs = require("fs");

// async function main() {
//     try {
//         // Configure accounts and client
//         const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
//         const operatorKey = PrivateKey.fromStringED25519(process.env.OPERATOR_PVKEY);
//         const client = Client.forTestnet().setOperator(operatorId, operatorKey);

//         console.log("Client configured with Operator ID:", operatorId.toString());

//         // Import the compiled contract bytecode
//         const contractBytecode = fs.readFileSync("Fibration_sol_Fibration.bin");
//         console.log("Contract bytecode loaded");

//         // Deploy the contract
//         let contractId, contractAddress;
//         try {
//             const contractInstantiateTx = new ContractCreateFlow()
//                 .setBytecode(contractBytecode)
//                 .setGas(200000);

//             const contractInstantiateSubmit = await contractInstantiateTx.execute(client);
//             const contractInstantiateRx = await contractInstantiateSubmit.getReceipt(client);
//             contractId = contractInstantiateRx.contractId;
//             contractAddress = contractId.toSolidityAddress();

//             console.log(`- The smart contract ID is: ${contractId}`);
//             console.log(`- The smart contract ID in Solidity format is: ${contractAddress}`);
//         } catch (error) {
//             console.error("Error during contract deployment:", error);
//             return; // Stop execution if deployment fails
//         }

//         // Commit a new Merkle root
//         const merkleRoot = "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"; // Example valid bytes32
//         console.log("Merkle root to commit:", merkleRoot);

//         const merkleRootBuffer = Buffer.from(merkleRoot, 'hex');

//         try {
//             const commitTx = new ContractExecuteTransaction()
//                 .setContractId(contractId)
//                 .setGas(100000)
//                 .setFunction("commitState", new ContractFunctionParameters().addBytes32(merkleRootBuffer));

//             const commitSubmit = await commitTx.execute(client);
//             const commitReceipt = await commitSubmit.getReceipt(client);

//             console.log(`- Commit state transaction ID: ${commitSubmit.transactionId}`);
//             console.log(`- Commit state transaction status: ${commitReceipt.status}`);
//         } catch (error) {
//             console.error("Error during state commit:", error);
//             return; // Stop execution if commit fails
//         }

//         // Retrieve the committed state
//         const batchId = 0;
//         try {
//             const getStateTx = new ContractCallQuery()
//                 .setContractId(contractId)
//                 .setGas(100000)
//                 .setFunction("getStateRoot", new ContractFunctionParameters().addUint256(batchId));

//             const getStateSubmit = await getStateTx.execute(client);
//             const returnedMerkleRootBuffer = getStateSubmit.getBytes32(0);
//             const returnedMerkleRootHex = returnedMerkleRootBuffer.toString('hex');
//             const timestamp = getStateSubmit.getUint256(1);

//             console.log(`- Retrieved Merkle Root: ${returnedMerkleRootHex}`);
//             console.log(`- Timestamp: ${new Date(timestamp.toNumber() * 1000).toLocaleString()}`);
//         } catch (error) {
//             console.error("Error during state retrieval:", error);
//             return; // Stop execution if retrieval fails
//         }
//     } catch (error) {
//         console.error("Unexpected error:", error);
//     }
// }

// main();
// index.js
const { processBatch } = require("./src/services/batchProcessor");
const { saveTransaction } = require("./src/services/transactionService");
const { getStateRoot } = require("./src/services/getStateRoot");
const { createClient } = require("./src/config/client");
const { ContractCreateFlow } = require("@hashgraph/sdk");
const fs = require("fs");

async function main() {
    const client = createClient();

    // Deploy the contract
    let contractId;
    try {
        console.log("Deploying the contract...");

        const contractBytecode = fs.readFileSync("Fibration_sol_Fibration.bin");
        const contractInstantiateTx = new ContractCreateFlow()
            .setBytecode(contractBytecode)
            .setGas(200000);

        const contractInstantiateSubmit = await contractInstantiateTx.execute(client);
        const contractInstantiateRx = await contractInstantiateSubmit.getReceipt(client);
        contractId = contractInstantiateRx.contractId;

        console.log(`- The smart contract ID is: ${contractId}`);
        console.log(`- The smart contract ID in Solidity format is: ${contractId.toSolidityAddress()}`);
    } catch (error) {
        console.error("Error during contract deployment:", error);
        return;
    }

    // Function to simulate transaction generation
    function generateTransactions() {
        const transactionData = `Transaction data ${new Date().toISOString()}`;
        saveTransaction(transactionData);
        console.log(`Generated and saved transaction: ${transactionData}`);
    }

    // Set an interval to generate transactions every few seconds
    setInterval(generateTransactions, 1000); // Generate a transaction every 1 seconds

    // Set an interval to process the batch every 5 seconds
    setInterval(async () => {
        console.log("\nProcessing batch...");
        await processBatch(contractId);

        console.log("Verifying committed state...");
        const batchId = 0; // Adjust this based on how you want to handle batch IDs
        await getStateRoot(contractId, batchId);

    }, 5000); // Process batch and verify every 5 seconds
}

main().catch(console.error);