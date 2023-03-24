import { Card, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import shortenAddress from '../../utils/shortenAddress';

const TxTable = ({ txs }) => {
    return (
        <Card>
            <Card.Body>
                <Table responsive>
                    <thead>
                        <tr>
                            <th>Hash</th>
                            {/* <th>Time</th> */}
                            <th>Status</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Amount</th>
                            {<th>Fee</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {txs.length > 0 &&
                            txs.map((t, i) => (
                                <tr key={i}>
                                    <td>
                                        <Link
                                            to={`/tx/${t.hash}`}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            {t.hash.substring(0, 20)}...
                                        </Link>
                                    </td>
                                    {/* <td>{t.timestamp}</td> */}
                                    <td>
                                        {
                                            t.minedInBlock !== undefined ?
                                                <b>Confirmed</b> :
                                                <i>Pending</i>
                                        }
                                    </td>
                                    <td>
                                        <Link
                                            to={`/address/${t.from}`}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            {shortenAddress(t.from, 6)}
                                        </Link>
                                    </td>
                                    <td>
                                        <Link
                                            to={`/address/${t.to}`}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            {shortenAddress(t.to, 6)}
                                        </Link>
                                    </td>
                                    <td>{t.amount} micro-EDU</td>
                                    <td>{t.fee} micro-EDU</td>
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