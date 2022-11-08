import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { Card, Container, Table } from "react-bootstrap";
import SearchBar from "../../components/explorer/SearchBar";
// dummy data
import api from '../../dummyApi';

const Address = ({ navLinks }) => {
    const { address } = useParams();
    const [addressTxs, setAddressTxs] = useState({});

    useEffect(() => {
        const blockchain = new api();
        setAddressTxs(blockchain.getAddressHist(address));
    }, [address]);

    console.log(addressTxs.txs)

    return (
        <>
            <Header navLinks={navLinks} />
            <Container>
                <SearchBar />
                {addressTxs !== undefined
                    && Object.keys(addressTxs).length > 0 &&
                    <>
                        <h4 align='center'>Address: {addressTxs.address}</h4>
                        <Card>
                            <Card.Body>
                                Balance: {addressTxs.balance} coins
                            </Card.Body>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>Hash</th>
                                        {/* <th>Status</th> */}
                                        {/* <th>Block</th> */}
                                        <th>From</th>
                                        <th>To</th>
                                        <th>Amount</th>
                                        {/* {<th>Fee</th>} */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {addressTxs.txs.length > 0 &&
                                        addressTxs.txs.reverse().map((t, i) => (
                                            <tr key={i}>
                                                <td>
                                                    <Card.Link
                                                        href={`/tx/${t.hash}`}
                                                    >
                                                        {t.hash.substring(0, 20)}...
                                                    </Card.Link>
                                                </td>
                                                {/* <td>{tx.status}</td>
                                                {/* <td>{tx.block}</td> */}
                                                <td>
                                                    <Card.Link
                                                        href={`/address/${t.sender}`}
                                                    >
                                                        {t.sender.substring(0, 20)}...
                                                    </Card.Link>
                                                </td>
                                                <td>
                                                    <Card.Link
                                                        href={`/address/${t.recipient}`}
                                                    >
                                                        {t.recipient.substring(0, 20)}...
                                                    </Card.Link>
                                                </td>
                                                <td>{t.amount}</td>
                                                {/* <td>{t.fee}</td> */}
                                            </tr>
                                        ))
                                    }
                                </tbody>
                                {/* <tbody>
                                    {addressTxs.txs.length > 0 &&
                                        addressTxs.txs.forEach(tx => {
                                            for (const value in tx) {
                                                <tr>
                                                    <th>{value}</th>
                                                    <td>{tx[value]}</td>
                                                </tr>
                                            }
                                        })}
                                </tbody> */}
                            </Table>
                        </Card>
                    </>
                }
            </Container>
        </>
    );
};

export default Address;