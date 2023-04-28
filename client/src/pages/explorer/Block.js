import { useEffect, useState } from 'react';
import axios from 'axios';
import { config } from '../../environments';
import Header from '../../components/Header/Header';
import { Badge, Card, Container, Table } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import formatTimestamp from '../../utils/formatTimestamp';

const Block = ({ navLinks }) => {
    const siteUrl = config.url;
    const { blockIndex } = useParams();
    const [block, setBlock] = useState({});

    useEffect(() => {
        (async function () {
            const _block = await axios.get(`${siteUrl}/blocks/${blockIndex}`);
            setBlock(_block.data);
        })();
    }, [blockIndex]);

    return (
        <>
            <Header navLinks={navLinks} />
            <Container style={{ marginTop: "7rem" }}>
                <h4 className='text-center my-4'><i>EduChain PoW Testnet Explorer</i></h4>
                <h4 className='text-center mb-4'>Block # {blockIndex}</h4>
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
                            <h5 className='text-center mt-4'>This block hasn't yet been mined...</h5>
                        }
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default Block;