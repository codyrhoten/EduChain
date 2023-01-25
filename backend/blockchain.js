const keccak256 = require('js-sha3').keccak256;
const elliptic = require('elliptic');
const ec = new elliptic.ec('secp256k1');

const Block = require('./block.js');
const Transaction = require('./transaction.js');
const { 
    faucetAddress, 
    schoolChainPubKey, 
    schoolChainPrivKey,
    schoolChainAddress,
    schoolChainSignature
} = require('./accounts.js');

const mint_priv_key = 'a8e64da240619de60828750849c7c46d551bddcf1819a9b2d1d46bf7e6a0cbb6';
const mint_pub_key = 'fc1d7175e8dcf20106c54a05b30dc9447e9fda2b098730bc4db44df3f1ed925e1';
const mint_address = 'ba3fe981cda884e045e427a86f3f4975f9f698fc';

// const testAddress = '15MVCEQUSa1WRrQAGfv6sZfj1Ztkz2v9fQ';

class Blockchain {
    constructor() {
        // genesis transaction
        const initialCoinRelease = new Transaction(
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
        
        const genesisBlock = new Block(
            0,                          // index
            [initialCoinRelease],       // transactions array
            undefined,                  // previous block hash
            schoolChainAddress,         // miner
            undefined,                  // block data hash
            0,                          // nonce
            1674613252417,              // timestamp
            undefined                   // block hash
        );

        this.blocks = [genesisBlock];
        this.difficulty = 1;
        this.pendingTxs = [];
        // this.reward = 500;
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

    isValid(blockchain = this) {
        for (let i = 1; i < blockchain.chain.length; i++) {
            const currentBlock = blockchain.chain[i];
            const prevBlock = blockchain.chain[i - 1];

            if (
                currentBlock.hash !== currentBlock.getHash() ||
                currentBlock.prevHash !== prevBlock.hash ||
                currentBlock.hasValidTransactions(blockchain)
            ) {
                return false;
            }
        }

        return true;
    }
}

module.exports = Blockchain;