const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Blockchain, Transaction, Block } = require('./blockchain');
const port = 3333;

const blockchain = new Blockchain();

const confirmedTxs = () => {
    let txs = [];
    
    blockchain.chain.forEach(block => {
        txs.push(...block.data);
    });
    
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
        pendingTxs: blockchain.pendingTransactions
    });
});

app.get('/blockchain', (req, res) => {
    res.json(blockchain);
});

app.get('/allTxs', (req, res) => {
    let txs = confirmedTxs();
    txs.push(...blockchain.transaction);
    res.json(txs);
});

app.post('/transaction', (req, res) => {
    const newTx = req.body;
    blockchain.addTransaction(newTx);
    res.json(newTx);
});

app.post('/sign', (req, res) => {

});


app.post('/mine', (req, res) => {
    
});

app.listen(port, function() {
    console.log(`Listening on port ${port}`);
});