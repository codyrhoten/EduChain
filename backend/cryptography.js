const crypto = require('crypto-js');
const elliptic = require('elliptic');
const ec = new elliptic.ec('secp256k1');

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

function decompressPublicKey(compressedPubKey) {
    let pubKeyX = compressedPubKey.substring(0, 63);
    let pubKeyYOdd = parseInt(compressedPubKey.substring(63));
    let pubKeyPoint = ec.curve.pointFromX(pubKeyX, pubKeyYOdd);
    return pubKeyPoint;
}

function verify(txHash, senderPubKey, sig) {
    console.log(txHash)
    const decompressedPubKey = decompressPublicKey(senderPubKey);
    const keyPair = ec.keyPair({ pub: decompressedPubKey });
    const valid = keyPair.verify(txHash, { r: sig[0], s: sig[1] });
    return valid;
}

module.exports = { sha256, sign, pubKeyToAddress, verify };