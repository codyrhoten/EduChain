import { useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import Header from '../../components/Header/Header';
import TxTable from '../../components/explorer/TxTable';

const Transactions = ({ navLinks }) => {
    const blockIndex = useLocation().state;
    const [txs, setTxs] = useState([]);
    const [heading, setHeading] = useState(null);

    useEffect(() => {
        (async function () {
            if (blockIndex) {
                const _block = await axios.get(`http://localhost:5555/blocks/${blockIndex}`);
                setTxs(_block.data.txs);

                setHeading(
                    <h4 align='center'>
                        <Link to={`/block/${blockIndex}`} style={{ textDecoration: 'none' }}>
                            Block {blockIndex}
                        </Link>
                        {' '}Transactions
                    </h4>
                );
            } else {
                try {
                    const txs = await axios.get('http://localhost:5555/all-txs');
                    setTxs(txs.data.reverse());
                    setHeading(<h4 align='center'>All Transactions</h4>);
                } catch (err) {
                    console.log(err.message);
                    setHeading(
                        <h5 align='center'>There are no transactions on this chain yet.</h5>
                    );
                }

            }
        })();
    }, [blockIndex]);

    return (
        <>
            <Header navLinks={navLinks} />
            <Container style={{ marginTop: "7rem" }}>
                <h4 className='text-center my-4'><i>EduChain PoW Testnet Explorer</i></h4>
                {heading}
                {txs.length > 0 && <TxTable txs={txs} />}
            </Container>
        </>
    );
};

export default Transactions;