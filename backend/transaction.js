const crypto = require("crypto");

const SHA256 = message => {
    return crypto.createHash("sha256").update(message).digest("hex");
};

export default class Transaction {
    //const transaction = new Transaction(faucetKeyPair.getPublic("hex"), girlfriendwallet.getPublic("hex"), 333, 10)
    constructor(from, to, amount, gas = 0) {
        this.from = from;
        this.to = to;
        this.amount = amount;
        this.gas = gas;
    }

    sign(keyPair) {
        if (keyPair.getPrivate("hex") === this.from) {
            const txData = this.from + this.to + this.amount + this.gas;
            const txDataHash = SHA256(txData, 'base64');

            this.signature = keyPair.sign(txDataHash, 'base64').toDER('hex');
        }
    }

    isValid(tx, chain) {
        const txData = tx.from + tx.to + tx.amount + tx.gas;

        return (
            tx.from &&
            tx.to &&
            tx.amount &&
            (
                chain.getBalance(tx.from) >= tx.amount + tx.gas ||
                tx.from === mintAddress && tx.amount == this.reward
            ) &&
            ec
                .keyFromPublic(tx.from, "hex")
                .verify(SHA256(txData), tx.signature)
        );
    }
}