const { sha256 } = require('./cryptography.js');
const { error } = require('./error.js');
const valid = require('./validation.js');

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
        if (typeof newBlock.index || typeof newBlock.nonce !== 'number')
            error(`Block ${newBlock.index} has invalid index or nonce data type in block`);
        if (!Array.isArray(newBlock.txs)) 
            error(`Block ${newBlock.index} txs are incorrect data type`);
        if (!valid.hash(newBlock.prevBlockHash)) 
            error(`Block ${newBlock.index} has invalid previous block hash format`);
        if (!valid.address(this.minedBy)) 
            error(`Block ${newBlock.index}'s miner address is invalid`);
        if (!valid.hash(newBlock.dataHash)) 
            error(`Block ${newBlock.index} has invalid data hash format`);
        if (!valid.hash(newBlock.hash))
            error(`Block ${newBlock.index} has invalid block hash format`);
        if (!valid.timestamp(newBlock.timeStamp)) 
            error(`Block ${newBlock.index} has invalid timestamp`);

        try {
            // validate each transaction
            newBlock.txs.forEach(tx => tx.isValid(newBlock));

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
                error(`block ${newBlock.index} has invalid index`);
            }

            if (previousBlock.hash !== newBlock.prevBlockHash) {
                error(
                    `block ${newBlock.index}'s previous hash doesn\'t match previous block's hash`
                );
            }

            if (newBlockHash !== newBlock.hash) {
                error(`block ${newBlock.index} has invalid hash`);
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
}

module.exports = Block;