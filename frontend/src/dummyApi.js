const blockchain = require('./blockchain.json');

export default class api {
    constructor() {
        this.blockchain = blockchain;
        this.blocks = [];
        this.txs = [];
        this.addressTxs = [];
    }

    getBlocks() {
        this.blocks = blockchain.chain;
        return this.blocks;
    }

    getTxs() {
        this.getBlocks().forEach(b => this.txs.push(...b.txs.reverse()));
        this.txs = this.txs.reverse();
        return this.txs;
    }

    getAddressHist(address) {
        this.getBlocks().forEach(b => {
            b.txs.forEach(tx => {
                if (tx.recipient === address || tx.sender === address) {
                    this.addressTxs.push(tx);
                }
            });
        });

        let balance = 0;
        this.addressTxs.forEach(tx => {
            if (tx.recipient === address) {
                balance -= Number(tx.amount);
            } else if (tx.sender === address) {
                balance += Number(tx.amount);
            }
        });

        return { txs: this.addressTxs, balance, address };
    }
}