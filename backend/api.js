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
    res.json({ 'Node Info': node.getInfo() });
});

app.get('/debug', (req, res) => {
    res.json({ info: node.debug() });
});

app.get('/debug/reset-chain', (req, res) => {
    node.schoolChain = new Blockchain();
    res.json({ message: 'The chain was reset to its genesis block' });
});

app.get('/debug/mine/:minerAddress', (req, res) => {

});

app.get('/blocks', (req, res) => {

});

app.get('/blocks/:index', (req, res) => {
    const blockIndex = req.params.index;
    const block = schoolChain.getBlock(blockIndex);
    res.json({ block });
});

app.get('/txs/pending', (req, res) => {

});

app.get('/txs/confirmed', (req, res) => {

});

app.get('/txs/:hash', (req, res) => {

});

app.get('/balances', (req, res) => {

});

app.get('/address/:address/txs', (req, res) => {
    const address = req.params.address;
});

app.get('/address/:address/balance', (req, res) => {
    const address = req.params.address;
});

app.post('/txs/send', (req, res) => {

});


app.post('/peers', (req, res) => {

});

app.post('/peers/connect', (req, res) => {

});

app.post('/peers/notify-new-block', (req, res) => {

});

app.post('/mining/get-mining-job/:address', (req, res) => {

});

app.post('/mining/submit-mined-block', (req, res) => {

});

app.listen(port, () => console.log(`Listening on port ${port}`));