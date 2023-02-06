import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/Header/Header';
import { Card, Container, Table } from 'react-bootstrap';
import formatTimestamp from '../../utils/formatTimestamp';

const TxDetails = ({ navLinks }) => {
    const { txHash } = useParams();
    const [tx, setTx] = useState({});
    const [error, setError] = useState('')

    useEffect(() => {
        (async function () {
            const tx = await axios.get(`http://localhost:5555/txs/${txHash}`);
            setTx(tx.data);
            if (tx.data.errorMsg) setError(tx.data.errorMsg);
        })();
    }, []);

    return (
        <>
            <Header navLinks={navLinks} />
            <h4 className='text-center my-4'><i>School PoW Testnet Explorer</i></h4>
            <Container>
                <h4 align='center'>Transaction Details</h4>
                <Card>
                    <Card.Body>
                        {!error && tx !== undefined && Object.keys(tx).length > 0 ?
                            <Table responsive>
                                <tbody>
                                    <tr>
                                        <th>Hash</th>
                                        <td>{tx.hash}</td>
                                    </tr>
                                    {<tr>
                                        <th>Status</th>
                                        <td>
                                            {tx.minedInBlock !== undefined ? <b>Confirmed</b> : <i>Pending</i>}
                                        </td>
                                    </tr>}
                                    {tx.minedInBlock !== undefined &&
                                        <>
                                            <tr>
                                                <th>Block</th>
                                                <td>
                                                    <Link
                                                        to={`/block/${tx.minedInBlock}`}
                                                        style={{ textDecoration: 'none' }}
                                                    >
                                                        {tx.minedInBlock}
                                                    </Link>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Timestamp</th>
                                                <td>
                                                    {formatTimestamp(
                                                        Number(tx.timestamp)
                                                    )}
                                                </td>
                                            </tr>
                                        </>
                                    }
                                    <tr>
                                        <th>From</th>
                                        <td>
                                            <Link
                                                to={`/address/${tx.from}`}
                                                style={{ textDecoration: 'none' }}
                                            >
                                                {tx.from}
                                            </Link>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>To</th>
                                        <td>
                                            <Link
                                                to={`/address/${tx.to}`}
                                                style={{ textDecoration: 'none' }}
                                            >
                                                {tx.to}
                                            </Link>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Amount</th>
                                        <td>{tx.amount} SCH</td>
                                    </tr>
                                    <tr>
                                        <th>Fee</th>
                                        <td>{tx.fee} SCH</td>
                                    </tr>
                                </tbody>
                            </Table> :
                            <p align='center'><b>This transaction doesn't exist</b></p>
                        }
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default TxDetails;