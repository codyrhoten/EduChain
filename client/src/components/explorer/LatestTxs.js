import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import shortenAddress from '../../utils/shortenAddress';

const LatestTxs = () => {
    const [latestTxs, setLatestTxs] = useState([]);

    useEffect(() => {
        (async function () {
            const txs = await axios.get('http://localhost:5555/all-txs');
            setLatestTxs(txs.data.reverse().slice(0, 5));
        })();
    }, []);

    return (
        <Col className='lg-6'>
            <Card className='text-center h-100'>
                <Card.Body>
                    <Card.Title>Latest Transactions</Card.Title>
                    {latestTxs && latestTxs.map((tx, i) => {
                        return (
                            <Container key={i}>
                                <Row>
                                    <Col>
                                        Tx{' '}
                                        <Link 
                                            to={`/tx/${tx.hash}`}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            {tx.hash.substring(0, 12)}...
                                        </Link>
                                    </Col>
                                    <Col>
                                        From:{' '}
                                        <Link
                                            to={`/address/${tx.from}`}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            {shortenAddress(tx.from, 4)}
                                        </Link><br />
                                        To:{' '}
                                        <Link
                                            to={`/address/${tx.to}`}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            {shortenAddress(tx.to, 4)}
                                        </Link>
                                    </Col>
                                    <Col>{Number(tx.amount / 1000000)} EDU</Col>
                                </Row>
                                <br />
                            </Container>
                        );
                    })}
                    <Link to='/transactions'>
                        See all transactions
                    </Link>
                </Card.Body>
            </Card>
        </Col>
    );
}

export default LatestTxs;