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

        if (this.hash === undefined) this.getHash();
    }

    getDataHash() {
        const txs = JSON.stringify(this.txs);
        const dataString = String(this.index) + txs + this.prevBlockHash + this.minedBy;
        this.dataHash = sha256(dataString, 'base64');
    }

    getHash() {
        const dataString = this.dataHash + String(this.nonce) + String(this.timestamp);
        this.hash = sha256(dataString, 'base64');
    }

    isValid(newBlock, previousBlock) {
        // check block content
        if (
            typeof newBlock.index !== 'number' ||
            !Array.isArray(newBlock.txs) ||
            typeof newBlock.prevBlockHash !== 'string' ||
            typeof newBlock.minedBy !== 'string' ||
            typeof newBlock.dataHash !== 'string' ||
            typeof newBlock.nonce !== 'number' ||
            typeof newBlock.timeStamp !== 'number' ||
            typeof newBlock.hash !== 'string'
        ) {
            console.log('Invalid data type in block');
            return false;
        }

        try {
            // validate each transaction
            newBlock.txs.forEach(tx => tx.isValid());
            
            // check block hash against result of block hashing algorithms
            const newBlockDataString = (
                String(newBlock.index) +
                JSON.stringify(newBlock.txs) +
                newBlock.prevBlockHash +
                newBlock.minedBy
            );
            const newBlockDataHash = sha256(newBlockDataString, 'base64');
            const newBlockDataString2 = (
                newBlockDataHash +
                String(newBlock.nonce) +
                String(newBlock.timestamp)
            );
            const newBlockHash = sha256(newBlockDataString2, 'base64');

            if (previousBlock.index + 1 !== newBlock.index) {
                const error = new Error(`block ${newBlock.index} has invalid index`);
                error.statusCode = 400;
                throw error;
            }

            if (previousBlock.hash !== newBlock.prevBlockHash) {
                const error = new Error(`block ${newBlock.index} has invalid previous block hash`);
                error.statusCode = 400;
                throw error;
            }

            if (newBlockHash !== newBlock.hash) {
                const error = new Error(`block ${newBlock.index} has invalid hash`);
                error.statusCode = 400;
                throw error;
            }
        } catch (err) {
            if (!err.statusCode) err.statusCode = 500;
            next(err);
        }

        return true;
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