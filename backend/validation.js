const {error} = require('./error.js');
const { pubKeyToAddress } = require('./cryptography.js');

function address(address) {
    if (typeof (address) !== 'string' || !(/^[0-9a-f]{40}$/.test(address))) return false;
    return true;
}

function publicKey(key) {
    if (typeof (key) !== 'string' || !(/^[0-9a-f]{66}$/.test(key))) return false;
    return true;
}

function amount(value) {
    if (
        isNaN(value)||
        !Number.isInteger(value) ||
        value < 0 ||
        value > 10000000000000
    ) {
        return false;
    }

    return true;
}

function fee(fee) {
    if (
        isNaN(fee)||
        !Number.isInteger(fee) ||
        fee < 10 ||
        fee > 1000000
    ) {
        return false;
    }

    return true;
}

function timestamp(date) {
    if (isNaN(date)) return false;
    return true;
}

function signature(signature) {
    if (
        !Array.isArray(signature) ||
        signature.length !== 2 ||
        !(/^[0-9a-f]{1,65}$/.test(signature[0])) ||
        !(/^[0-9a-f]{1,65}$/.test(signature[1]))
    )
        return false;

    return true;
}

function hash(hash) {
    if (typeof hash !== 'string' || !(/^[0-9a-f]{64}$/.test(hash))) return false;
    return true;
}

function txContent(data) {
    const senderAddress = pubKeyToAddress(data.senderPubKey);
    if (!address(data.from)) error(`Tx ${data.hash} has invalid sender address`);
    if (!address(data.to)) error(`Tx ${data.hash} has invalid receiver address`);
    if (!amount(data.amount)) error(`Tx ${data.hash} has invalid amount transfer`);
    if (!fee(data.fee)) error(`Tx ${data.hash} has invalid fee`);
    if (!timestamp(data.timestamp)) error(`Tx ${data.hash} has invalid timestamp`);
    if (!signature(data.senderSig)) error(`Tx ${data.hash} has invalid signature`);
    if (!publicKey(data.senderPubKey)) error(`Tx ${data.hash} has invalid sender public key`);

    if (senderAddress !== data.from) 
        error(`Tx ${data.hash} 's sender public key doesn't correspond to sender's address`);
}

module.exports = {
    address,
    amount,
    fee,
    publicKey,
    timestamp,
    signature,
    hash,
    txContent
};