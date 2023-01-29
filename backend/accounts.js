const elliptic = require("elliptic");
const ec = new elliptic.ec("secp256k1");

const faucetPrivKey = 'e0e34f0d30bdd3f13cf933e06eec2be0cd51a9f35a69c24672e86b928cef8c9f';
const faucetPubKey = '02026e100c75f11f56255b76b6d8d836c2409ffd7a7d731e2d08c93c4e53de8443';
const faucetKeyPair = ec.keyFromPrivate(faucetPrivKey);
const faucetAddress = 'e1f98309273b2cbd5350a50a34c526582f73cb74';

const schoolChainPubKey = '00000000000000000000000000000000000000000000000000000000000000000';
const schoolChainAddress = '0000000000000000000000000000000000000000';
const schoolChainSignature = [
    '0000000000000000000000000000000000000000000000000000000000000000',
    '0000000000000000000000000000000000000000000000000000000000000000'
];

module.exports = { 
    faucetPrivKey, 
    faucetKeyPair,
    faucetPubKey,
    faucetAddress, 
    schoolChainSignature, 
    schoolChainPubKey, 
    schoolChainAddress 
};