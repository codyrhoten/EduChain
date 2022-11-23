const crypto = require("crypto");
const keccak256 = require('js-sha3').keccak256;
const elliptic = require('elliptic');
const ec = new elliptic.ec('secp256k1');

const SHA256 = message => {
    crypto.createHash("sha256").update(message).digest("hex");
};

const mint_key_pair = ec.genKeyPair();
const mint_priv_key = mint_key_pair.getPrivate('hex');
const mint_pub_key = mint_key_pair.getPublic('hex');
const hashOfMintPubKey = keccak256(Buffer.from(mint_pub_key, 'hex'));
const mintAddress = hashOfMintPubKey.slice(-40).toString('hex');

const faucetPrivKey = 'e0e34f0d30bdd3f13cf933e06eec2be0cd51a9f35a69c24672e86b928cef8c9f';
const faucetPubKey = '04026e100c75f11f56255b76b6d8d836c2409ffd7a7d731e2d08c93c4e53de84435e5dff17ec76571a76a10df159645b1745ca211c5ba19a044bb993fc0a4efca4';
// const faucetKeyPair = ec.keyFromPrivate(faucetPrivKey);
const faucetAddress = 'd334371fe9555603d107b5e96c14ab5328661d97';

class Block {
    constructor(timeStamp, data) {
        this.timeStamp = timeStamp;
        this.data = data;
        this.hash = this.getHash();
        this.prevHash = "";
        this.nonce = 0;
    }

    getHash() {
        return SHA256(
            JSON.stringify(this.data) +
            this.timeStamp +
            this.prevHash +
            this.nonce
        );
    }

    mine(difficulty) {
        while (!this.hash.startsWith(Array(difficulty + 1).join("0"))) {
            this.nonce++;
            this.hash = this.getHash();
        }
    }

    hasValidTransactions(chain) {
        return this.data.every((transaction) =>
            transaction.isValid(transaction, chain)
        );
    }
}

class Blockchain {
    constructor() {
        const initialCoinRelease = new Transaction(
            mintAddress,
            faucetAddress,
            100000
        );

        const genesisBlock = new Block(
            Date.now().toString(),
            [initialCoinRelease]
        );

        this.chain = [genesisBlock];
        this.difficulty = 1;
        this.blockTime = 30000;
        this.transaction = [];
        this.reward = 500;
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }

    getBalance(address) {
        let balance = 0;

        this.chain.forEach(block => {
            block.data.forEach(transaction => {
                if (transaction.to === address) {
                    balance += transaction.amount;
                }

                if (transaction.from === address) {
                    balance -= transaction.amount;
                    balance -= transaction.gas;
                }
            });
        });

        return balance;
    }

    addBlock(block) {
        const lastBlockTimestamp = parseInt(this.getLastBlock().timeStamp);
        block.prevHash = this.getLastBlock().hash;
        block.hash = block.getHash();
        block.mine(this.difficulty);
        this.chain.push(block);
        this.difficulty +=
            Date.now() - lastBlockTimestamp < this.blockTime ? 1 : -1;
    }

    addTransaction(transaction) {
        if (transaction.isValid(transaction, this)) {
            this.transaction.push(transaction);
        }

        console.log(transaction);
    }

    miningTransaction(rewardAddress) {
        let block = {};
        let gas = 0;

        this.transaction.forEach((transaction) => {
            gas += transaction.gas;
        });

        const rewardTransaction = new Transaction(
            mintAddress,
            rewardAddress,
            this.reward + gas
        );

        rewardTransaction.sign(mint_priv_key);

        if (this.transaction.length !== 0) {
            block = new Block(
                Date.now().toString(),
                [rewardTransaction, ...this.transaction]
            );

            this.addBlock(block);
        }

        this.transaction = [];
    }

    isValid(blockchain = this) {
        for (let i = 1; i < blockchain.chain.length; i++) {
            const currentBlock = blockchain.chain[i];
            const prevBlock = blockchain.chain[i - 1];

            if (
                currentBlock.hash !== currentBlock.getHash() ||
                currentBlock.prevHash !== prevBlock.hash ||
                currentBlock.hasValidTransactions(blockchain)
            ) {
                return false;
            }
        }

        return true;
    }
}

class Transaction {
    //const transaction = new Transaction(faucetKeyPair.getPublic("hex"), girlfriendwallet.getPublic("hex"), 333, 10)
    constructor(from, to, amount, gas = 0) {
        this.from = from;
        this.to = to;
        this.amount = amount;
        this.gas = gas;
    }

    sign(privKey) {
        if (privKey.getPrivate("hex") === this.from) {
            const txData = this.from + this.to + this.amount + this.gas;
            const txDataHash = SHA256(txData, 'base64');

            this.signature = ec.sign(
                txDataHash, 
                privKey, 
                'hex', 
                { canonical: true }
            );
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

const chain = new Blockchain();
console.log(chain.chain[0])

/* const Chain = new Blockchain();

const girlfriendwallet = ec.genKeyPair();

const transaction = new Transaction(
  faucetKeyPair.getPublic("hex"),
  girlfriendwallet.getPublic("hex"),
  333,
  10
);

transaction.sign(faucetKeyPair);
Chain.addTransaction(transaction);
Chain.miningTransaction(girlfriendwallet.getPublic("hex"));
console.log("Your balance: ", Chain.getBalance(faucetKeyPair.getPublic("hex")));
console.log(
  "Her balance: ",
  Chain.getBalance(girlfriendwallet.getPublic("hex"))
); */

module.exports = { Block, Blockchain, Transaction, mint_key_pair, mint_pub_key };