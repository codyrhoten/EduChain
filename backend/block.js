const crypto = require("crypto");

const SHA256 = message => {
    return crypto.createHash("sha256").update(message).digest("hex");
};

export default class Block {
    constructor(index, timeStamp, transactions) {
        this.index = index;
        this.timeStamp = timeStamp;
        this.transactions = transactions;
        this.hash = this.getHash();
        this.prevHash = "";
        this.nonce = 0;
    }

    getHash() {
        return SHA256(
            JSON.stringify(this.transactions) +
            this.timeStamp +
            this.prevHash +
            this.nonce
        );
    }

    mine(difficulty) {
        while (!this.hash.startsWith(Array(difficulty + 1).join("0"))) {
            this.nonce++;
            this.hash = this.getHash();
        }
    }

    hasValidTransactions(chain) {
        return this.transactions.every((transaction) =>
            transaction.isValid(transaction, chain)
        );
    }
}