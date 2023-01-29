const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const NetworkNode = require('./networkNode.js');
const Blockchain = require('./blockchain.js');
const port = process.argv[2];
const nodeUrl = process.argv[3];
const valid = require('./validation.js');

const app = express();
const schoolChain = new Blockchain();
const node = new NetworkNode(nodeUrl, schoolChain);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

/* ---------------------API--------------------- */

app.get('/info', (req, res, next) => {
    try {
        res.json(node.getInfo());
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
});

app.get('/debug', (req, res, next) => {
    try {
        res.json(node.debug());
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
});

app.get('/debug/reset-chain', (req, res, next) => {
    try {
        node.schoolChain = new Blockchain();
        res.json({ message: 'The chain was reset to its genesis block' });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
});

app.get('/debug/mine/:minerAddress', (req, res, next) => {
    try {

    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
});

app.get('/blocks', (req, res, next) => {
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

app.get('/all-txs', (req, res, next) => {
    try {
        res.json(node.schoolChain.getAllTxs());
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
});

app.get('/pending-txs', (req, res, next) => {
    try {
        res.json(node.schoolChain.pendingTxs);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
});

app.get('/txs/:hash', (req, res, next) => {
    try {
        const txHash = req.params.hash;
        if (!valid.hash(txHash)) res.json({ error: 'Invalid transaction hash' });

        const allTxs = node.schoolChain.getAllTxs();
        const tx = allTxs.find(t => t.hash === txHash);
        res.json(tx);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
});

// not sure what this is for yet
app.get('/balances', (req, res, next) => {
    try {
        res.json(node.schoolChain.getConfirmedBalances());
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
});

app.get('/address-data/:address', (req, res, next) => {
    try {
        const address = req.params.address;
        if (!valid.address(address)) error('Invalid address');
        const txHistory = node.schoolChain.getTxHistory(address);
        const balance = node.schoolChain.getBalance(address);
        res.json({ balance, txs: txHistory });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
});

app.post('/txs/send', (req, res, next) => {
    try {
        console.log(req.body)
        const tx = node.schoolChain.addPendingTx(req.body, next);

        if (tx.hash) {
            node.notifyPeersOfTx(tx);
            res.status(201).json({ txHash: tx.hash });
        }
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
});


app.get('/peers', (req, res, next) => {
    try {
        res.json(node.peers.entries());
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
});

app.post('/peers/connect', async (req, res, next) => {
    try {
        const peer = req.body.peer;
        if (peer === '') res.json({ error: 'Missing peer URL in the form' });
        const peerInfo = await axios.get(peer + '/info');

        // Check whether connecting node is also the user's node
        if (node.nodeId === peerInfo.data.nodeId) {
            res.status(409).json({ error: 'Cannot connect to self' });
        // Check whether connecting node is already connected
        } else if (node.peers.get(peerInfo.data.nodeId)) {
            res.status(409).json({ error: `This node is already connected to peer: ${peer}` });
        } else {
            node.peers.set(peerInfo.data.nodeId, peer);
            node.syncChain(peerInfo.data, next);
            node.syncPendingTxs(peerInfo.data, next);
        }
    } catch (err) {
        next(err);
    }
});

app.post('/peers/new-block', (req, res, next) => {
    try {

    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
});

app.post('/mining/get-mining-job/:address', (req, res, next) => {
    try {

    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
});

app.post('/mining/submit-mined-block', (req, res, next) => {
    try {

    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
});

app.use((error, req, res) => {
    console.log(error);
    const message = error.message;
    res.status(error.statusCode || 500).json({ message });
});

app.listen(port, () => console.log(`Listening on port ${port}`));