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
    const peerNodeUrl = req.body.peer;
    let peerInfo = {};
    let response = {};

    if (peerNodeUrl === '' || undefined) {
        res.json({ errorMsg: 'Missing peer URL in the request body' });
    }

    try {
        response = await fetch(peerNodeUrl + '/info');
        peerInfo = await response.json();
        console.log(peerInfo)
    } catch (err) {
        res.json({ errorMsg: 'Cannot get peer info due to ' + err.message });
    }

    // Check whether connecting node is also the user's node
    if (node.id === peerInfo.id) {
        res.status(409).json({ errorMsg: 'Cannot connect to self' });
        // Check whether connecting node is already connected
    } else if (node.peers[peerInfo.id]) {
        res.status(409).json({ errorMsg: `This node is already connected to peer: ${peerNodeUrl}` });
    } else {
        node.peers[peerInfo.id] = peerNodeUrl;

        // 2-way connection between peers
        try {
            await fetch(
                `${peerNodeUrl}/peer/sync`, 
                { 
                    method: 'POST',    
                    body: JSON.stringify({ peer: node.url }), 
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        } catch (err) {
            res.status(400).json({ errorMsg: `Cannot connect other peer "${peerNodeUrl}" to this node` });
        }

        const chainSync = node.syncChain(peerInfo);
        if (chainSync.errorMsg) res.status(400).json(chainSync);

        const pendingTxsSync = node.syncPendingTxs(peerInfo);
        if (pendingTxsSync.errorMsg) res.status(400).json(pendingTxsSync);

        res.json({ msg: `Connected to peer: ${peerNodeUrl}` });
    }
});

app.post('/peer/sync', async (req, res, next) => {
    const peerNodeUrl = req.body.peer;
    let peerInfo = {};

    if (peerNodeUrl === '' || undefined) {
        res.json({ errorMsg: 'Missing peer node URL in the request body' });
    }

    try {
        const response = await fetch(peerNodeUrl + '/info');
        peerInfo = await response.json();

        // Check whether connecting node is also the user's node
        if (node.id === peerInfo.id) {
            res.status(409).json({ errorMsg: 'Cannot connect to self' });
            // Check whether connecting node is already connected
        } else if (node.peers[peerInfo.id]) {
            res.status(409).json({ errorMsg: `This node is already connected to peer: ${peer}` });
        } else {
            node.peers[peerInfo.id] = peerNodeUrl;

            const chainSync = node.syncChain(peerInfo);
            if (chainSync.errorMsg) res.status(400).json(chainSync);

            const pendingTxsSync = node.syncPendingTxs(peerInfo);
            if (pendingTxsSync.errorMsg) res.status(400).json(pendingTxsSync);

            res.json({ msg: `Also connected to peer: ${peerNodeUrl}` });
        }
    } catch (err) {
        res.status(400).json({ errorMsg: `Cannot connect to peer: ${peerNodeUrl}` });
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

app.post('/mine/:address', (req, res, next) => {
    try {
        const address = req.params.address;
        if (!valid.address(address)) res.json({ errorMsg: 'Invalid address' });
        const newBlock = node.schoolChain.mineBlock(address);

        if (newBlock.errorMsg) {
            res.status(400).json(newBlock);
        } else {
            res.json({ msg: `Block accepted. Reward of ${newBlock.txs[0].amount} micro-SCH paid to ${address}` });
            node.notifyPeersOfBlock();
        }
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
});

/* app.post('/mine', (req, res, next) => {
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
}); */

app.use((error, req, res, next) => {
    // console.log(error);
    const message = error.message;
    res.status(error.statusCode || 500).json({ message });
});

app.listen(port, () => console.log(`Listening on port ${port}`));