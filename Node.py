from hedera import (
    Client,
    ConsensusMessageSubmitTransaction,
    Hbar,
    TopicMessageQuery
)
import time
import os
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

# Initialize the Hedera client with credentials from environment variables
client = Client.for_testnet()
client.set_operator(os.getenv("ACCOUNT_ID"), os.getenv("PRIVATE_KEY"))

# Topic in HCS, where we are going to send the message
topic_id = os.getenv("HCS_TOPIC_ID")

# Data to write
state_hash = "0x123abc0x123abc0x123abc"  # Replace with your actual state hash
timestamp = int(time.time())  
data = "FIBTATION state data" 

message = f"State Hash: {state_hash}, Timestamp: {timestamp}, Data: {data}"

# Send message to Hedera Consensus Service
transaction = ConsensusMessageSubmitTransaction(
    topic_id=topic_id,
    message=message
).set_max_transaction_fee(Hbar(2))

response = transaction.execute(client)
print(f"State logged on Hedera with transaction ID: {response.transaction_id}")
