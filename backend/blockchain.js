const keccak256 = require('js-sha3').keccak256;
const elliptic = require('elliptic');
const ec = new elliptic.ec('secp256k1');

import Block from 'block.js';
import Transaction from './transaction.js';
import { fAddress } from './faucet.js';

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
            Date.now().toString(),
            [initialCoinRelease]
        );

        this.chain = [genesisBlock];
        this.difficulty = 1;
        this.blockTime = 30000;
        this.transaction = [];
        this.reward = 500;
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }

    getBalance(address) {
        let balance = 0;

        this.chain.forEach(block => {
            block.transactions.forEach(transaction => {
                if (transaction.to === address) {
                    balance += transaction.amount;
                }

                if (transaction.from === address) {
                    balance -= transaction.amount;
                    balance -= transaction.gas;
                }
            });
        });

        return balance;
    }

    addBlock(block) {
        const lastBlockTimestamp = parseInt(this.getLastBlock().timeStamp);
        block.prevHash = this.getLastBlock().hash;
        block.hash = block.getHash();
        block.mine(this.difficulty);
        this.chain.push(block);
        this.difficulty +=
            Date.now() - lastBlockTimestamp < this.blockTime ? 1 : -1;
    }

    addTransaction(transaction) {
        if (transaction.isValid(transaction, this)) {
            this.transaction.push(transaction);
        }

        console.log(transaction);
    }

    miningTransaction(rewardAddress) {
        let block = {};
        let gas = 0;

        this.transaction.forEach((transaction) => {
            gas += transaction.gas;
        });

        const rewardTransaction = new Transaction(
            mintAddress,
            rewardAddress,
            this.reward + gas
        );

        rewardTransaction.sign(mint_priv_key);

        if (this.transaction.length !== 0) {
            block = new Block(
                Date.now().toString(),
                [rewardTransaction, ...this.transaction]
            );

            this.addBlock(block);
        }

        this.transaction = [];
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

module.exports = { Blockchain, mint_key_pair, mint_pub_key };