import { Card, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const TxTable = ({ txs }) => {
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
                                        <Link to={`/tx/${t.hash}`}>
                                            {t.hash.substring(0, 20)}...
                                        </Link>
                                    </td>
                                    {/* <td>{t.timestamp}</td> */}
                                    <td>
                                        <Link
                                            to={`/address/${t.sender}`}
                                        >
                                            {shortenAddress(t.sender)}
                                        </Link>
                                    </td>
                                    <td>
                                        <Link
                                            to={`/address/${t.recipient}`}
                                        >
                                            {shortenAddress(t.recipient)}
                                        </Link>
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