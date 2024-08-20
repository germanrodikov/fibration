const { ContractExecuteTransaction, ContractFunctionParameters } = require("@hashgraph/sdk");
const { createClient } = require("../config/client");

async function handleExecutionEnvironment(stateData) {
    // Interaction example: Triggering additional smart contract logic
    console.log("Interacting with execution environment using state:", stateData);

    // Assume stateData contains the necessary information to trigger further actions
    const client = createClient();
    const contractId = stateData.contractId; // The contract ID that needs to be interacted with
    const additionalData = stateData.additionalData; // Hypothetical additional data required for interaction

    try {
        // Execute a smart contract function based on the new state
        const contractExecuteTx = new ContractExecuteTransaction()
            .setContractId(contractId)
            .setGas(200000)  // Increased gas limit
            .setFunction("processNewState", new ContractFunctionParameters().addBytes32(additionalData));

        const response = await contractExecuteTx.execute(client);
        const receipt = await response.getReceipt(client);

        console.log("Execution environment interaction status:", receipt.status.toString());

    } catch (error) {
        console.error("Error during execution environment interaction:", error);
    }

    // Interaction example: Sending notifications (this could be an API call to an external service)
    sendNotification(stateData);
}

// Example of a notification function
function sendNotification(stateData) {
    console.log("Sending notification about state update:", stateData);
    // Here you can use a service to notify an external system
    //
    // const axios = require('axios');
    // axios.post('https://webhook.site/your-webhook-url', { data: stateData })
    //   .then(response => console.log('Notification sent:', response.status))
    //   .catch(error => console.error('Notification error:', error));
}

module.exports = { handleExecutionEnvironment };
