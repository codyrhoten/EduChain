const crypto = require("crypto");

const SHA256 = message => {
    return crypto.createHash("sha256").update(message).digest("hex");
};

class Block {
    constructor(index, transactions, prevBlockHash, minedBy, dataHash, nonce, timeStamp, hash) {
        this.index = index;
        this.txs = transactions;
        this.prevBlockHash = prevBlockHash;
        this.minedBy = minedBy;
        this.dataHash = dataHash;

        if (this.dataHash === undefined) this.getDataHash();

        this.nonce = nonce;
        this.timeStamp = timeStamp;
        this.hash = hash;

        if (this.hash === undefined) this.getHash();
    }

    getDataHash() {
        const txs = JSON.stringify(this.txs);
        const dataString = String(this.index) + txs + this.prevBlockHash + this.minedBy;
        this.dataHash = SHA256(dataString, 'base64');
    }

    getHash() {
        const dataString = this.dataHash + String(this.nonce) + String(this.timestamp);
        this.hash = SHA256(dataString, 'base64');
    }

    mine(difficulty) {
        while (!this.hash.startsWith(Array(difficulty + 1).join("0"))) {
            this.nonce++;
            this.hash = this.getHash();
        }
    }

    hasValidTransactions(chain) {
        return this.txs.every((transaction) =>
            transaction.isValid(transaction, chain)
        );
    }
}

module.exports = Block;