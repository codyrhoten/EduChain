const Block = require('./block.js');
const Transaction = require('./transaction.js');
const {
    faucetAddress,
    schoolChainPubKey,
    schoolChainAddress,
    schoolChainSignature
} = require('./accounts.js');
const { verify } = require('./cryptography.js');
const valid = require('./validation.js');

class Blockchain {
    constructor() {
        this.blocks = [this.getGenesisBlock()];
        this.difficulty = 3;
        this.pendingTxs = [];
        this.miningJobs = new Map();
        this.reward = 500;
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

        const genesisBlock = new Block(
            0,                          // index
            [genesisTx],                // transactions array
            undefined,                  // previous block hash
            schoolChainAddress,         // miner
            undefined,                  // block data hash
            0,                          // nonce
            1674613252417,              // timestamp
        );

        genesisBlock.getHash();
        return genesisBlock;
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

    getMiningJob(minerAddress) {
        const nextBlockIndex = this.blocks.length;

        let pendingTxs = this.pendingTxs;
        pendingTxs = txs.sort((a, b) => b.fee - a.fee);

        // create transaction for mining this block
        let rewardTx = new Transaction(
            schoolChainAddress,         // from
            minerAddress,               // to
            this.reward,    // amount
            0,                          // fee
            new Date(),                 // timestamp
            schoolChainPubKey,          // sender public key
            undefined,                  // hash
            schoolChainSignature,       // sender signature
            nextBlockIndex,             // block this was mined in
            true                        // success?
        );

        let balances = this.getConfirmedBalances();

        pendingTxs.forEach(tx => {
            balances[tx.from] = balances[tx.from] || 0;
            balances[tx.to] = balances[tx.to] || 0;

            if (balances[tx.from] >= tx.fee) {
                tx.minedInBlock = nextBlockIndex;
                balances[tx.from] -= tx.fee;
                rewardTx.amount += tx.fee;

                if (balances[tx.from] >= tx.amount) {
                    balances[tx.from] -= tx.amount;
                    balances[tx.to] += tx.amount;
                    tx.success = true;
                } else {
                    tx.success = false;
                }
            } else {
                const confirmedTxHashes = this.getConfirmedTxs().map(tx => tx.hash);

                this.pendingTxs = this.pendingTxs.filter(t => {
                    t.hash !== confirmedTxHashes.includes(t.hash);
                });

                pendingTxs = pendingTxs.filter(t => t !== tx);
            }
        });

        rewardTx.getHash();
        pendingTxs.unshift(rewardTx);
        const prevBlockHash = this.blocks[this.blocks.length - 1].hash;

        const nextBlockCandidate = new Block(
            nextBlockIndex,            // index
            pendingTxs,                // txs
            prevBlockHash,             // previous block's hash
            minerAddress               // miner of this block
        );

        this.miningJobs.set(nextBlockCandidate.dataHash) = nextBlockCandidate;
        return nextBlockCandidate;
    }

    mineBlock(blockDataHash, blockHash) {
        let newBlock = this.miningJobs.get(blockDataHash);
        const prevBlock = this.blocks[this.blocks.length - 1];
        const confirmedTxHashes = this.getConfirmedTxs().map(tx => tx.hash);

        newBlock.nonce = 0;
        
        while (!newBlock.hash.startsWith(Array(this.difficulty).join("0"))) {
            newBlock.nonce++;
            newBlock.timestamp = new Date();
            newBlock.getHash();
        }

        if (newBlock === undefined) return { errorMsg: 'Block not found or already mined' };

        if (newBlock.hash !== blockHash)
            return { errorMsg: 'Block hash wasn\'t calculated correctly' };

        if (!newBlock.hash.startsWith(Array(this.difficulty).join("0")))
            return { errorMsg: 'Block hash does not correspond to blockchain difficulty' };

        if (newBlock.index !== this.blocks.length)
            return { errorMsg: 'Submitted block was already mined by someone else' };

        if (prevBlock.hash !== newBlock.prevBlockHash)
            return { errorMsg: 'Incorrect previous block hash' };

        this.blocks.push(newBlock);
        this.miningJobs = this.miningJobs.clear();

        this.pendingTxs = this.pendingTxs.filter(t => {
            t.hash !== confirmedTxHashes.includes(t.hash);
        });

        return newBlock;
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
        if (JSON.stringify(this.blocks[0]) !== JSON.stringify(this.getGenesisBlock())) return false;

        for (let i = 1; i < this.blocks.length; i++) {
            if (!this.isValidBlock(this.blocks[i], this.blocks[i - 1])) {
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
    } */
}

module.exports = Blockchain;