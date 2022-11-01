import Header from '../../components/Header';
import { Card, Container, Table } from 'react-bootstrap';
import SearchBar from '../../components/explorer/SearchBar';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import formatTimestamp from '../../utils/formatTimestamp';

const Block = ({ blocks, navLinks }) => {
    const { blockIndex } = useParams();
    const [block, setBlock] = useState({});

    useEffect(() => {
        setBlock(blocks.find(b => b.index.toString() === blockIndex));
    }, [blocks, block, blockIndex]);

    console.log(blocks, block)

    return (
        <>
            <Header navLinks={navLinks} />
            <Container>
                <SearchBar />
                <h4 align='center'>Block # {blockIndex}</h4>
                <Card>
                    <Card.Body>
                        {/* <Card.Title>Block # {blockIndex}</Card.Title> */}
                        {block !== undefined && Object.keys(block).length > 0 &&
                            <Table responsive>
                                <tr>
                                    <th>Timestamp</th>
                                    <td>{formatTimestamp(block)}</td>
                                </tr>
                                <tr>
                                    <th>Transactions</th>
                                    <td>{block.txs.length}</td>
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
                            </Table>
                        }
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default Block;