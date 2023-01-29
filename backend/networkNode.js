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

    async notifyPeersOfBlock() {
        const notification = {
            blocks: this.schoolChain.blocks.length,
            URL: this.url
        };

        this.peers.forEach(url => {
            axios.post(`${url}/peers/new-block`, notification);
        });
    }

    async syncChain(peerInfo, next) {
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

    async syncPendingTxs(peerInfo, next) {
        try {
            if (peerInfo.pendingTxs > 0) {
                const pendingTxs = await axios.get(`${peerInfo.url}/pending-txs`);
                pendingTxs.data.forEach(pt => {
                    const validTx = '';
                });
            }
        } catch (err) {
            console.log('Could not load pending transactions: ' + err);
        }
    }
}

module.exports = NetworkNode;