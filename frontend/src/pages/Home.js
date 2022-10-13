import Container from 'react-bootstrap/Container';
import SearchBar from "../components/SearchBar";
import Row from 'react-bootstrap/Row';
import LatestBlocks from '../components/LatestBlocks';
import LatestTxs from '../components/LatestTxs';
// dummy data
import blockchain from '../blockchain.json';

function Home() {
    let latestBlocks = blockchain.chain.slice(0, 5).reverse();
    let latestTxs = [];

    latestBlocks.forEach(block => {
        latestTxs.push(...block.txs.reverse());
        if (latestTxs.length > 4) return;
    });

    return (
        <Container className='postion-relative'>
            <SearchBar />
            <Row>
                <LatestBlocks blocks={latestBlocks} />
                <LatestTxs txs={latestTxs} />
            </Row>
        </Container>
    );
}

export default Home;