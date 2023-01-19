import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import { Badge, Card, Container, Table } from 'react-bootstrap';
import SearchBar from '../../components/explorer/SearchBar';
import { useParams, Link } from 'react-router-dom';
import formatTimestamp from '../../utils/formatTimestamp';

const Block = ({ navLinks }) => {
    const { blockIndex } = useParams();
    const [block, setBlock] = useState({});

    useEffect(() => {
        (async function() {
            const blockchain = await axios.get('http://localhost:5555/blockchain');
            setBlock(blockchain.data.chain[blockIndex]);
        })();
    }, [block, blockIndex]);

    return (
        <>
            <Header navLinks={navLinks} />
            <Container>
                <SearchBar />
                <h4 align='center'>Block # {blockIndex}</h4>
                <Card>
                    <Card.Body>
                        {block !== undefined && Object.keys(block).length > 0 ?
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
                                            <Link
                                                to='/transactions'
                                                state={blockIndex}
                                            >
                                                <Badge
                                                    bg='light'
                                                    style={{ color: 'rgb(95,158,160)' }}
                                                >
                                                    {block.transactions.length}
                                                </Badge>
                                            </Link>
                                        </td>
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
                            </Table> :
                            <p align='center'><b>This block hasn't yet been mined...</b></p>
                        }
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default Block;