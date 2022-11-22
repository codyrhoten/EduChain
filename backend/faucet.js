const elliptic = require("elliptic");
const ec = new elliptic.ec("secp256k1");
const {
    Blockchain,
    Transaction,
    mint_key_pair,
    mint_public_address
} = require('./blockchain');

const defaultPrivKey = '2633bfcb75c20d6f28dffdeb40e3bfaff8507d02ef74dcd09208569a0c420e27';
const defaultPubKey = '04ff47695b92c0d8eda9b284ca0c4561d0a3788a918aa5fd63827019e111adfd3a9ab820551d3dc1a52609cbe6a7da63fcdda22f2070aa29ff139efdc9b5d6401d';
const defaultKeyPair = ec.keyFromPrivate(defaultPrivKey);

const faucetPrivKey = '8bc04372d91def4dc05ddf4197b46add2e48a0dc7232aa2e72d6f6dc87404f3b';
const faucetPubKey = '047c3109076a9957f6afc5c087488d6fc5d9de7911f5e947988095df6ab1f12ad46afa7c25f40a22ddceb270410bda9d24c2de501715bea8da3a009cc3277991eb';

const chain = new Blockchain();

const genesisTx = new Transaction(
    defaultPubKey,
    faucetPubKey,
    100000,
    0
);

genesisTx.sign(defaultKeyPair);
chain.addTransaction(genesisTx);
chain.miningTransaction(faucetPubKey);
console.log(chain.getBalance(faucetPubKey));