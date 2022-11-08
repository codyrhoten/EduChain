import Header from '../../components/Header';
import { Card, Container, Table } from 'react-bootstrap';
import SearchBar from '../../components/explorer/SearchBar';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import formatTimestamp from '../../utils/formatTimestamp';
// dummy data
import api from '../../dummyApi';

const TxDetails = ({ navLinks }) => {
    const { txHash } = useParams();
    const [tx, setTx] = useState({});

    useEffect(() => {
        const blockchain = new api();
        const txs = blockchain.getAllTxs();
        setTx(txs.find(t => t.hash === txHash));
    }, [tx, txHash]);

    return (
        <>
            <Header navLinks={navLinks} />
            <Container>
                <SearchBar />
                <h4 align='center'>Transaction Details</h4>
                <Card>
                    <Card.Body>
                        {tx !== undefined && Object.keys(tx).length > 0 &&
                            <Table responsive>
                                <tbody>
                                    <tr>
                                        <th>Hash</th>
                                        <td>{tx.hash}</td>
                                    </tr>
                                    {/* <tr>
                                        <th>Status</th>
                                        <td>{block.status}</td>
                                    </tr>
                                    <tr>
                                        <th>Block</th>
                                        <td>{tx.block}</td>
                                    </tr>
                                    <tr>
                                        <th>Timestamp</th>
                                        <td>{formatTimestamp(tx)}</td>
                                    </tr> */}
                                    <tr>
                                        <th>From</th>
                                        <td>{tx.sender}</td>
                                    </tr>
                                    <tr>
                                        <th>To</th>
                                        <td>{tx.recipient}</td>
                                    </tr>
                                    <tr>
                                        <th>Amount</th>
                                        <td>{tx.amount} coins</td>
                                    </tr>
                                    {/* <tr>
                                        <th>Fee</th>
                                        <td>{tx.fee} coins</td>
                                    </tr> */}
                                </tbody>
                            </Table>
                        }
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default TxDetails;