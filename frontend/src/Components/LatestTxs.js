import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';

const LatestTxs = ({ txs }) => {
    const shortenAddress = address => {
        let start = address.substring(0, 6);
        let end = address.substring(address.length - 6);
        return start + '...' + end;
    };
/* CHANGE TXS IN BLOCKCHAIN.JSON TO HAVE ONLY LOWERCASE HASHES */
    return (
        <Col className='lg-6'>
            <Card>
                <Card.Body>
                    <Card.Title>Latest Transactions</Card.Title>
                    {txs && txs.map((tx, i) => {
                        return (
                            <Container key={i}>
                                <Row>
                                    <Col>
                                        Tx {tx.hash.substring(0, 8)}...
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