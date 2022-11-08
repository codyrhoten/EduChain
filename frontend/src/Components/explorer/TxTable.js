import { Card, Table } from 'react-bootstrap';

const TxTable = ({ txs, heading }) => {
    return (
        <>
            <h4 align='center'>{heading}</h4>
            <Card>
                <Card.Body>
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
                                        <td>
                                            <Card.Link href={`/tx/${t.hash}`}>
                                                {t.hash.substring(0, 20)}...
                                            </Card.Link>
                                        </td>
                                        {/* <td>{tx.block}</td>
                                            <td>{t.timestamp}</td> */}
                                        {<td>
                                            {t.sender.substring(0, 20)}...
                                        </td>}
                                        <td>
                                            {t.recipient.substring(0, 20)}...
                                        </td>
                                        <td>{t.amount}</td>
                                        {/* <td>{t.fee}</td> */}
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </>
    )
}

export default TxTable;