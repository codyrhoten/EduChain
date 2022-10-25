import Header from '../components/Header';
import { Container, Row } from 'react-bootstrap';
import SearchBar from "../components/SearchBar";
import LatestBlocks from '../components/explorer/LatestBlocks';
import LatestTxs from '../components/explorer/LatestTxs';


function Home ({ blocks, txs, navLinks }) {
    return (
        <>
            <Header navLinks={navLinks} />
            <Container className='postion-relative'>
                <SearchBar />
                <Row>
                    <LatestBlocks blocks={blocks} />
                    <LatestTxs txs={txs} />
                </Row>
            </Container>
        </>
    );
}

export default Home;