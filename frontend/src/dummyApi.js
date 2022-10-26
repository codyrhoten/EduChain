const blockchain = require('./blockchain.json');

const api = () => {
    const blocks = blockchain.chain.reverse();
    const latestBlx = blocks.slice(0, 5);
    let txs = [];
    latestBlx.forEach(b => txs.push(...b.txs.reverse()));
    const latestTxs = txs.slice(0, 5);
    return { blocks, txs, latestBlx, latestTxs };  
};

module.exports = api;
