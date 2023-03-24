const uuid = require('uuid');
const accountsDetails = require('./accounts.js');

class NetworkNode {
    constructor(url, chain) {
        this.id = uuid.v4().split('-').join('');
        this.url = url;
        this.peers = {};
        this.eduChain = chain;
    }

    getInfo() {
        return {
            about: 'eduChain/v1',
            id: this.id,
            chainId: this.eduChain.blocks[0].hash, // genesis block hash
            url: this.url,
            peers: Object.keys(this.peers).length,
            difficulty: this.eduChain.difficulty,
            blocks: this.eduChain.blocks.length,
            confirmedTxs: this.eduChain.getConfirmedTxs().length,
            pendingTxs: this.eduChain.pendingTxs.length
        };
    }

    debug() {
        const confirmedBalances = this.eduChain.getConfirmedBalances();
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
            blocks: this.eduChain.blocks.length,
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
        if (peerInfo.chainId !== this.eduChain.blocks[0].hash) {
            return { errorMsg: 'Peers should have the same chain ID' };
        }

        const response = await fetch(`${peerInfo.url}/blocks`);
        const peerBlocks = await response.json();
        const validChain = this.eduChain.isValidChain(peerBlocks);

        if (validChain.errorMsg) {
            return validChain; // errorMsg
        } else {
            if (peerBlocks.length > this.eduChain.blocks.length) {
                this.eduChain.blocks = peerBlocks;
                this.miningJobs = {};

                const confirmedTxHashes = this.eduChain.getConfirmedTxs().map(tx => tx.hash);

                this.eduChain.pendingTxs = this.eduChain.pendingTxs.filter(t => {
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

            for (const pt of peerPendingTxs) {
                if (!(this.eduChain.pendingTxs.find(tx => tx.hash === pt.hash))) {
                    const newTx = this.eduChain.addPendingTx(pt);

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