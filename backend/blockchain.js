const Block = require('./block.js');
const Transaction = require('./transaction.js');
const {
    faucetAddress,
    schoolChainPubKey,
    schoolChainPrivKey,
    schoolChainAddress,
    schoolChainSignature
} = require('./accounts.js');
const { error } = require('./error.js');
const { verify } = require('./cryptography.js');
const valid = require('./validation.js');

class Blockchain {
    constructor() {
        this.blocks = [this.getGenesisBlock()];
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

    getAllTxs() {
        const txs = this.getConfirmedTxs();
        txs.push(...this.pendingTxs);
        return txs;
    }

    getTxHistory(address) {
        const txs = this.getAllTxs();
        let addressTxs = [];
        txs.forEach(tx => { if (tx.to === address || tx.from === address) addressTxs.push(tx) });
        return addressTxs;
    }

    getBalance(address) {
        const txs = this.getTxHistory(address);
        let balance = { safe: 0, confirmed: 0, pending: 0 };

        txs.forEach(tx => {
            let confirmations = 0;

            if (typeof (tx.minedInBlock) === 'number') {
                confirmations = this.blocks.length - tx.minedInBlock + 1;
            }

            if (tx.from === address) {
                if (confirmations > 0 && tx.success) {
                    balance.confirmed -= tx.fee;
                    if (tx.success) balance.confirmed -= tx.amount;
                }
                
                // safe confirmation amount is 6 blocks
                if (confirmations >= 6 && tx.success) {
                    balance.safe -= tx.fee;
                    if (tx.success) balance.safe -= tx.amount;
                }

                balance.pending = balance.safe - tx.fee;
                if (confirmations === 0 && !tx.success) balance.pending -= tx.amount;
            }

            if (tx.to === address) {
                if (confirmations === 0 && !tx.success) balance.pending = balance.safe + tx.amount;
                if (confirmations > 0 && tx.success) balance.confirmed += tx.amount;
                // safe confirmation amount is 6 blocks
                if (confirmations >= 6 && tx.success) balance.safe += tx.amount;
            }
        });

        return balance;
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

    addPendingTx(txData, next) {
        try {
            const allTxs = this.getAllTxs();
            const balance = this.getBalance(txData.from);
            const tx = new Transaction(
                txData.from,
                txData.to,
                txData.amount,
                txData.fee,
                txData.timestamp,
                txData.senderPubKey,
                undefined,
                txData.senderSig
            );

            valid.txContent(tx);

            if (allTxs.find(t => t.hash === tx.hash)) {
                const error = new Error(`Tx ${txData.hash} already exists`);
                error.statusCode = 409;
                throw error;
            }

            if (!verify(tx.hash, tx.senderPubKey, tx.senderSig))
                error(`Signature of tx ${tx.hash} could not be verified`);

            if (balance.confirmed < tx.amount + tx.fee)
                error(`Insufficient funds in sender's account at address: ${tx.from}`);

            this.pendingTxs.push(tx);
            return tx;
        } catch (err) {
            if (!err.statusCode) err.statusCode = 500;
            next(err);
        }
    }

    isValid() {
        if (JSON.stringify(chain[0]) !== JSON.stringify(this.getGenesisBlock())) return false;

        for (let i = 1; i < chain.length; i++) {
            if (!this.isValidBlock(chain[i], chain[i - 1])) {
                console.log('Invalid block being added to chain');
                return false;
            }
        }

        return true;
    }


    /* getLastBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(block) {
        const lastBlockTimestamp = parseInt(this.getLastBlock().timeStamp);
        block.prevHash = this.getLastBlock().hash;
        block.hash = block.getHash();
        block.mine(this.difficulty);
        this.chain.push(block);
        this.difficulty += Date.now() - lastBlockTimestamp < this.blockTime ? 1 : -1;
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
    } */
}

module.exports = Blockchain;