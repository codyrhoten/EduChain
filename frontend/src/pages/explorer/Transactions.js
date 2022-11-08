import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Container } from 'react-bootstrap';
import Header from '../../components/Header';
import SearchBar from '../../components/explorer/SearchBar';
import TxTable from '../../components/explorer/TxTable';
// dummy data
import api from '../../dummyApi';
import { useEffect } from 'react';

const Transactions = ({ navLinks }) => {
    const blockIndex = useLocation().state;
    const blockchain = new api();
    const [txs, setTxs] = useState([]);
    const [heading, setHeading] = useState('');

    useEffect(() => {
        if (blockIndex !== null) {
            const _block = blockchain.getBlock(blockIndex);
            setTxs(_block.txs);
            setHeading(`Block ${blockIndex} Transactions`);
        } else {
            setTxs(blockchain.getAllTxs());
            setHeading('Transactions');
        }
    }, []);


    return (
        <>
            <Header navLinks={navLinks} />
            <Container>
                <SearchBar />
                {txs.length > 0 && <TxTable txs={txs} heading={heading}/>}
            </Container>
        </>
    );
};

export default Transactions;