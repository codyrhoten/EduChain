import { Card, Table } from 'react-bootstrap';

const TxTable = ({ txs, heading }) => {
    const shortenAddress = address => {
        let start = address.substring(0, 6);
        let end = address.substring(address.length - 6);
        return start + '...' + end;
    };

    return (
        <Card>
            <Card.Body>
                <Table responsive>
                    <thead>
                        <tr>
                            <th>Hash</th>
                            {/* <th>Time</th> */}
                            <th>From</th>
                            <th>To</th>
                            <th>Amount</th>
                            {/* {<th>Fee</th>} */}
                        </tr>
                    </thead>
                    <tbody>
                        {txs.length > 0 &&
                            txs.reverse().map((t, i) => (
                                <tr key={i}>
                                    <td>
                                        <Card.Link href={`/tx/${t.hash}`}>
                                            {t.hash.substring(0, 20)}...
                                        </Card.Link>
                                    </td>
                                    {/* <td>{t.timestamp}</td> */}
                                    <td>
                                        <Card.Link
                                            href={`/address/${t.sender}`}
                                        >
                                            {shortenAddress(t.sender)}
                                        </Card.Link>
                                    </td>
                                    <td>
                                        <Card.Link
                                            href={`/address/${t.recipient}`}
                                        >
                                            {shortenAddress(t.recipient)}
                                        </Card.Link>
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
    )
}

export default TxTable;