const fs = require("fs");
const path = require("path");

const transactionsFilePath = path.join(__dirname, "../../data/transactions.json");

function loadTransactions() {
    const data = fs.readFileSync(transactionsFilePath);
    return JSON.parse(data).transactions;
}

function saveTransaction(transaction) {
    const transactions = loadTransactions();
    transactions.push(transaction);
    fs.writeFileSync(transactionsFilePath, JSON.stringify({ transactions }, null, 2));
}

function clearTransactions() {
    fs.writeFileSync(transactionsFilePath, JSON.stringify({ transactions: [] }, null, 2));
    console.log("Transactions cleared.");
}

module.exports = {
    loadTransactions,
    saveTransaction,
    clearTransactions, 
};
