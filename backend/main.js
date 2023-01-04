const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { Blockchain, Transaction, Block } = require('./blockchain');
const port = 3333;

const blockchain = new Blockchain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/blockchain', (req, res) => {
    res.json(blockchain);
});

app.post('/transaction', (req, res) => {
    const newTx = new Transaction(
        req.body.from,
        req.body.to,
        req.body.amount,
        req.body.gas,
    );
    
    res.json({ newTx });
});

app.post('/sign', (req, res) => {

});


app.get('/mine', (req, res) => {

})