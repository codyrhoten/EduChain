const Block = require('./block.js');
const Transaction = require('./transaction.js');
const {
    faucetAddress,
    eduChainPubKey,
    eduChainAddress,
    eduChainSignature
} = require('./accounts.js');
const { verify } = require('./cryptography.js');
const valid = require('./validation.js');
// import crypto from 'crypto-js';
// import elliptic from 'elliptic';

// const ec = new elliptic.ec('secp256k1');

class Blockchain {
    constructor() {
        this.blocks = [this.getGenesisBlock()];
        this.difficulty = 3;
        this.pendingTxs = [];
        this.miningJobs = {};
        this.reward = 5000000;
    }

    getGenesisBlock() {
        const genesisTx = new Transaction(
            eduChainAddress,         // from
            faucetAddress,              // to
            1000000000,                 // amount
            0,                          // fee
            1674613252417,              // timestamp
            eduChainPubKey,          // sender public key
            undefined,                  // hash
            eduChainSignature,       // sender signature
            0,                          // block this was mined in
            true                        // success?
        );

        const genesisBlock = new Block(
            0,                          // index
            [genesisTx],                // transactions array
            undefined,                  // previous block hash
            eduChainAddress,         // miner
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
                if (confirmations > 0) {
                    balance.confirmed -= tx.fee;

                    if (tx.success) {
                        balance.confirmed -= tx.amount;
                    }
                }

                // safe confirmation amount is 3 blocks
                if (confirmations >= 3) {
                    balance.safe -= tx.fee;

                    if (tx.success) {
                        balance.safe -= tx.amount;
                    }
                }

                if (!tx.success) {
                    balance.pending -= (tx.fee + tx.amount);
                }
            }

            if (tx.to === address) {
                if (!tx.success) {
                    balance.pending += tx.amount;
                }

                if (confirmations > 0 && tx.success) {
                    balance.confirmed += tx.amount;
                }

                // safe confirmation amount is 3 blocks
                if (confirmations >= 3 && tx.success) {
                    balance.safe += tx.amount;
                }
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

        if (!verify(tx.hash, tx.senderPubKey, tx.senderSig)) {
            return { errorMsg: `Signature of tx ${tx.hash} could not be verified` };
        }

        if (balance.confirmed < tx.amount + tx.fee) {
            return { errorMsg: `Insufficient funds in sender's account at address: ${tx.from}`};
        }

        this.pendingTxs.push(tx);
        return tx;
    }

    getMiningJob(minerAddress) {
        const nextBlockIndex = this.blocks.length;

        let pendingTxs = this.pendingTxs;
        pendingTxs = pendingTxs.sort((a, b) => b.fee - a.fee);

        // create transaction for mining this block
        let rewardTx = new Transaction(
            eduChainAddress,         // from
            minerAddress,               // to
            this.reward,                // amount
            0,                          // fee
            Date.now(),                 // timestamp
            eduChainPubKey,          // sender public key
            undefined,                  // hash
            eduChainSignature,       // sender signature
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

        this.miningJobs[nextBlockCandidate.dataHash] = nextBlockCandidate;
        return nextBlockCandidate;
    }

    mineBlock(minerAddress) {
        let newBlock = this.getMiningJob(minerAddress);
        const prevBlock = this.blocks[this.blocks.length - 1];
        const confirmedTxHashes = this.getConfirmedTxs().map(tx => tx.hash);

        newBlock.nonce = 0;
        newBlock.getHash();
        
        while (!newBlock.hash.startsWith(Array(this.difficulty + 1).join("0"))) {
            newBlock.nonce++;
            newBlock.timestamp = Date.now();
            newBlock.getHash();
        }

        if (newBlock === undefined) return { errorMsg: 'Block not found or already mined' };

        if (!newBlock.hash.startsWith(Array(this.difficulty).join("0")))
            return { errorMsg: 'Block hash does not correspond to blockchain difficulty' };

        if (newBlock.index !== this.blocks.length)
            return { errorMsg: 'Submitted block was already mined by someone else' };

        if (prevBlock.hash !== newBlock.prevBlockHash)
            return { errorMsg: 'Incorrect previous block hash' };

        this.blocks.push(newBlock);
        this.miningJobs = {};

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

        if (block && (!tx.minedInBlock || !tx.success)) {
            return { errorMsg: `Tx ${tx.hash} is not confirmed as mined` };
        }

        if (typeof (tx.hash) !== 'string' || txHash !== tx.hash) {
            return { errorMsg: `Tx ${tx.hash} not hashed with edu chain algorithm` };
        }

        // check signature validity
            // console.log(txHash, senderPubKey, sig);
            // let pubKeyX = senderPubKey.substring(0, 63);
            // let pubKeyYOdd = parseInt(senderPubKey.substring(63));
            // const decompressedPubKey = ec.curve.pointFromX(pubKeyX, pubKeyYOdd);
            // const keyPair = ec.keyPair({ pub: decompressedPubKey });
            // const valid = keyPair.verify(txHash, { r: sig[0], s: sig[1] });
            // console.log(valid)

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
        if (JSON.stringify(this.blocks[0]) !== JSON.stringify(this.getGenesisBlock())) 
            return { errorMsg: 'Genesis blocks do not match'};

        for (let i = 1; i < this.blocks.length; i++) {
            const validBlock = this.isValidBlock(this.blocks[i], this.blocks[i - 1]);

            if (validBlock.errorMsg) {
                return { errorMsg: validBlock.errorMsg};
            }
        }

        return true;
    }
}

module.exports = Blockchain;