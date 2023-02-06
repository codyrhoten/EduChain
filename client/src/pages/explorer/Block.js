import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/Header/Header';
import { Badge, Card, Container, Table } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import formatTimestamp from '../../utils/formatTimestamp';

const Block = ({ navLinks }) => {
    const { blockIndex } = useParams();
    const [block, setBlock] = useState({});

    useEffect(() => {
        (async function () {
            const _block = await axios.get(`http://localhost:5555/blocks/${blockIndex}`);
            setBlock(_block.data);
        })();
    }, [blockIndex]);

    return (
        <>
            <Header navLinks={navLinks} />
            <h4 className='text-center my-4'><i>School PoW Testnet Explorer</i></h4>
            <Container>
                <h4 align='center'>Block # {blockIndex}</h4>
                <Card>
                    <Card.Body>
                        {block !== undefined && Object.keys(block).length > 0 ?
                            <Table responsive>
                                <tbody>
                                    <tr>
                                        <th>Timestamp</th>
                                        <td>{formatTimestamp(block.timestamp)}</td>
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
                                                    {block.txs.length}
                                                </Badge>
                                            </Link>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Mined by</th>
                                        <td>
                                            <Link
                                                to={`/address/${block.minedBy}`}
                                                style={{ textDecoration: 'none' }}
                                            >
                                                {block.minedBy}
                                            </Link>
                                        </td>
                                    </tr>
                                    {/* <tr>
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