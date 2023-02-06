import Header from '../../components/Header/Header';
import { Container, Row } from 'react-bootstrap';
import LatestBlocks from '../../components/explorer/LatestBlocks';
import LatestTxs from '../../components/explorer/LatestTxs';

function ExplorerHome({ latestBlx, latestTxs, navLinks }) {
    return (
        <>
            <Header navLinks={navLinks} />
            <h4 className='text-center my-4'><i>School PoW Testnet Explorer</i></h4>
            <Container className='postion-relative'>
                <Row>
                    <LatestBlocks latestBlx={latestBlx} />
                    <LatestTxs latestTxs={latestTxs} />
                </Row>
            </Container>
        </>
    );
}

export default ExplorerHome;