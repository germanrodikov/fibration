const { commitState } = require("./commitState");
const { generateMerkleRoot } = require("./merkleService");
const { loadTransactions, clearTransactions } = require("./transactionService"); // Correctly import clearTransactions

let currentBatchId = 0;

async function processBatch(contractId) {
    try {
        const transactions = loadTransactions();
        if (transactions.length === 0) {
            console.log("No transactions to process.");
            return;
        }

        // Generate the Merkle Root from the transactions
        const merkleRoot = generateMerkleRoot(transactions);
        console.log(`Generated Merkle Root for batch ${currentBatchId}:`, merkleRoot);

        // Commit the Merkle Root to the smart contract
        await commitState(contractId, Buffer.from(merkleRoot, 'hex'));
        console.log(`Batch ${currentBatchId} processed and state committed successfully.`);

        // Increment the batch ID for the next batch
        currentBatchId++;

        // Clear the transactions after committing the batch
        clearTransactions(); // This should now be recognized
    } catch (error) {
        console.error("Error processing batch:", error);
    }
}

module.exports = { processBatch };
