import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Container, Row } from 'react-bootstrap';
import SearchBar from "../components/SearchBar";
import LatestBlocks from '../components/explorer/LatestBlocks';
import LatestTxs from '../components/explorer/LatestTxs';

function Home({ blocks, txs }) {
    const [latestBlx, setLatestBlx] = useState([]);
    const [latestTxs, setLatestTxs] = useState([]);

    const navLinks = [
        { name: 'Wallet', url: '/wallet' },
        { name: 'Faucet', url: '/faucet' },
        { name: 'Miner', url: '/miner' },
    ];

    const _blocks = blocks.slice(0, 5);
    const _txs = txs.slice(0, 5);
    
    useEffect(() => {
        setLatestBlx(_blocks);
        setLatestTxs(_txs);
    }, []);

    return (
        <>
            <Header navLinks={navLinks} />
            <Container className='postion-relative'>
                <SearchBar />
                <Row>
                    <LatestBlocks blocks={latestBlx} />
                    <LatestTxs txs={latestTxs} />
                </Row>
            </Container>
        </>
    );
}

export default Home;