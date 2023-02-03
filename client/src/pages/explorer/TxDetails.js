import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import SearchBar from '../../components/explorer/SearchBar';
import Header from '../../components/Header/Header';
import { Card, Container, Table } from 'react-bootstrap';
import formatTimestamp from '../../utils/formatTimestamp';

const TxDetails = ({ navLinks }) => {
    const { txHash } = useParams();
    const [tx, setTx] = useState({});

    useEffect(() => {
        (async function () {
            const tx = await axios.get(`http://localhost:5555/txs/${txHash}`);
            setTx(tx);
        })();
    }, [tx, txHash]);

    return (
        <>
            <Header navLinks={navLinks} />
            <Container>
                <SearchBar />
                <h4 align='center'>Transaction Details</h4>
                <Card>
                    <Card.Body>
                        {tx !== undefined && Object.keys(tx).length > 0 ?
                            <Table responsive>
                                <tbody>
                                    <tr>
                                        <th>Hash</th>
                                        <td>{tx.hash}</td>
                                    </tr>
                                    {<tr>
                                        <th>Status</th>
                                        <td>
                                            {tx.minedInBlock ? <i>Confirmed</i> : <i>Pending</i>}
                                        </td>
                                    </tr>}
                                    {tx.minedInBlock !== 'pending' &&
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
                                                        Number(tx.timeStamp)
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