import Container from 'react-bootstrap/Container';
import SearchBar from "../components/SearchBar";
import Row from 'react-bootstrap/Row';
import LatestBlocks from "../components/LatestBlocks";

function Home() {
    let blockchain = { "chain": [{ "index": 1, "timestamp": 1665105397672, "txs": [], "nonce": 0, "hash": "0", "prevBlockHash": "0" }, { "index": 2, "timestamp": 1665105644381, "txs": [{ "amount": 20, "recipient": "AKE43UT43FT3MU0FTQ8D2MUD0Q", "sender": "ADSFCA9W84UT9438TU0FTUMFT" }, { "amount": 50, "recipient": "ADSFCA9W84UT9438TU0FTUMFT", "sender": "AKE43UT43FT3MU0FTQ8D2MUD0Q" }, { "amount": 10, "recipient": "ADSFCA9W84UT9438TU0FTUMFT", "sender": "AKE43UT43FT3MU0FTQ8D2MUD0Q" }, { "amount": 20, "recipient": "alkjt8359o4eut3qmco4wut09mut0", "sender": "ADSFCA9W84UT9438TU0FTUMFT" }, { "amount": 100, "recipient": "ewoiuft0943muft430muft0tuq8ujh", "sender": "alkjt8359o4eut3qmco4wut09mut0" }], "nonce": 32835, "hash": "000051e514cd579a466fb09027a8535a04c7b33e6b59436535072305be9ecb90", "prevBlockHash": "0" }, { "index": 2, "timestamp": 1665105644381, "txs": [{ "amount": 20, "recipient": "AKE43UT43FT3MU0FTQ8D2MUD0Q", "sender": "ADSFCA9W84UT9438TU0FTUMFT" }, { "amount": 50, "recipient": "ADSFCA9W84UT9438TU0FTUMFT", "sender": "AKE43UT43FT3MU0FTQ8D2MUD0Q" }, { "amount": 10, "recipient": "ADSFCA9W84UT9438TU0FTUMFT", "sender": "AKE43UT43FT3MU0FTQ8D2MUD0Q" }, { "amount": 20, "recipient": "alkjt8359o4eut3qmco4wut09mut0", "sender": "ADSFCA9W84UT9438TU0FTUMFT" }, { "amount": 100, "recipient": "ewoiuft0943muft430muft0tuq8ujh", "sender": "alkjt8359o4eut3qmco4wut09mut0" }], "nonce": 32835, "hash": "000051e514cd579a466fb09027a8535a04c7b33e6b59436535072305be9ecb90", "prevBlockHash": "0" }], "nodes": [], "pendingTransactions": [] }
    let latestBlocks = blockchain.chain.slice(0, 5);

    // for (let i = 0; i < 5; i++) latestBlocks.push(blockchain.chain[i]);

    latestBlocks.reverse();

    return (
        <Container className='postion-relative'>
            <SearchBar />
            <Row>
                <LatestBlocks blocks={latestBlocks} />
            </Row>
        </Container>
    );
}

export default Home;