const blockchain = require('./blockchain.json');

export default class api {
    constructor() {
        this.blockchain = blockchain;
        this.blocks = [];
        this.txs = [];
    }

    getBlocks() {
        this.blocks = blockchain.chain.reverse();
        return this.blocks;
    }

    getTxs() {
        this.getBlocks().forEach(b => this.txs.push(...b.txs));
        this.txs = this.txs.reverse();
        return this.txs;
    }

    /* const latestBlx = blocks.slice(0, 5);
    const latestTxs = txs.slice(0, 5); */
}