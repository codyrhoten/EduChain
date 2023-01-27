const { sha256, sign } = require('./cryptography.js');

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

    isValid() {
        // check tx content
        if (
            typeof this.from !== 'string' ||
            typeof this.to !== 'string' ||
            typeof this.amount !== 'number' ||
            typeof this.fee !== 'number' ||
            typeof this.timeStamp !== 'number' ||
            typeof this.senderPubKey !== 'string' ||
            typeof this.hash !== 'string' ||
            !Array.isArray(this.senderSig) ||
            typeof this.senderSig[0] !== 'string' ||
            typeof this.senderSig[1] !== 'string' ||
            typeof this.minedInBlock !== 'number' ||
            typeof this.success !== 'boolean'
        ) {
            console.log('Invalid data type in tx');
            return false;
        }

        try {
            // check tx hash against result of tx hashing algorithm
            const txDataString =
                this.from +
                this.to +
                String(this.amount) +
                String(this.fee) +
                String(this.timestamp) +
                this.senderPubKey;
            const txHash = sha256(txDataString, 'base64');

            // RE-EXECUTE ALL TXS, RE-CALCULATE MINEDINBLOCK & SUCCESS

            if (txHash !== this.hash) {
                const error = new Error(`tx ${this.hash} has invalid hash`);
                error.statusCode = 400;
                throw error;
            }

            // check signature validity
            if (!verify(this.hash, this.senderPubKey, this.senderSig)) {
                const error = new Error(`tx ${this.hash} has invalid signature`);
                error.statusCode = 400;
                throw error;
            }
        } catch (err) {
            if (!err.statusCode) err.statusCode = 500;
            next(err);
        }

        return true;
    }
}

module.exports = Transaction;