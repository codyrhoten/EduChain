const crypto = require("crypto");
const elliptic = require('elliptic');
const ec = new elliptic.ec('secp256k1');

function sha256(message) {
    return crypto.createHash("sha256").update(message).digest("hex");
}

function sign(signerPrivKey, txHash) {
    const signerKeyPair = ec.keyFromPrivate(signerPrivKey);
    const signature = signerKeyPair.sign(txHash);
    return [signature.r.toString(16), signature.s.toString(16)];
}

function verify(txHash, senderPubKey, sig) {
    const pubKeyX = senderPubKey.substring(0, 64);
    const pubKeyYOdd = parseInt(senderPubKey.substring(64));
    const pubKeyPoint = ec.curve.pointFromX(pubKeyX, pubKeyYOdd);
    const keyPair = ec.keyPair({ pub: pubKeyPoint });
    return keyPair.verify(txHash, { r: sig[0], s: sig[1] });
}

module.exports = { sha256, sign, verify };