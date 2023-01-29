const { sha256, sign, verify } = require('./cryptography.js');
const valid = require('./validation.js');
const { error } = require('./error.js');

class Transaction {
    constructor(
        from,
        to,
        amount,
        fee = '0',
        timestamp,
        senderPubKey,
        hash,
        senderSig,
        minedInBlock,
        success
    ) {
        this.from = from;
        this.to = to;
        this.amount = amount;
        this.fee = fee;
        this.timestamp = timestamp;
        this.senderPubKey = senderPubKey;
        this.hash = hash;
        this.senderSig = senderSig;
        this.minedInBlock = minedInBlock
        this.success = success;

        if (this.hash === undefined) this.getHash();
    }

    getHash() {
        const txData = {
            from: this.from,
            to: this.to,
            amount: this.amount,
            fee: this.fee,
            timestamp: this.timestamp,
            senderPubKey: this.senderPubKey
        };
        const txDataJson = JSON.stringify(txData);
        this.hash = sha256(txDataJson, 'base64');
    }

    sign(signerPrivKey) {
        this.senderSig = sign(signerPrivKey, this.hash);
    }
}

module.exports = Transaction;