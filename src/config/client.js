require("dotenv").config();
const { AccountId, PrivateKey, Client } = require("@hashgraph/sdk");

function createClient() {
    const operatorId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
    const operatorKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

    return Client.forTestnet().setOperator(operatorId, operatorKey);
}

module.exports = { createClient };