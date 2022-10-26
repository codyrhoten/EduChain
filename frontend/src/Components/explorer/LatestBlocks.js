import { Col, Row, Container, Card } from 'react-bootstrap';

const LatestBlocks = ({ latestBlx }) => {
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

    console.log(latestBlx)

    return (
        <Col className='lg-6'>
            <Card className='text-center'>
                <Card.Body>
                    <Card.Title>Latest Blocks</Card.Title>
                    {latestBlx && latestBlx.map((block, i) => (
                        <Container key={i}>
                            <Row>
                                <Col>
                                    Block # {block.index}
                                    <br />
                                    <i>{getTimestamp(block)}</i>
                                </Col>
                                <Col>{block.txs.length} Txs</Col>
                                {/* <Col>{block.minedBy}</Col> */}
                            </Row>
                            <br />
                        </Container>
                    ))}
                    <Card.Link href='/all-blocks'>See all blocks</Card.Link>
                </Card.Body>
            </Card>
        </Col>
    )
}

export default LatestBlocks;