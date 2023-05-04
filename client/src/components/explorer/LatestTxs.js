import { useEffect, useState } from 'react';
import axios from 'axios';
import { config } from '../../environments';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import shortenAddress from '../../utils/shortenAddress';

const LatestTxs = () => {
    const siteUrl = config.apiUrl;
    const [latestTxs, setLatestTxs] = useState([]);

    useEffect(() => {
        (async function () {
            try {
                const txs = await axios.get(`${siteUrl}/all-txs`);
                setLatestTxs(txs.data.reverse().slice(0, 5));
            } catch (err) {
                console.log(err.message);
            }
        })();
    }, []);

    return (
        <Col className='lg-6'>
            <Card className='text-center h-100'>
                <Card.Body className='d-flex flex-column'>
                    <Card.Title className='mb-4'>Latest Transactions</Card.Title>
                    {latestTxs.length > 0 ?
                        latestTxs.map((tx, i) => {
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
                        }) :
                        <p className='mt-5'>There are no transactions in this chain yet.</p>
                    }
                    {latestTxs.length > 0 && <Link className='mt-auto' to='/transactions'>See all transactions</Link>}
                </Card.Body>
            </Card>
        </Col>
    );
}

export default LatestTxs;