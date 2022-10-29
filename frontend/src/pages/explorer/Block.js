import Header from '../../components/Header';
import { Card, Container, Table } from 'react-bootstrap';
import SearchBar from '../../components/explorer/SearchBar';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Block = ({ blocks, navLinks }) => {
    const { blockIndex } = useParams();
    const [block, setBlock] = useState();

    useEffect(() => {
        setBlock(blocks.find(b => b.index === blockIndex));
    }, [blocks, blockIndex])

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
                                    <th>Mined by</th>
                                    <th>Reward</th>
                                    <th>Hash</th>
                                    <th>Nonce</th>
                                    <th>Previous Block Hash</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>{block.timestamp}</tr>
                                <tr>{block.txs.length}</tr>
                                {/* <tr>{block.minedBy}</tr>
                                <tr>{block.reward}</tr> */}
                                <tr>{block.hash}</tr>
                                {/* <tr>{block.nonce}</tr>
                                <tr>{block.getPrevBlockHash()}</tr> */}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default Block;