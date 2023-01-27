const  { sha256, sign } = require('./cryptography.js');

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
        const txData = 
            this.from + 
            this.to + 
            String(this.amount) + 
            String(this.fee) + 
            String(this.timestamp) + 
            this.senderPubKey;
        this.hash = sha256(txData, 'base64');
    }

    sign(signerPrivKey) {
        this.senderSig = sign(signerPrivKey, this.hash);
    }

    isValid(tx, chain) {
        const txData = tx.from + tx.to + tx.amount + tx.fee;

        return (
            tx.from &&
            tx.to &&
            tx.amount &&
            (
                chain.getBalance(tx.from) >= tx.amount + tx.fee ||
                tx.from === mintAddress && tx.amount == this.reward
            ) &&
            ec
                .keyFromPublic(tx.from, "hex")
                .verify(sha256(txData), tx.signature)
        );
    }
}

module.exports = Transaction;