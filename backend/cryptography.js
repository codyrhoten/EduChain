const crypto = require('crypto-js');
const elliptic = require('elliptic');
const ec = new elliptic.ec('secp256k1');

function sha256(message) {
    return crypto.SHA256(message).toString();
}

function sign(signerPrivKey, txHash) {
    const signature = ec.sign(txHash, signerPrivKey, 'hex', { canonical: true });
    return [signature.r.toString(16), signature.s.toString(16)];
}

function pubKeyToAddress(pubKey) {
    return crypto.RIPEMD160(pubKey).toString();
}

function verify(txHash, senderPubKey, sig) {
    // const pubKeyX = senderPubKey.substring(0, 64);
    // const pubKeyYOdd = parseInt(senderPubKey.substring(64));
    // const pubKeyPoint = ec.curve.pointFromX(pubKeyX, pubKeyYOdd);
    // const keyPair = ec.keyPair({ pub: pubKeyPoint });
    // return keyPair.verify(txHash, { r: sig[0], s: sig[1] });
    return ec.verify(txHash, { r: sig[0], s: sig[1] }, senderPubKey);
}

module.exports = { sha256, sign, pubKeyToAddress, verify };