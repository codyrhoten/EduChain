const blockchain = require('./blockchain.json');

export default class api {
    constructor() {
        this.blockchain = blockchain;
        this.txs = [];
        this.addressTxs = [];
    }

    getAllTxs() {
        this.txs = [];
        this.blockchain.chain.forEach(b => this.txs.push(...b.data));
        this.txs.unshift(...this.blockchain.pendingTransactions);
        return this.txs;
    }

    getAddressHist(address) {
        //const validAddress = /^[0-9a-f]{40}$/.test(address);
        
        // if (validAddress) {
            this.blockchain.chain.forEach(b => {
                b.transactions.forEach(tx => {
                    if (tx.to === address || tx.from === address) {
                        this.addressTxs.push(tx);
                    }
                });
            });

            this.blockchain.pendingTxs.forEach(t => {
                if (t.to === address || t.from === address) {
                    this.addressTxs.push(t);
                }
            })
    
            let balance = 0;
            this.addressTxs.forEach(tx => {
                if (tx.to === address) {
                    balance += Number(tx.amount);
                } else if (tx.from === address) {
                    balance -= Number(tx.amount);
                }
            });
    
            return { txs: this.addressTxs, balance, address };
        /* } else {
            throw Error('There are no matching entries');
        } */
    }

    getBlock(index) {
        const blocks = this.getAllBlocks().reverse();
        const block = blocks.find(block => block.index.toString() === index);
        return block;
    }
}