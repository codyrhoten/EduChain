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

            await fetch(
                `${peer}/txs/send`, 
                { 
                    method: 'POST',    
                    body: JSON.stringify(tx), 
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }
    }

    async notifyPeersOfBlock() {
        const notification = {
            blocks: this.schoolChain.blocks.length,
            URL: this.url
        };

        for (const nodeId in this.peers) {
            await fetch(
                `${this.peers[nodeId]}/peers/new-block`, 
                {
                    method: 'POST',
                    body: JSON.stringify(notification),
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }
    }

    async syncChain(peerInfo) {
        if (peerInfo.chainId !== this.schoolChain.blocks[0].hash) {
            return { errorMsg: 'Peers should have the same chain ID' };
        }

        const response = await fetch(`${peerInfo.url}/blocks`);
        const peerBlocks = await response.json();
        const validChain = this.schoolChain.isValidChain(peerBlocks);

        if (validChain.errorMsg) {
            return validChain; // errorMsg
        } else {
            if (peerBlocks.length > this.schoolChain.blocks.length) {
                this.schoolChain.blocks = peerBlocks;
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
            const response = await fetch(`${peerInfo.url}/pending-txs`);
            const peerPendingTxs = await response.json();
            console.log('peer pending txs', peerPendingTxs)

            for (const pt of peerPendingTxs) {
                if (!(this.schoolChain.pendingTxs.find(tx => tx.hash === pt.hash))) {
                    console.log(`Peer ${this.url} getting the pending tx ${pt.hash} of peer ${peerInfo.url}`)
                    const newTx = this.schoolChain.addPendingTx(pt);

                    if (newTx.errorMsg) {
                        console.log('error:', newTx.errorMsg)
                        return newTx;
                    }

                    if (newTx.hash) {
                        console.log('notifying peers of new tx')
                        this.notifyPeersOfTx(newTx);
                    }
                }
            }
        }
    }
}

module.exports = NetworkNode;