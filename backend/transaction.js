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

    isValid(block) {
        try {
            // check whether any transaction content is invalid
            valid.txContent(this);

            // check tx hash against result of tx hashing algorithm
            const txDataString =
                this.from +
                this.to +
                String(this.amount) +
                String(this.fee) +
                String(this.timestamp) +
                this.senderPubKey;
            const txHash = sha256(txDataString, 'base64');

            // RE-CALCULATE MINEDINBLOCK & SUCCESS


            if (block && (!this.minedInBlock || !this.success)) {
                error(`Tx ${this.hash} is not confirmed as mined`);
            }

            if (block) {
                // MATCH MINEDINBLOCK & SUCCESS WITH RECALCULATIONS
            }

            if (typeof (this.hash) !== 'string' || txHash !== this.hash) {
                error(`tx ${this.hash} has invalid hash`);
            }

            // check signature validity
            if (!verify(this.hash, this.senderPubKey, this.senderSig)) {
                error(`tx ${this.hash} has invalid signature`);
            }
        } catch (err) {
            if (!err.statusCode) err.statusCode = 500;
            next(err);
        }

        return true;
    }
}

module.exports = Transaction;