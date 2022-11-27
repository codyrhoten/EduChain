const elliptic = require("elliptic");

const ec = new elliptic.ec("secp256k1");
const fPrivKey = 
    'e0e34f0d30bdd3f13cf933e06eec2be0cd51a9f35a69c24672e86b928cef8c9f';
const fPubKey = 
    '04026e100c75f11f56255b76b6d8d836c2409ffd7a7d731e2d08c93c4e53de84435e5dff17ec76571a76a10df159645b1745ca211c5ba19a044bb993fc0a4efca4';

const fKeyPair = ec.keyFromPrivate(fPrivKey);
const fAddress = 'd334371fe9555603d107b5e96c14ab5328661d97';

module.exports = { fKeyPair, fPrivKey, fPubKey, fAddress };