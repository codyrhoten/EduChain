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

        for (const nodeId in this.peers) {
            axios.post(`${this.peers[nodeId]}/peers/new-block`, notification);
        }
    }

    async syncChain(peerInfo) {
        if (peerInfo.chainId !== this.schoolChain.blocks[0].hash) {
            return { errorMsg: 'Peers should have the same chain ID' };
        }

        const peerBlocks = await axios.get(`${peerInfo.url}/blocks`);
        const validChain = this.schoolChain.isValidChain(peerBlocks);

        if (validChain.errorMsg) {
            return validChain; // errorMsg
        } else {
            if (peerBlocks.data.length > this.schoolChain.blocks.length) {
                this.schoolChain.blocks = peerBlocks.data;
                this.miningJobs = {};

                const confirmedTxHashes = this.schoolChain.getConfirmedTxs().map(tx => tx.hash);

                this.schoolChain.pendingTxs = this.schoolChain.pendingTxs.filter(t => {
                    t.hash !== confirmedTxHashes.includes(t.hash);
                });

                this.notifyPeersOfBlock();
            }
        }
    }

    async syncPendingTxs(peerInfo) {
        if (peerInfo.pendingTxs > 0) {
            const pendingTxs = await axios.get(`${peerInfo.url}/pending-txs`)
                .catch(function (err) {
                    console.log('sync pending txs axios error:', err.toJSON())
                });

            for (const pt of pendingTxs.data) {
                if (!(this.schoolChain.pendingTxs.find(tx => tx.hash === pt.hash))) {
                    console.log(`Peer ${this.url} getting the pending tx ${pt.hash} of peer ${peerInfo.url}`)
                    const newTx = this.schoolChain.addPendingTx(pt);
                    console.log(`Peer ${this.url} looking at newTx from peer ${peerInfo.url}`, newTx)
                    if (newTx.errorMsg) return newTx;
                    if (newTx.hash) this.notifyPeersOfTx(newTx);
                }
            }
        }
    }
}

module.exports = NetworkNode;