// const { processBatch } = require("./src/services/batchProcessor");
// const { saveTransaction } = require("./src/services/transactionService");
// const { getStateRoot } = require("./src/services/getStateRoot");
// const { handleExecutionEnvironment } = require("./src/services/executionEnvironment");
// const { createClient } = require("./src/config/client");
// const { ContractCreateFlow } = require("@hashgraph/sdk");
// const fs = require("fs");

// async function main() {
//     const client = createClient();

//     // Deploy the contract
//     let contractId;
//     try {
//         console.log("Deploying the contract...");

//         const contractBytecode = fs.readFileSync("Fibration_sol_Fibration.bin");
//         const contractInstantiateTx = new ContractCreateFlow()
//             .setBytecode(contractBytecode)
//             .setGas(200000);

//         const contractInstantiateSubmit = await contractInstantiateTx.execute(client);
//         const contractInstantiateRx = await contractInstantiateSubmit.getReceipt(client);
//         contractId = contractInstantiateRx.contractId;

//         console.log(`- The smart contract ID is: ${contractId}`);
//         console.log(`- The smart contract ID in Solidity format is: ${contractId.toSolidityAddress()}`);
//     } catch (error) {
//         console.error("Error during contract deployment:", error);
//         return;
//     }

//     // Function to simulate transaction generation
//     function generateTransactions() {
//         const transactionData = `Transaction data ${new Date().toISOString()}`;
//         saveTransaction(transactionData);
//         console.log(`Generated and saved transaction: ${transactionData}`);
//     }

//     // Set an interval to generate transactions every few seconds
//     setInterval(generateTransactions, 5000); // Generate a transaction every 5 second

//     // Set an interval to process the batch every 20 seconds
//     setInterval(async () => {
//         console.log("\nProcessing batch...");
//         await processBatch(contractId);

//         console.log("Verifying committed state...");
//         const batchId = 0; // Adjust this based on how you want to handle batch IDs
//         const stateData = await getStateRoot(contractId, batchId);

//         // Interact with the execution environment after state update
//         await handleExecutionEnvironment({
//             contractId: contractId,
//             additionalData: Buffer.from(stateData.merkleRoot, 'hex'),
//         });

//     }, 20000); // Process batch and verify every 5 seconds
// }

// main().catch(console.error);
const { processBatch } = require("./src/services/batchProcessor");
const { saveTransaction } = require("./src/services/transactionService");
const { getStateRoot } = require("./src/services/getStateRoot");
const { handleExecutionEnvironment } = require("./src/services/executionEnvironment");
const { createClient } = require("./src/config/client");
const { ContractCreateFlow } = require("@hashgraph/sdk");
const fs = require("fs");

async function main() {
    const client = createClient();

    // Deploy the contract
    let contractId;
    let batchId = 0; // Initialize batchId
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
    setInterval(generateTransactions, 1000); // Generate a transaction every 1 second

    // Set an interval to process the batch every 5 seconds
    setInterval(async () => {
        console.log("\nProcessing batch...");
        await processBatch(contractId);

        console.log("Verifying committed state...");
        const stateData = await getStateRoot(contractId, batchId);

        // Interact with the execution environment after state update
        await handleExecutionEnvironment({
            contractId: contractId,
            additionalData: Buffer.from(stateData.merkleRoot, 'hex'), // Assuming the Merkle root is part of stateData
        });

        // Increment the batchId for the next batch
        batchId++;

    }, 5000); // Process batch and verify every 5 seconds
}

main().catch(console.error);
