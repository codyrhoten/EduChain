const express = require('express');
const cors = require('cors');
const { Blockchain, Transaction, Block } = require('./blockchain');
const port = 5555;

const blockchain = new Blockchain();

const confirmedTxs = () => {
    let txs = [];
    blockchain.chain.forEach(block => txs.push(...block.transactions));
    return txs;
};

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/info', (req, res) => {
    res.json({
        blocks: blockchain.chain.length,
        confirmedTxs: confirmedTxs(),
        pendingTxs: blockchain.pendingTxs
    });
});

app.get('/blockchain', (req, res) => {
    res.json(blockchain);
});

app.get('/allTxs', (req, res) => {
    let txs = confirmedTxs();
    txs.push(...blockchain.pendingTxs);
    res.json(txs);
});

app.get('/address/:address', (req, res) => {
    const address = req.params.address;
    const addressData = blockchain.getBalance(address);
    res.json({ addressData });
});

app.post('/transaction', (req, res) => {
    const newTx = req.body;
    blockchain.addPendingTx(newTx);
    res.json(newTx);
});

app.post('/sign', (req, res) => {

});


app.post('/mine', (req, res) => {
    
});

app.listen(port, function() { console.log(`Listening on port ${port}`) });