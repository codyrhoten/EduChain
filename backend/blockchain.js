const keccak256 = require('js-sha3').keccak256;
const crypto = require("crypto");
const Block = require('./block.js');
const Transaction = require('./transaction.js');
const { 
    faucetAddress, 
    schoolChainPubKey, 
    schoolChainPrivKey,
    schoolChainAddress,
    schoolChainSignature
} = require('./accounts.js');

function SHA256(message) {
    return crypto.createHash("sha256").update(message).digest("hex");
};

class Blockchain {
    constructor() {
        this.blocks = [getGenesisBlock()];
        this.difficulty = 1;
        this.pendingTxs = [];
        // this.reward = 500;
    }

    getGenesisBlock() {
        const genesisTx = new Transaction(
            schoolChainAddress,         // from
            faucetAddress,              // to
            100000,                     // amount
            0,                          // fee
            1674613252417,              // timestamp
            schoolChainPubKey,          // sender public key
            undefined,                  // hash
            schoolChainSignature,       // sender signature
            0,                          // block this was mined in
            true                        // success?
        );

        return new Block(
            0,                          // index
            [genesisTx],                // transactions array
            undefined,                  // previous block hash
            schoolChainAddress,         // miner
            undefined,                  // block data hash
            0,                          // nonce
            1674613252417,              // timestamp
            undefined                   // block hash
        );
    }

    getConfirmedTxs() {
        let txs = [];
        this.blocks.forEach(block => txs.push(...block.txs));
        return txs;
    }

    getConfirmedBalances() {
        const txs = this.getConfirmedTxs();
        let balances = {};

        txs.forEach(tx => {
            balances[tx.from] = balances[tx.from] || 0;
            balances[tx.to] = balances[tx.to] || 0;
            balances[tx.from] -= tx.fee;

            if (tx.success) {
                balances[tx.from] -= tx.amount;
                balances[tx.to] += tx.amount;
            }
        });

        return balances;
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }

    getBalance(address) {
        let addressTxs = [];

        this.chain.forEach(b => {
            b.transactions.forEach(tx => {
                if (tx.to === address || tx.from === address) addressTxs.push(tx);
            });
        });

        let balance = 0;

        addressTxs.forEach(tx => {
            if (tx.to === address) {
                balance += Number(tx.amount);
            } else if (tx.from === address) {
                balance -= Number(tx.amount);
            }
        });

        return { txs: addressTxs, balance };
    }

    addBlock(block) {
        const lastBlockTimestamp = parseInt(this.getLastBlock().timeStamp);
        block.prevHash = this.getLastBlock().hash;
        block.hash = block.getHash();
        block.mine(this.difficulty);
        this.chain.push(block);
        this.difficulty += Date.now() - lastBlockTimestamp < this.blockTime ? 1 : -1;
    }

    addPendingTx(tx) {
        if (tx.isValid(tx, this)) {
            this.pendingTxs.push(tx);
        }

        console.log(tx);
    }

    miningTransaction(rewardAddress) {
        let block = {};
        let fee = 0;

        this.pendingTxs.forEach(tx => fee += tx.fee);

        const rewardTransaction = new Transaction(
            mintAddress,
            rewardAddress,
            this.reward + fee
        );

        rewardTransaction.sign(schoolChainPrivKey);

        if (this.pendingTxs.length !== 0) {
            block = new Block(Date.now().toString(), [rewardTransaction, ...this.pendingTxs]);
            this.addBlock(block);
        }

        this.pendingTxs = [];
    }

    isValidTx(txData) {
        
    }

    isValidBlock(newBlock, previousBlock) {
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

        // check block hash against result of block hashing algorithms
        const txs = JSON.stringify(newBlock.txs);   // array of transactions
        const newBlockDataString = String(newBlock.index) + txs + newBlock.prevBlockHash + newBlock.minedBy;
        const newBlockDataHash = SHA256(newBlockDataString, 'base64');
        const newBlockDataString2 = newBlockDataHash + String(newBlock.nonce) + String(newBlock.timestamp);
        const newBlockHash = SHA256(newBlockDataString2, 'base64');

        if (
            previousBlock.index + 1 !== newBlock.index ||
            previousBlock.hash !== newBlock.prevBlockHash ||
            newBlockHash !== newBlock.hash
        ) {
            console.log('Invalid hashes or index');
            return false;   
        }

        return true;
    }

    isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(this.getGenesisBlock())) return false;

        for (let i = 1; i < chain.length; i++) {
            if (!this.isValidBlock(chain[i], chain[i -1])) {
                console.log('Invalid block being added to chain');
                return false;
            }
        }

        return true;
    }
}

module.exports = Blockchain;