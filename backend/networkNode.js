const uuid = require('uuid');
const accountsDetails = require('./accounts.js');
const axios = require('axios');
const { error } = require('./error.js');

class NetworkNode {
    constructor(url, chain) {
        this.id = uuid.v4().split('-').join('');
        this.url = url;
        this.peers = {};
        this.schoolChain = chain;
    }

    getInfo() {
        return {
            about: 'SchoolChain/v1',
            id: this.id,
            chainId: this.schoolChain.blocks[0].hash, // genesis block hash
            url: this.url,
            peers: Object.keys(this.peers).length,
            difficulty: this.schoolChain.difficulty,
            blocks: this.schoolChain.blocks.length,
            confirmedTxs: this.schoolChain.getConfirmedTxs().length,
            pendingTxs: this.schoolChain.pendingTxs.length
        };
    }

    debug() {
        const confirmedBalances = this.schoolChain.getConfirmedBalances();
        return ({ node: this, importantAccounts: accountsDetails, confirmedBalances });
    }

    async notifyPeersOfTx(tx) {
        for (const id in this.peers) {
            const peer = this.peers[id];
            axios.post(`${peer}/txs/send`, tx);
        }
    }

    async notifyPeersOfBlock() {
        const notification = {
            blocks: this.schoolChain.blocks.length,
            URL: this.url
        };

        for (const url in this.peers) {
            axios.post(`${url}/peers/new-block`, notification);
        }
    }

    async syncChain(peerInfo) {
        if (peerInfo.chainId !== this.schoolChain.blocks[0].hash) {
            return { errorMsg: 'Peers should have the same chain ID' };
        }

        const peerBlocks = await axios.get(`${peerInfo.url}/blocks`);

        // invalidSchoolChain will be undefined if chain is valid
        const invalidSchoolChain = this.schoolChain.isValidChain(peerBlocks);

        if (invalidSchoolChain) {
            return invalidSchoolChain;
        } else {
            this.miningJobs = {};

            const confirmedTxHashes = this.schoolChain.getConfirmedTxs().map(tx => tx.hash);

            peerInfo.pendingTxs = peerInfo.pendingTxs.filter(t => {
                t.hash !== confirmedTxHashes.includes(t.hash);
            });

            if (peerBlocks.length > this.schoolChain.blocks.length) {
                this.schoolChain.blocks = peerBlocks;
                this.notifyPeersOfBlock();
            }
        }
    }

    async syncPendingTxs(peerInfo) {
        if (peerInfo.pendingTxs > 0) {
            const pendingTxs = await axios.get(`${peerInfo.url}/pending-txs`);

            for (const pt of pendingTxs.data) {
                if (!(this.schoolChain.pendingTxs.find(tx => tx.hash === pt.hash))) {
                    const newTx = this.schoolChain.addPendingTx(pt);
                    if (newTx.errorMsg) return newTx;
                    if (newTx.hash) this.notifyPeersOfTx(newTx);
                }
            }
        }
    }
}

module.exports = NetworkNode;