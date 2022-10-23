import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Container, Row } from 'react-bootstrap';
import SearchBar from "../components/SearchBar";
import LatestBlocks from '../components/explorer/LatestBlocks';
import LatestTxs from '../components/explorer/LatestTxs';
// dummy data
import api from '../dummyApi';

function Home() {
    const [blocks, setBlocks] = useState([]);
    const [txs, setTxs] = useState([]);

    useEffect(() => {
        const data = api();
        setBlocks(data.latestBlx);
        setTxs(data.latestTxs);
    }, []);

    const navLinks = [
        { name: 'Wallet', url: '/wallet' },
        { name: 'Faucet', url: '/faucet' },
        { name: 'Miner', url: '/miner' },
    ];

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