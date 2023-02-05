import crypto from 'crypto-js';
import elliptic from 'elliptic';

const ec = new elliptic.ec('secp256k1');

function privKeyToPubKey(privKey) {
    let keyPair = ec.keyFromPrivate(privKey);
    let pubKey = 
        keyPair.getPublic().getX().toString(16) +
        (keyPair.getPublic().getY().isOdd() ? "1" : "0");
    return pubKey;
}

function createWallet() {
    const keyPair = ec.genKeyPair();
    const privKey = keyPair.getPrivate('hex');
    const pubKey = privKeyToPubKey(privKey);
    const address = pubKeyToAddress(pubKey);
    return { privKey, pubKey, address };
}

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

function verify(txHash, senderPubKey, sig) {
    let pubKeyX = senderPubKey.substring(0, 63);
    let pubKeyYOdd = parseInt(senderPubKey.substring(63));
    const decompressedPubKey = ec.curve.pointFromX(pubKeyX, pubKeyYOdd);
    const keyPair = ec.keyPair({ pub: decompressedPubKey });
    const valid = keyPair.verify(txHash, { r: sig[0], s: sig[1] });
    return valid;
}

export { createWallet, sha256, sign };