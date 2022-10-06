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
                        <Row key={i}>
                            <Col>{block.myHash}</Col>
                            <Col>{block.index}</Col>
                            <Col>{block.transactions.length}</Col>
                        </Row>
                    })}
                </Card.Body>
            </Card>
        </Col>
    )
}