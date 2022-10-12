import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';

const LatestBlocks = ({ blocks }) => {
    const getTimestamp = _block => {
        let timestamp = new Date(_block.timestamp);
        let tz = timestamp.toTimeString().match(/\((.+)\)/)[1];
        tz = tz.match(/[A-Z]/g).join('');
        timestamp = timestamp.getDate() +
            '/' + (timestamp.getMonth() + 1) +
            '/' + timestamp.getFullYear() +
            ' ' + timestamp.getHours() +
            ':' + timestamp.getMinutes() +
            ':' + timestamp.getSeconds() +
            ' ' + tz;
        return timestamp;
    };

    return (
        <Col className='lg-6'>
            <Card>
                <Card.Body>
                    <Card.Title>Latest Blocks</Card.Title>
                    {blocks && blocks.map((block, i) => {
                        return (
                            <Container>
                                <Row key={i}>
                                    <Col>
                                        Block # {block.index}<br />
                                        <i>{getTimestamp(block)}</i>
                                    </Col>
                                    <Col>{block.txs.length}</Col>
                                </Row>
                                <br></br>
                            </Container>

                        );
                    })}
                </Card.Body>
            </Card>
        </Col>
    )
}

export default LatestBlocks;