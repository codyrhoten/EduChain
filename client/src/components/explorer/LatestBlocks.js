import { Col, Row, Container, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import formatTimestamp from '../../utils/formatTimestamp';

const LatestBlocks = ({ latestBlx }) => {  
    const shortenAddress = address => {
        let start = address.substring(0, 4);
        let end = address.substring(address.length - 4);
        return start + '...' + end;
    };

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
                                    <i>
                                        {formatTimestamp(
                                            Number(block.timeStamp)
                                        )}
                                    </i>
                                </Col>
                                <Col>{block.transactions.length} Txs</Col>
                                <Col>
                                    Mined by {shortenAddress(block.minedBy)}
                                </Col>
                            </Row>
                            <br />
                        </Container>
                    ))}
                    <Link to='/blocks'>See all blocks</Link>
                </Card.Body>
            </Card>
        </Col>
    )
};

export default LatestBlocks;