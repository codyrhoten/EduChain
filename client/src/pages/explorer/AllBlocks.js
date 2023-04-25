import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Container, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import formatTimestamp from '../../utils/formatTimestamp';

const AllBlocks = ({ navLinks }) => {
    const [blocks, setBlocks] = useState([]);

    useEffect(() => {
        (async function () {
            try {
                const _blocks = await axios.get('http://localhost:5555/blocks');
                setBlocks(_blocks.data.slice(0, 5));
            } catch (err) {
                console.log(err.message);
                setBlocks(null)
            }
        })();
    }, []);

    const AllBlocksPg = () => {
        <Container className='mt-4'>
            <Card>
                <Card.Body>
                    <Card.Title>Blocks</Card.Title>
                    <Table>
                        <thead>
                            <tr>
                                <th>Index</th>
                                <th>Timestamp</th>
                                <th>Mined By</th>
                                <th>Transactions</th>
                                {/* <th>Reward</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {blocks.length > 0 &&
                                blocks.map((b, i) => (
                                    <tr key={i}>
                                        <td>
                                            <Link
                                                to={`/block/${b.index}`}
                                            >
                                                {b.index}
                                            </Link>
                                        </td>
                                        <td>{formatTimestamp(b.timestamp)}</td>
                                        <td>
                                            <Link
                                                to={`/address/${b.minedBy}`}
                                                style={{ textDecoration: 'none' }}
                                            >
                                                {b.minedBy}
                                            </Link>
                                        </td>
                                        <td>{b.txs.length}</td>
                                        {/* <td>{b.reward}</td> */}
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    };

    return (
        <>
            <Header navLinks={navLinks} />
            <h4 className='text-center' style={{ marginTop: "7rem" }}><i>EduChain PoW Testnet Explorer</i></h4>
            {blocks ? <AllBlocksPg /> : <h5 className='text-center mt-5'>There are not blocks in this chain yet.</h5>}
        </>
    );
};

export default AllBlocks;