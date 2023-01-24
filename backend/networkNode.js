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
}

module.exports = NetworkNode;