import Header from '../../components/Header';
import { Badge, Card, Container, Table } from 'react-bootstrap';
import SearchBar from '../../components/explorer/SearchBar';
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import formatTimestamp from '../../utils/formatTimestamp';
// dummy data
import api from '../../dummyApi';

const Block = ({ navLinks }) => {
    const { blockIndex } = useParams();
    const [block, setBlock] = useState({});

    useEffect(() => {
        const blockchain = new api();
        setBlock(blockchain.getBlock(blockIndex));
    }, [block, blockIndex]);


    return (
        <>
            <Header navLinks={navLinks} />
            <Container>
                <SearchBar />
                <h4 align='center'>Block # {blockIndex}</h4>
                {block !== undefined && Object.keys(block).length > 0 &&
                    <Card>
                        <Card.Body>
                            <Table responsive>
                                <tbody>
                                    {/* <tr>
                                        <th>Status</th>
                                        <td>{block.status}</td>
                                    </tr> */}
                                    <tr>
                                        <th>Timestamp</th>
                                        <td>{formatTimestamp(block)}</td>
                                    </tr>
                                    <tr>
                                        <th>Transactions</th>
                                        <td>
                                            <Badge bg='light' style={{ color: 'rgb(95,158,160)' }}>
                                                <Link 
                                                    to='/transactions'
                                                    state={blockIndex}
                                                >
                                                    {block.txs.length}
                                                </Link>
                                            </Badge></td>
                                    </tr>
                                    {/* <tr>
                                        <th>Mined by</th>
                                        <td>{block.minedBy}</td>
                                    </tr>
                                    <tr>
                                        <th>Reward</th>
                                        <td>{block.reward}</td>
                                    </tr> */}
                                    <tr>
                                        <th>Hash</th>
                                        <td>{block.hash}</td>
                                    </tr>
                                    <tr>
                                        <th>Nonce</th>
                                        <td>{block.nonce}</td>
                                    </tr>
                                    <tr>
                                        <th>Previous Block Hash</th>
                                        <td>{block.prevBlockHash}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                }
            </Container>
        </>
    );
};

export default Block;