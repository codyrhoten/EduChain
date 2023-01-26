const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const NetworkNode = require('./networkNode.js');
const Blockchain = require('./blockchain.js');
const port = process.argv[2];
const nodeUrl = process.argv[3];

const app = express();
const schoolChain = new Blockchain();
const node = new NetworkNode(nodeUrl, schoolChain);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

/* ---------------------API--------------------- */

app.get('/info', (req, res) => {
    res.json(node.getInfo());
});

app.get('/debug', (req, res) => {
    res.json(node.debug());
});

app.get('/debug/reset-chain', (req, res) => {
    node.schoolChain = new Blockchain();
    res.json({ message: 'The chain was reset to its genesis block' });
});

app.get('/debug/mine/:minerAddress', (req, res) => {

});

app.get('/blocks', (req, res) => {
    res.json(node.schoolChain.blocks);
});

app.get('/blocks/:index', (req, res) => {
    const blockIndex = req.params.index;
    const block = node.schoolChain.blocks.find(b => blockIndex == b.index);
    if (block) {
        res.json(block);
    } else {
        res.json({ error: 'Invalid block index' });
    }
});

app.get('/all-txs', (req, res) => {
    res.json(node.getAllTxs());
});

app.get('/txs/:hash', (req, res) => {
    const txHash = req.params.hash;

    if (typeof txHash !== 'string' || /^[0-9a-f]{64}$/.test(txHash)) {
        res.json({ error: 'Invalid transaction hash'})
    }

    const allTxs = node.getAllTxs();
    const tx = allTxs.find(t => t.hash === txHash);
    res.json(tx);
});

// not sure what this is for yet
app.get('/balances', (req, res) => {
    res.json(node.schoolChain.getConfirmedBalances())
});

app.get('/address-data/:address', (req, res) => {
    const address = req.params.address;

    if (typeof address !== 'string' || !(/^[0-9a-f]{40}$/.test(address))) {
        res.json({ error: 'Invalid address' });
    }

    const txHistory = node.getTxHistory(address);
    const balance = node.getBalance(address);
    res.json({ balance, txs: txHistory });
});

app.post('/txs/send', (req, res) => {

});


app.get('/peers', (req, res) => {
    res.json(node.peers.entries());
});

app.post('/peers/connect', async (req, res) => {
    const peer = req.body.peer;
    if (peer === undefined) res.json({ error: 'Missing "peer" in the form' });

    try {
        const peerInfo = await axios.get(peer + '/info');

        // Check whether connecting node is also the user's node
        if (node.nodeId === peerInfo.data.nodeId) {
            res.json({ error: 'Can\'t connect to self' });
            // Check whether connecting node is already connected
        } else if (node.peers.get(peerInfo.data.nodeId)) {
            res.json({ error: `This node is already connected to peer: ${peer}` });
        } else {
            node.peers.set(peerInfo.data.nodeId, peer);
            node.syncChain(peerInfo.data);
            node.syncPendingTxs(peerInfo.data);
        }
    } catch (err) {
        res.json({ error: `Could not connect to peer: ${peer}` });
    }

});

app.post('/peers/new-block', (req, res) => {

});

app.post('/mining/get-mining-job/:address', (req, res) => {

});

app.post('/mining/submit-mined-block', (req, res) => {

});

app.listen(port, () => console.log(`Listening on port ${port}`));