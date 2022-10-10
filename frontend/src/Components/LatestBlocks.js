import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';

const LatestBlocks = ({ blocks }) => {
    return (
        <Col className='lg-6'>
            <Card>
                <Card.Body>
                    <Card.Title>Latest Blocks</Card.Title>
                    {blocks && blocks.map((block, i) => {
                        return (
                            <Row key={i}>
                                <Col>{block.hash}</Col>
                                <Col>{block.index}</Col>
                                <Col>{block.txs.length}</Col>
                            </Row>
                        );
                    })}
                </Card.Body>
            </Card>
        </Col>
    )
}

export default LatestBlocks;