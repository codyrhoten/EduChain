import { Col, Row, Container, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import formatTimestamp from '../../utils/formatTimestamp';

const LatestBlocks = ({ latestBlx }) => {    
     return (
        <Col className='lg-6'>
            <Card className='text-center'>
                <Card.Body>
                    <Card.Title>Latest Blocks</Card.Title>
                    {latestBlx.length > 0 && latestBlx.map((block, i) => (
                        <Container key={i}>
                            <Row>
                                <Col>
                                    Block{' '}
                                    <Link 
                                        to={`/block/${block.index}`}
                                        style={{ textDecoration: 'none' }}
                                    >
                                        # {block.index}
                                    </Link>
                                    <br />
                                    <i>{formatTimestamp(block)}</i>
                                </Col>
                                <Col>{block.data.length} Txs</Col>
                                {/* <Col>{block.minedBy}</Col> */}
                            </Row>
                            <br />
                        </Container>
                    ))}
                    <Link to='/blocks'>See all blocks</Link>
                </Card.Body>
            </Card>
        </Col>
    )
}

export default LatestBlocks;