const crypto = require("crypto");
const elliptic = require('elliptic');
const ec = new elliptic.ec('secp256k1');

const SHA256 = message => {
    return crypto.createHash("sha256").update(message).digest("hex");
};

class Transaction {
    //const transaction = new Transaction(faucetKeyPair.getPublic("hex"), girlfriendwallet.getPublic("hex"), 333, 10)
    constructor(
        from,
        to,
        amount,
        fee = 0,
        timestamp,
        // senderPubKey, FOR VERIFYING SIGNATURE
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
        // this.senderPubKey = senderPubKey;
        this.hash = hash;
        this.senderSig = senderSig;
        this.minedInBlock = minedInBlock
        this.success = success;

        if (this.hash === undefined) this.getHash();
    }

    getHash() {
        const txData =  String(this.from + this.to + this.amount + this.fee + this.timestamp /* + this.senderPubKey */);
        this.hash = SHA256(txData, 'base64');
    }
    
    sign(signerPrivKey) {
        const signerKeyPair = ec.keyFromPrivate(signerPrivKey);
        const signature = signerKeyPair.sign(this.hash);
        this.signature = [signature.r.toString(16), signature.s.toString(16)];
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
                .verify(SHA256(txData), tx.signature)
        );
    }
}

module.exports = Transaction;