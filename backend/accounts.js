const elliptic = require("elliptic");
const ec = new elliptic.ec("secp256k1");

const faucetPrivKey = 'e0e34f0d30bdd3f13cf933e06eec2be0cd51a9f35a69c24672e86b928cef8c9f';
// const faucetPubKey = '26e100c75f11f56255b76b6d8d836c2409ffd7a7d731e2d08c93c4e53de84430';
const faucetKeyPair = ec.keyFromPrivate(faucetPrivKey);
const faucetAddress = '96089c4068ade8904f974d5dfc913f902d44d34a';

const schoolChainPrivKey = 'a8e64da240619de60828750849c7c46d551bddcf1819a9b2d1d46bf7e6a0cbb6';
const schoolChainPubKey = 'fc1d7175e8dcf20106c54a05b30dc9447e9fda2b098730bc4db44df3f1ed925e1';
const schoolChainKeyPair = ec.keyFromPrivate(schoolChainPrivKey);
const schoolChainAddress = 'ba3fe981cda884e045e427a86f3f4975f9f698fc';

module.exports = { 
    faucetPrivKey, 
    faucetKeyPair, 
    faucetAddress, 
    schoolChainPrivKey, 
    schoolChainKeyPair, 
    schoolChainPubKey, 
    schoolChainAddress 
};