const uuid = require('uuid');
const accountsDetails = require('./accounts.js');

class NetworkNode {
    constructor(url, chain) {
        this.nodeId = uuid.v4().split('-').join('');
        this.url = url;
        this.peers = new Map();
        this.schoolChain = chain;
    }

    getInfo() {
        return {
            about: 'SchoolChain/v1',
            id: this.nodeId,
            chainId: this.schoolChain.blocks[0].hash, // genesis block hash
            url: this.url,
            peers: this.peers.size,
            difficulty: 1,
            blocks: this.schoolChain.blocks.length,
            confirmedTxs: this.schoolChain.getConfirmedTxs().length,
            pendingTxs: this.schoolChain.pendingTxs.length
        };
    }

    debug() {
        const confirmedBalances = this.schoolChain.getConfirmedBalances();
        return ({ node: this, importantAccounts: accountsDetails, confirmedBalances });
    }

    getAllTxs() {
        const txs = this.schoolChain.getConfirmedTxs();
        txs.push(...this.schoolChain.pendingTxs);
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
                confirmations = this.schoolChain.blocks.length - tx.minedInBlock + 1;
            }

            if (tx.from === address) {
                balance.pending -= tx.fee;
                if (confirmations === 0 && !tx.success) balance.pending -= tx.amount;

                if (confirmations > 0 && tx.success) {
                    balance.confirmed -= tx.fee;
                    if (tx.success) balance.confirmed -= tx.amount;
                }

                // safe confirmation amount is 6 blocks
                if (confirmations >= 6 && tx.success) {
                    balance.safe -= tx.fee;
                    if (tx.success) balance.safe -= tx.amount;
                }
            }

            if (tx.to === address) {
                if (confirmations === 0 && !tx.success) balance.pending += tx.amount;
                if (confirmations > 0 && tx.success) balance.confirmed += tx.amount;
                // safe confirmation amount is 6 blocks
                if (confirmations >= 6 && tx.success) balance.safe += tx.amount;
            }
        });

        return balance;
    }
}

module.exports = NetworkNode;