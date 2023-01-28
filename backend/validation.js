function address(address) {
    if (typeof (address) !== 'string' || !(/^[0-9a-f]{40}$/.test(address))) return false;
    return true;
}

function publicKey(pubKey) {
    if (typeof (pubKey) !== 'string' || !(/^[0-9a-f]{65}$/.test(pubKey))) return false;
    return true;
}

function amount(value) {
    if (
        typeof (value) !== 'number' || 
        !Number.isInteger(value) || 
        !((value >= 0) && (val <= 10000000000000))
    ) {
        return false;
    }

    return true;
}

function fee(fee) {
    if (
        typeof (fee) !== 'number' || 
        !Number.isInteger(fee) ||
        ((fee >= 10) && (fee <= 1000000))
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
    if (typeof hash !== 'string' || /^[0-9a-f]{64}$/.test(hash)) return false;
    return true;
}

module.exports = {
    address,
    publicKey,
    amount,
    fee,
    timestamp,
    signature,
    hash
};