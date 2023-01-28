const uuid = require('uuid');
const accountsDetails = require('./accounts.js');
const { error } = require('./error.js');

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

    async notifyPeersOfBlock() {
        const notification = {
            blocks: this.schoolChain.blocks.length,
            URL: this.url
        };

        this.peers.forEach(url => {
            axios.post(`${url}/peers/new-block`, notification);
        });
    }

    async syncChain(peerInfo) {
        try {
            if (peerInfo.chainId !== this.schoolChain.blocks[0].hash) {
                error('Peers should have the same chain ID');
            }

            const peerBlocks = await axios.get(`${peerInfo.url}/blocks`);

            if (this.schoolChain.isValid(peerBlocks)) {
                // INVALIDATE ALL MINING JOBS

                let confirmedTxHashes = this.schoolChain.getConfirmedTxs().map(tx => tx.hash);

                peerInfo.pendingTxs = peerInfo.pendingTxs.filter(t => {
                    t.hash !== confirmedTxHashes.includes(t.hash)
                });

                if (peerBlocks.length > this.schoolChain.blocks.length) {
                    this.schoolChain.blocks = peerBlocks;
                    this.notifyPeersOfBlock();
                }
            }
        } catch (err) {
            console.log('Could not load chain: ' + err);
            next(err);
        }
    }

    async syncPendingTxs(peerInfo) {
        try {
            if (peerInfo.pendingTxs > 0) {
                const txs = await axios.get(`${peerInfo.url}/all-txs`);
                const pendingTxs = txs.data.filter(tx => !tx.success);
                pendingTxs.forEach(pt => {

                });
            }
        } catch (err) {
            console.log('Could not load pending transactions: ' + err);
        }
    }
}

module.exports = NetworkNode;