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
    try {
        res.json(node.getInfo());
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
});

app.get('/debug', (req, res) => {
    try {
        res.json(node.debug());
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
});

app.get('/debug/reset-chain', (req, res) => {
    try {
        node.schoolChain = new Blockchain();
        res.json({ message: 'The chain was reset to its genesis block' });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
});

app.get('/debug/mine/:minerAddress', (req, res) => {
    try {

    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
});

app.get('/blocks', (req, res) => {
    try {
        res.json(node.schoolChain.blocks);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
});

app.get('/blocks/:index', (req, res, next) => {
    try {
        const blockIndex = req.params.index;
        const block = node.schoolChain.blocks.find(b => blockIndex == b.index);

        if (block) {
            res.json(block);
        } else {
            res.json({ error: 'Invalid block index' });
        }
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err)
    }
});

app.get('/all-txs', (req, res) => {
    try {
        res.json(node.getAllTxs());
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
});

app.get('/txs/:hash', (req, res) => {
    try {
        const txHash = req.params.hash;

        if (typeof txHash !== 'string' || /^[0-9a-f]{64}$/.test(txHash)) {
            res.json({ error: 'Invalid transaction hash' });
        }

        const allTxs = node.getAllTxs();
        const tx = allTxs.find(t => t.hash === txHash);
        res.json(tx);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
});

// not sure what this is for yet
app.get('/balances', (req, res) => {
    try {
        res.json(node.schoolChain.getConfirmedBalances());
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
});

app.get('/address-data/:address', (req, res) => {
    try {
        const address = req.params.address;

        // USE VALIDATION FILE FOR THIS
        if (typeof address !== 'string' || !(/^[0-9a-f]{40}$/.test(address))) {
            res.json({ error: 'Invalid address' });
        }

        const txHistory = node.getTxHistory(address);
        const balance = node.getBalance(address);
        res.json({ balance, txs: txHistory });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
});

app.post('/txs/send', (req, res) => {
    try {

    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
});


app.get('/peers', (req, res) => {
    try {
        res.json(node.peers.entries());
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
});

app.post('/peers/connect', async (req, res) => {
    try {
        const peer = req.body.peer;
        if (peer === undefined) res.json({ error: 'Missing "peer" in the form' });
        const peerInfo = await axios.get(peer + '/info');

        // Check whether connecting node is also the user's node
        if (node.nodeId === peerInfo.data.nodeId) {
            res.json({ error: 'Cannot connect to self' });
        // Check whether connecting node is already connected
        } else if (node.peers.get(peerInfo.data.nodeId)) {
            res.json({ error: `This node is already connected to peer: ${peer}` });
        } else {
            node.peers.set(peerInfo.data.nodeId, peer);
            node.syncChain(peerInfo.data);
            node.syncPendingTxs(peerInfo.data);
        }

        // res.json({ error: `Could not connect to peer: ${peer}` });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
});

app.post('/peers/new-block', (req, res) => {
    try {

    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
});

app.post('/mining/get-mining-job/:address', (req, res) => {
    try {

    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
});

app.post('/mining/submit-mined-block', (req, res) => {
    try {

    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
});

app.use((error, req, res, next) => {
    console.log(error);
    const message = error.message;
    res.status(error.statusCode || 500).json({ message });
});

app.listen(port, () => console.log(`Listening on port ${port}`));