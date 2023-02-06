import { Card, Container, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import formatTimestamp from '../../utils/formatTimestamp';

const AllBlocks = ({ blocks, navLinks }) => {
    return (
        <>
            <Header navLinks={navLinks} />
            <h4 className='text-center my-4'><i>School PoW Testnet Explorer</i></h4>
            <Container>
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