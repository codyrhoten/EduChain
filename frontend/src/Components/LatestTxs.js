import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';

const LatestTxs = ({ txs }) => {
    const shortenAddress = address => {
        let start = address.split('').slice(0, 6).join('');
        let end = address.split('').slice(-6).join('');
        return start + '...' + end;
    }

    return (
        <Col className='lg-6'>
            <Card>
                <Card.Body>
                    <Card.Title>Latest Transactions</Card.Title>
                    {txs && txs.map((tx, i) => {
                        return (
                            <Container>
                                <Row key={i}>
                                    <Col>
                                        Tx {
                                            tx.hash
                                            /* .split('')
                                            .splice(0, 11) 
                                            .join('')
                                         */}
                                    </Col>
                                    <Col>
                                        From: {shortenAddress(tx.sender)}<br />
                                        To: {shortenAddress(tx.recipient)}
                                    </Col>
                                    <Col>{tx.amount} ETH</Col>
                                </Row>
                                <br />
                            </Container>
                        );
                    })}
                </Card.Body>
            </Card>
        </Col>
    );
}

export default LatestTxs;