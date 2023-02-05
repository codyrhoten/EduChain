const crypto = require('crypto-js');
// const elliptic = require('elliptic');
// const ec = new elliptic.ec('secp256k1');

// const CryptoJS = require("crypto-js");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

function sha256(message) {
    return crypto.SHA256(message).toString();
}

function sign(signerPrivKey, txHash) {
    const keyPair = ec.keyFromPrivate(signerPrivKey);
    const signature = keyPair.sign(txHash);
    return [signature.r.toString(16), signature.s.toString(16)];
}

function pubKeyToAddress(pubKey) {
    return crypto.RIPEMD160(pubKey).toString();
}

function decompressPubKey(pubKey) {
    let pubKeyX = pubKey.substring(0, 64);
    let pubKeyYOdd = parseInt(pubKey.substring(64));
    const pubKeyPoint = ec.curve.pointFromX(pubKeyX, pubKeyYOdd);
    return pubKeyPoint;
}

function verify(hash, pubKey, sig) {
    const pubKeyPoint = decompressPubKey(pubKey)
    const keyPair = ec.keyPair({ pub: pubKeyPoint });
    const valid = keyPair.verify(hash, { r: sig[0], s: sig[1] });
    return valid;
}

module.exports = { sha256, sign, pubKeyToAddress, verify };