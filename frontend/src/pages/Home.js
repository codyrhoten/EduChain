import Container from 'react-bootstrap/Container';
import SearchBar from "../components/SearchBar";
import Row from 'react-bootstrap/Row';
import LatestBlocks from "../components/LatestBlocks";
// dummy data
import blockchain from '../blockchain.json';

function Home() {
    let latestBlocks = blockchain.chain.slice(0, 5).reverse();

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