import { Col, Row, Container, Card } from 'react-bootstrap';

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
                            <Container key={i}>
                                <Row>
                                    <Col>
                                        Block # {block.index}<br />
                                        <i>{getTimestamp(block)}</i>
                                    </Col>
                                    <Col>{block.txs.length} Txs</Col>
                                    {/* <Col>{block.minedBy}</Col> */}
                                </Row>
                                <br />
                            </Container>
                        );
                    })}
                </Card.Body>
            </Card>
        </Col>
    )
}

export default LatestBlocks;