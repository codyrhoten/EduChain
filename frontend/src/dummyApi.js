const blockchain = require('./blockchain.json');

export default class api {
    constructor() {
        this.blockchain = blockchain;
        this.txs = [];
        this.addressTxs = [];
    }

    getAllBlocks() {
        return this.blockchain.chain;
    }

    getAllTxs() {
        this.blockchain.chain.forEach(b => this.txs.push(...b.txs.reverse()));
        this.txs.unshift(...this.blockchain.pendingTransactions.reverse());
        return this.txs;
    }

    getAddressHist(address) {
        this.blockchain.chain.forEach(b => {
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

    getBlock(index) {
        const blocks = this.getAllBlocks().reverse();
        const block = blocks.find(block => block.index === index);
        return block;
    }
}