import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Container, Row } from 'react-bootstrap';
import SearchBar from "../components/SearchBar";
import LatestBlocks from '../components/explorer/LatestBlocks';
import LatestTxs from '../components/explorer/LatestTxs';
// dummy data
import blockchain from '../blockchain.json';

function Home() {
    const [blocks, setBlocks] = useState([]);
    const [txs, setTxs] = useState([]);

    const navLinks = [
        { name: 'Wallet', url: '/wallet' },
        { name: 'Faucet', url: '/faucet' },
        { name: 'Miner', url: '/miner' },
    ];

    useEffect(() => {
        let latestBlocks = blockchain.chain.reverse().slice(0, 5);
        let latestTxs = [];

        latestBlocks.forEach(block => {
            if (latestTxs.length > 4) return;
            latestTxs.push(...block.txs.reverse());
        });

        latestTxs = latestTxs.slice(0, 5);
        setBlocks(latestBlocks);
        setTxs(latestTxs);
    }, []);

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