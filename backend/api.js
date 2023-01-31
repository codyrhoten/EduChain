const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const NetworkNode = require('./networkNode.js');
const Blockchain = require('./blockchain.js');
const port = process.argv[2];
const nodeUrl = process.argv[3];
const axios = require('axios');
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
            res.json({ errorMsg: 'Invalid block index' });
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
        if (!valid.hash(txHash)) res.json({ errorMsg: 'Invalid transaction hash' });

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
        if (!valid.address(address)) return { errorMsg: 'Invalid address' };
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
        const tx = node.schoolChain.addPendingTx(req.body);

        if (tx.errorMsg) {
            res.status(400).json(tx);
        } else {
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
        res.json(node.peers);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
});

app.post('/peers/connect', async (req, res, next) => {
    const peer = req.body.peer;
    if (peer === '' || undefined) res.json({ errorMsg: 'Missing peer URL in the form' });

    try {
        const peerInfo = await axios.get(peer + '/info');

        // Check whether connecting node is also the user's node
        if (node.id === peerInfo.data.id) {
            res.status(409).json({ errorMsg: 'Cannot connect to self' });
            // Check whether connecting node is already connected
        } else if (node.peers[peerInfo.data.id]) {
            res.status(409).json({ errorMsg: `This node is already connected to peer: ${peer}` });
        } else {
            node.peers[peerInfo.data.id] = peer;

            // 2-way connection between peers
            axios.post(`${peer}/peers/complete-connection`, { peer: node.url });

            const chainSync = node.syncChain(peerInfo.data);
            if (chainSync.errorMsg) res.status(400).json(chainSync);

            const pendingTxsSync = node.syncPendingTxs(peerInfo.data);
            if (pendingTxsSync.errorMsg) res.status(400).json(pendingTxsSync);

            res.json({ msg: `Connected to peer: ${peer}`});
        }
    } catch (err) {
        res.status(400).json({ errorMsg: `Cannot connect to peer: ${peer}`});
        next(err);
    }
});

app.post('/peers/complete-connection', async (req, res, next) => {
    const peer = req.body.peer;
    if (peer === '' || undefined) res.json({ errorMsg: 'Missing peer URL in the form' });

    try {
        const peerInfo = await axios.get(peer + '/info');

        // Check whether connecting node is also the user's node
        if (node.id === peerInfo.data.id) {
            res.status(409).json({ errorMsg: 'Cannot connect to self' });
            // Check whether connecting node is already connected
        } else if (node.peers[peerInfo.data.id]) {
            res.status(409).json({ errorMsg: `This node is already connected to peer: ${peer}` });
        } else {
            node.peers[peerInfo.data.id] = peer;
            res.json({ msg: `Also connected to peer: ${peer}`});
        }
    } catch (err) {
        res.status(400).json({ errorMsg: `Cannot connect to peer: ${peer}`});
        next(err);
    }
});

app.post('/peers/new-block', (req, res, next) => {
    try {
        node.syncChain(req.body);
        res.json({ msg: 'Thank you for the notification' });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
});

app.post('/mining/get-mining-job/:address', (req, res, next) => {
    try {
        const address = req.params.address;
        if (!valid.address(address)) return { errorMsg: 'Invalid address' };
        const blockCandidate = node.schoolChain.getMiningJob(address);

        res.json({
            index: blockCandidate.index,
            txsIncluded: blockCandidate.txs,
            expectedReward: blockCandidate.txs[0].amount,
            rewardAddress: address,
            blockDataHash: blockCandidate.dataHash
        });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
});

app.post('/mine', (req, res, next) => {
    try {
        const { blockDataHash, blockHash } = req.body;
        const newBlock = node.schoolChain.mineBlock(blockDataHash, blockHash);

        if (newBlock.errorMsg) {
            res.status(400).json(newBlock);
        } else {
            res.json({ msg: `Block accepted. Reward paid: ${newBlock.txs[0].amount} microcoins`});
            node.notifyPeersOfBlock();
        }
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