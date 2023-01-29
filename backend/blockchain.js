const Block = require('./block.js');
const Transaction = require('./transaction.js');
const {
    faucetAddress,
    schoolChainPubKey,
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

    addPendingTx(txData) {
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

        const invalidTx = valid.txContent(tx);
        if (invalidTx) return invalidTx;

        if (allTxs.find(t => t.hash === tx.hash)) {
            return { errorMsg: `Tx ${txData.hash} already exists` };
        }

        if (!verify(tx.hash, tx.senderPubKey, tx.senderSig))
            return { errorMsg: `Signature of tx ${tx.hash} could not be verified` };

        if (balance.confirmed < tx.amount + tx.fee)
            return { errorMsg: `Insufficient funds in sender's account at address: ${tx.from}`};

        this.pendingTxs.push(tx);
        return tx;
    }

    isValidTx(tx, block) {
        // invalidTx will be undefined if tx is valid
        const invalidTx = valid.txContent(tx);
        if (invalidTx) return invalidTx;

        // check tx hash against result of tx hashing algorithm
        const txData = {
            from: tx.from,
            to: tx.to,
            amount: tx.amount,
            fee: tx.fee,
            timestamp: tx.timestamp,
            senderPubKey: tx.senderPubKey
        };
        const txDataJson = JSON.stringify(txData);
        txHash = sha256(txDataJson, 'base64');

        // RE-CALCULATE MINEDINBLOCK & SUCCESS


        if (block && (!tx.minedInBlock || !tx.success)) {
            return { errorMsg: `Tx ${tx.hash} is not confirmed as mined` };
        }

        if (block) {
            // MATCH MINEDINBLOCK & SUCCESS WITH RECALCULATIONS
        }

        if (typeof (tx.hash) !== 'string' || txHash !== tx.hash) {
            return { errorMsg: `Tx ${tx.hash} not hashed with school chain algorithm` };
        }

        // check signature validity
        if (!verify(tx.hash, tx.senderPubKey, tx.senderSig)) {
            return { errorMsg: `Signature in tx ${tx.hash} could not be verified` };
        }

        return true;
    }

    isValidBlock(newBlock, previousBlock) {
        // invalidBlock will be undefined if block is valid
        const invalidBlock = valid.blockContent(newBlock);
        if (invalidBlock) return invalidBlock;

        // validate each transaction
        for (const tx of newBlock.txs) {
            // tx will return error msg only if a validation returns false
            const errorMsg = this.isValidTx(tx, newBlock);
            if (errorMsg) return errorMsg;
        }

        // check block hash against result of block hashing algorithms
        const blockData = {
            index: newBlock.index,
            txs: newBlock.txs.map(t => Object({
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
            prevBlockHash: newBlock.prevBlockHash,
            minedBy: newBlock.minedBy
        };
        const blockDataJson = JSON.stringify(blockData);
        newBlockDataHash = sha256(blockDataJson, 'base64');

        if (previousBlock.index + 1 !== newBlock.index) {
            return { errorMsg: `block ${newBlock.index} has invalid index` };
        }

        if (previousBlock.hash !== newBlock.prevBlockHash) {
            return {
                errorMsg:
                    `Previous hash in block ${newBlock.index} doesn\'t match previous block's hash`
            };
        }

        if (newBlockHash !== newBlock.hash) {
            return { errorMsg: `block ${newBlock.index} has invalid hash` };
        }

        return true;
    }

    isValidChain() {
        if (JSON.stringify(chain[0]) !== JSON.stringify(this.getGenesisBlock())) return false;

        for (let i = 1; i < chain.length; i++) {
            if (!this.isValidBlock(chain[i], chain[i - 1])) {
                return { errorMsg: `Invalid block #${chain[i].index} being added to chain`};
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