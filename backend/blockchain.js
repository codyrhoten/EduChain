const keccak256 = require('js-sha3').keccak256;
const elliptic = require('elliptic');
const ec = new elliptic.ec('secp256k1');

const Block = require('./block.js');
const Transaction = require('./transaction.js');
const { fAddress } = require('./faucet.js');

const mint_key_pair = ec.genKeyPair();
const mint_priv_key = mint_key_pair.getPrivate('hex');
const mint_pub_key = mint_key_pair.getPublic('hex');
const hashOfMintPubKey = keccak256(Buffer.from(mint_pub_key, 'hex'));
const mintAddress = hashOfMintPubKey.slice(-40).toString('hex');
// const testAddress = '15MVCEQUSa1WRrQAGfv6sZfj1Ztkz2v9fQ';

class Blockchain {
    constructor() {
        const initialCoinRelease = new Transaction(
            mintAddress,
            fAddress,
            100000
        );

        const genesisBlock = new Block(
            0,                     // index
            Date.now().toString(), // timestamp
            [initialCoinRelease]   // txs array
        );

        this.blocks = [genesisBlock];
        this.difficulty = 1;
        this.blockTime = 30000;
        this.pendingTxs = [];
        // this.reward = 500;
    }

    getConfirmedTxs() {
        let txs = [];
        this.blocks.forEach(block => txs.push(...block.txs));
        return txs;
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }

    getBlock(index) {
        this.chain.find(block => block.index)
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
        let gas = 0;

        this.pendingTxs.forEach(tx => gas += tx.gas);

        const rewardTransaction = new Transaction(
            mintAddress,
            rewardAddress,
            this.reward + gas
        );

        rewardTransaction.sign(mint_priv_key);

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