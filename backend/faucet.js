const elliptic = require("elliptic");
const ec = new elliptic.ec("secp256k1");
const { 
    Blockchain, 
    Transaction, 
    mint_key_pair, 
    mint_public_address 
} = require('./blockchain');

const faucetKeyPair = ec.genKeyPair();
const faucetPubKey = faucetKeyPair.getPublic('hex');

const chain = new Blockchain();

const genesisTx = new Transaction(
    mint_public_address,
    faucetPubKey,
    100000,
    0
);

genesisTx.sign(mint_key_pair);
chain.addTransaction(genesisTx);
chain.miningTransaction(faucetPubKey);
console.log(chain.chain[0].data)
console.log(chain.getBalance(faucetPubKey));
