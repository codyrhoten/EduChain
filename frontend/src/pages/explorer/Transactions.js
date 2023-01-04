import { useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import Header from '../../components/Header';
import SearchBar from '../../components/explorer/SearchBar';
import TxTable from '../../components/explorer/TxTable';
// dummy data
import api from '../../dummyApi';

const Transactions = ({ navLinks }) => {
    const blockIndex = useLocation().state;
    const [txs, setTxs] = useState([]);
    const [heading, setHeading] = useState('');
    
    useEffect(() => {
        const blockchain = new api();

        if (blockIndex) {
            const _block = blockchain.getBlock(blockIndex);
            setTxs(_block.data);

            setHeading(
                <h4 align='center'>
                    <Link 
                        to={`/block/${blockIndex}`} 
                        style={{ textDecoration: 'none' }}
                    >
                        Block {blockIndex}
                    </Link>
                    {' '}Transactions
                </h4>
            );
        } else {
            setTxs(blockchain.getAllTxs().reverse());

            setHeading(
                <h4 align='center'>
                    All Transactions
                </h4>
            );
        }
    }, [blockIndex]);

    return (
        <>
            <Header navLinks={navLinks} />
            <Container>
                <SearchBar />
                {heading}
                {txs.length > 0 && <TxTable txs={txs} />}
            </Container>
        </>
    );
};

export default Transactions;