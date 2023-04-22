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
            const _blocks = await axios.get('http://localhost:5555/blocks');
            setBlocks(_blocks.data.slice(0, 5));
        })();
    }, []);

    return (
        <>
            <Header navLinks={navLinks} />
            <Container style={{ marginTop: "7rem" }}>
                <h4 className='text-center my-4'><i>EduChain PoW Testnet Explorer</i></h4>
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
        </>
    );
};

export default AllBlocks;