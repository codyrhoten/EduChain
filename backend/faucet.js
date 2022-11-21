const elliptic = require("elliptic");
const ec = new elliptic.ec("secp256k1");
const {
    Blockchain,
    Transaction,
    mint_key_pair,
    mint_public_address
} = require('./blockchain');

const faucetPrivKey = '8bc04372d91def4dc05ddf4197b46add2e48a0dc7232aa2e72d6f6dc87404f3b';
const faucetPubKey = '047c3109076a9957f6afc5c087488d6fc5d9de7911f5e947988095df6ab1f12ad46afa7c25f40a22ddceb270410bda9d24c2de501715bea8da3a009cc3277991eb';
const faucetKeyPair = ec.genKeyPair();

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
console.log(chain.getBalance(faucetPubKey));