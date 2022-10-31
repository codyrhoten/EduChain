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
                <Card>
                    <Card.Body>
                        <Card.Title>Block # {blockIndex}</Card.Title>
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>Timestamp</th>
                                    <th>Transactions</th>
                                    {/* <th>Mined by</th>
                                    <th>Reward</th> */}
                                    <th>Hash</th>
                                    <th>Nonce</th>
                                    <th>Previous Block Hash</th>
                                </tr>
                            </thead>
                            {block !== undefined && Object.keys(block).length > 0 &&
                                <tbody>
                                    <tr>
                                        <td>{formatTimestamp(block)}</td>
                                        <td>{block.txs.length}</td>
                                        {/* <td>{block.minedBy}</td> */}
                                        {/* <td>{block.reward}</td> */}
                                        <td>{block.hash}</td>
                                        <td>{block.nonce}</td>
                                        <td>{block.prevBlockHash}</td>
                                    </tr>
                                </tbody>
                            }
                        </Table>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default Block;