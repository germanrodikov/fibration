const fs = require('fs');
const path = require('path');
const { Client, ConsensusMessageSubmitTransaction, Hbar } = require("@hashgraph/sdk");
const Web3 = require("web3");
require('dotenv').config();

// Load JSON configuration file
const configPath = path.join(__dirname, 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

const web3 = new Web3(process.env.INFURA_URL);
const contractAddress = process.env.CONTRACT_ADDRESS;

// Load contract ABI from config file
const contractABI = config.contractABI;

const client = Client.forTestnet().setOperator(process.env.ACCOUNT_ID, process.env.PRIVATE_KEY);

const contract = new web3.eth.Contract(contractABI, contractAddress);

contract.events.StateTransitionLogged({
    fromBlock: 0
}, async (error, event) => {
    if (error) {
        console.error(error);
        return;
    }

    const stateHash = event.returnValues.stateHash;
    const timestamp = event.returnValues.timestamp;

    const tx = new ConsensusMessageSubmitTransaction()
        .setTopicId(process.env.HCS_TOPIC_ID)
        .setMessage(JSON.stringify({ stateHash, timestamp }))
        .setMaxTransactionFee(new Hbar(2));

    try {
        const response = await tx.execute(client);
        console.log("State logged on Hedera with transaction ID:", response.transactionId.toString());
    } catch (err) {
        console.error("Failed to log state on Hedera:", err);
    }
});
