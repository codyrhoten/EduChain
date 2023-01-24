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
        this.nonce = nonce;
        this.timeStamp = timeStamp;
        this.hash = hash;
    }

    getDataHash() {
        return SHA256(
            JSON.stringify({
                index: this.index,
                txs: this.txs,
                prevBlockHash: this.prevBlockHash,
                minedBy: this.minedBy
            }),
            'base64'
        );
    }

    getHash() {

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