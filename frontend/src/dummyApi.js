const blockchain = require('./blockchain.json');

const api = () => {
    const blocks = blockchain.chain.reverse();
    const latestBlx = blocks.slice(0, 5);
    let latestTxs = [];
    latestBlx.forEach(b => latestTxs.push(...b.txs.reverse()));
    latestTxs = latestTxs.slice(0, 5);
    return { blocks, latestBlx, latestTxs };  
};

module.exports = api;
