import { Card, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const LatestTxs = ({ latestTxs }) => {
    const shortenAddress = address => {
        let start = address.substring(0, 4);
        let end = address.substring(address.length - 4);
        return start + '...' + end;
    };

    return (
        <Col className='lg-6'>
            <Card className='text-center'>
                <Card.Body>
                    <Card.Title>Latest Transactions</Card.Title>
                    {latestTxs && latestTxs.map((tx, i) => {
                        return (
                            <Container key={i}>
                                <Row>
                                    <Col>
                                        Tx{' '}
                                        <Link to={`/tx/${tx.hash}`}>
                                            {tx.hash.substring(0, 12)}...
                                        </Link>
                                    </Col>
                                    <Col>
                                        From:{' '}
                                        <Link
                                            to={`/address/${tx.sender}`}
                                        >
                                            {shortenAddress(tx.sender)}
                                        </Link><br />
                                        To:{' '}
                                        <Link
                                            to={`/address/${tx.recipient}`}
                                        >
                                            {shortenAddress(tx.recipient)}
                                        </Link>
                                    </Col>
                                    <Col>{tx.amount} coins</Col>
                                </Row>
                                <br />
                            </Container>
                        );
                    })}
                    <Link to='transactions'>
                        See all transactions
                    </Link>
                </Card.Body>
            </Card>
        </Col>
    );
}

export default LatestTxs;