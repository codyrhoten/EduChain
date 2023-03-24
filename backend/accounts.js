const elliptic = require("elliptic");
const ec = new elliptic.ec("secp256k1");

const faucetPrivKey = '784fdfed3e9d7f92dbca9639c6de3a07ab1aabed0de1c0c7f5b5672851c5dcea';
const faucetPubKey = '2acf4b8bbd3fa38956bf859e0cef8d8805dca1f94155b7fb2f8e9401aba9b3171';
const faucetKeyPair = ec.keyFromPrivate(faucetPrivKey);
const faucetAddress = 'b89682fa1e3b1bc519a9774a9882e0059591948b';

const eduChainPubKey = '00000000000000000000000000000000000000000000000000000000000000000';
const eduChainAddress = '0000000000000000000000000000000000000000';
const eduChainSignature = [
    '0000000000000000000000000000000000000000000000000000000000000000',
    '0000000000000000000000000000000000000000000000000000000000000000'
];

module.exports = { 
    faucetAddress, 
    eduChainSignature, 
    eduChainPubKey, 
    eduChainAddress 
};