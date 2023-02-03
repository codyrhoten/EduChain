const { pubKeyToAddress } = require('./cryptography.js');

function address(address) {
    if (typeof (address) !== 'string' || !(/^[0-9a-f]{40}$/.test(address))) return false;
    return true;
}

function amount(value) {
    if (
        isNaN(value) ||
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
        isNaN(fee) ||
        !Number.isInteger(fee) ||
        fee < 10 ||
        fee > 1000000
    ) {
        return false;
    }

    return true;
}

function numberCheck(input) {
    if (isNaN(input)) return false;
    return true;
}

function signature(signature) {
    if (
        !Array.isArray(signature) ||
        signature.length !== 2 ||
        !(/^[0-9a-f]{64}$/.test(signature[0])) ||
        !(/^[0-9a-f]{64}$/.test(signature[1]))
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
    if (!address(data.from)) return { errorMsg: `Tx ${data.hash} has invalid sender address` };
    if (!address(data.to)) return { errorMsg: `Tx ${data.hash} has invalid receiver address` };
    if (!amount(data.amount)) return { errorMsg: `Tx ${data.hash} has invalid amount transfer` };
    if (!fee(data.fee)) return { errorMsg: `Tx ${data.hash} has invalid fee` };
    if (!numberCheck(data.timestamp)) return { errorMsg: `Tx ${data.hash} has invalid timestamp` };
    if (!signature(data.senderSig)) return { errorMsg: `Tx ${data.hash} has invalid signature` };

    if (!hash(data.senderPubKey)) 
        return { errorMsg: `Tx ${data.hash} has invalid sender public key` };

    if (senderAddress !== data.from)
        return {
            errorMsg: `Tx ${data.hash} 's sender public key doesn't correspond to sender's address`
        };
}

function blockContent(block) {
    if (!numberCheck(block.index)) return { errorMsg: `Block #${block.index} has invalid index` };

    if (!Array.isArray(block.txs))
        return { errorMsg: `Block #${newBlock.index} txs are incorrect data type` };

    if (!hash(block.prevBlockHash))
        return { errorMsg: `Block #${newBlock.index} has invalid previous block hash format` };

    if (!address(block.minedBy))
        return { errorMsg: `Miner address in block #${block.index} is invalid` };

    if (!hash(block.dataHash))
        return { errorMsg: `Block #${block.index} has invalid data hash format` };

    if (!hash(block.hash))
        return { errorMsg: `Block #${block.index} has invalid block hash format` };

    if (!numberCheck(block.timeStamp))
        return { errorMsg: `Block #${block.index} has invalid timestamp` };
}

module.exports = {
    address,
    amount,
    fee,
    numberCheck,
    signature,
    hash,
    txContent,
    blockContent
};