const uuid = require('uuid');

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
            nodeId: this.nodeId,
            nodeURL: this.url,
            peers: this.peers.size,
            difficulty: 1,
            blocks: this.schoolChain.blocks.length,
            confirmedTxs: this.schoolChain.getConfirmedTxs().length,
            pendingTxs: this.schoolChain.pendingTxs.length
        };
    }
}

module.exports = NetworkNode;