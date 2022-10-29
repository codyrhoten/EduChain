import { Col, Row, Container, Card } from 'react-bootstrap';
import formatTimestamp from '../../utils/formatTimestamp';

const LatestBlocks = ({ latestBlx }) => {
     return (
        <Col className='lg-6'>
            <Card className='text-center'>
                <Card.Body>
                    <Card.Title>Latest Blocks</Card.Title>
                    {latestBlx && latestBlx.map((block, i) => (
                        <Container key={i}>
                            <Row>
                                <Col>
                                    Block <Card.Link href={`/block/${block.index}`}># {block.index}</Card.Link>
                                    <br />
                                    <i>{formatTimestamp(block)}</i>
                                </Col>
                                <Col>{block.txs.length} Txs</Col>
                                {/* <Col>{block.minedBy}</Col> */}
                            </Row>
                            <br />
                        </Container>
                    ))}
                    <Card.Link href='/blocks'>See all blocks</Card.Link>
                </Card.Body>
            </Card>
        </Col>
    )
}

export default LatestBlocks;