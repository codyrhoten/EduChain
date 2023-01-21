const elliptic = require("elliptic");
const ec = new elliptic.ec("secp256k1");

const faucetPrivKey = 'e0e34f0d30bdd3f13cf933e06eec2be0cd51a9f35a69c24672e86b928cef8c9f';
const faucetPubKey = '26e100c75f11f56255b76b6d8d836c2409ffd7a7d731e2d08c93c4e53de84430';
const faucetKeyPair = ec.keyFromPrivate(faucetPrivKey);
const faucetAddress = 'd334371fe9555603d107b5e96c14ab5328661d97';

export { faucetAddress, faucetKeyPair };