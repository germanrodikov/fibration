const crypto = require("crypto");

function generateMerkleRoot(transactions) {
    if (transactions.length === 0) {
        throw new Error("No transactions to generate Merkle root");
    }

    // Create an array of transaction hashes
    const leaves = transactions.map(tx => crypto.createHash('sha256').update(tx).digest());

    // Generate Merkle root by hashing pairs of leaves iteratively
    while (leaves.length > 1) {
        let tempLeaves = [];
        for (let i = 0; i < leaves.length; i += 2) {
            const left = leaves[i];
            const right = i + 1 < leaves.length ? leaves[i + 1] : leaves[i];
            const hash = crypto.createHash('sha256').update(Buffer.concat([left, right])).digest();
            tempLeaves.push(hash);
        }
        leaves.length = 0;
        leaves.push(...tempLeaves);
    }

    return leaves[0].toString('hex');
}

module.exports = { generateMerkleRoot };