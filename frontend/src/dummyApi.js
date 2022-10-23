const blockchain = require('./blockchain.json');

const api = () => {
    const latestBlx = blockchain.chain.reverse().slice(0, 5);
    let latestTxs = [];
    latestBlx.forEach(b => latestTxs.push(...b.txs));
    latestTxs = latestTxs.reverse().slice(0, 5);
    return { latestBlx, latestTxs };  
};

module.exports = api;
