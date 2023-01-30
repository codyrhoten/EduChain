const { sha256 } = require('./cryptography.js');

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
    }

    getDataHash() {
        const blockData = {
            index: this.index,
            txs: this.txs.map(t => Object({
                from: t.from,
                to: t.to,
                amount: t.amount,
                fee: t.fee,
                timestamp: t.timestamp,
                senderPubKey: t.senderPubKey,
                hash: t.hash,
                senderSig: t.senderSig,
                minedInBlock: t.minedInBlock,
                success: t.success
            })),
            prevBlockHash: this.prevBlockHash,
            minedBy: this.minedBy
        };
        const blockDataJson = JSON.stringify(blockData);
        this.dataHash = sha256(blockDataJson, 'base64');
    }

    getHash() {
        const dataString = `${this.dataHash}|${String(this.timestamp)}|${String(this.nonce)}`;
        this.hash = sha256(dataString, 'base64');
    }


    /* mine(difficulty) {
        while (!this.hash.startsWith(Array(difficulty + 1).join("0"))) {
            this.nonce++;
            this.hash = this.getHash();
        }
    } */
}

module.exports = Block;