import { Card, Container, Table } from 'react-bootstrap';
import SearchBar from '../../components/explorer/SearchBar';
import Header from '../../components/Header';
import formatTimestamp from '../../utils/formatTimestamp';

const AllTxs = ({ txs, navLinks }) => {

    console.log(txs)
    return (
        <>
            <Header navLinks={navLinks} />
            <Container>
                <SearchBar />
                <Card>
                    <Card.Body>
                        <Card.Title>Blocks</Card.Title>
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>Hash</th>
                                    {/* <th>Block</th>
                                    <th>Time</th> */}
                                    <th>From</th>
                                    <th>To</th>
                                    <th>Amount</th>
                                    {/* {<th>Fee</th>} */}
                                </tr>
                            </thead>
                            <tbody>
                                {txs.length > 0 &&
                                    txs.map((t, i) => (
                                        <tr key={i}>
                                            <td><Card.Link href={`/tx/${t.hash}`}>{t.hash.substring(0, 20)}...</Card.Link></td>
                                            {/* <td>{tx.block}</td>
                                            <td>{formatTimestamp(t.timestamp)}</td> */}
                                            {<td>{t.sender.substring(0, 20)}...</td>}
                                            <td>{t.recipient.substring(0, 20)}...</td>
                                            <td>{t.amount}</td>
                                            {/* <td>{t.fee}</td> */}
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default AllTxs;