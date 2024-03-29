import { useEffect, useState } from 'react';
import axios from 'axios';
import { Col, Row, Container, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import formatTimestamp from '../../utils/formatTimestamp';
import shortenAddress from '../../utils/shortenAddress';
import { config } from '../../environments';

const LatestBlocks = () => {
    const siteUrl = config.apiUrl;
    const [latestBlx, setLatestBlx] = useState([]);

    useEffect(() => {
        (async function () {
            try {
                const blocks = await axios.get(`${siteUrl}/blocks`);
                setLatestBlx(blocks.data.slice(0, 5));
            } catch (err) {
                console.log(err.message);
            }
        })();
    }, []);

    return (
        <Col className='lg-6'>
            <Card className='text-center h-100'>
                <Card.Body className='d-flex flex-column'>
                    <Card.Title className='mb-4'>Latest Blocks</Card.Title>
                    {latestBlx.length > 0 ?
                        latestBlx.map((block, i) => (
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
                                        {<i>{formatTimestamp(block.timestamp)}</i>}
                                    </Col>
                                    <Col>{block.txs.length}{' '}{block.txs.length > 1 ? 'Txs' : 'Tx'}</Col>
                                    <Col>Mined by {shortenAddress(block.minedBy, 4)}</Col>
                                </Row>
                                <br />
                            </Container>
                        )) :
                        <p className='mt-5'>There are no blocks in this chain yet.</p>
                    }
                    {latestBlx.length > 0 && <Link className='mt-auto' to='/blocks'>See all blocks</Link>}
                </Card.Body>
            </Card>
        </Col>
    )
};

export default LatestBlocks;