import Blockchain from './blockchain';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import uuid from 'uuid';

const port = 5555;
const schoolChain = new Blockchain();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

class NetworkNode {
    constructor(url, chain) {
        this.nodeId = uuid();
        this.url = url;
        this.peers = schoolChain.nodes.length;
    }
}

app.get('/', (req, res) => {

});

app.get('/info', (req, res) => {
    
});

app.get('/debug', (req, res) => {
    
});

app.get('/debug/debug/reset-chain', (req, res) => {
    
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

app.listen(port, function() { console.log(`Listening on port ${port}`) });