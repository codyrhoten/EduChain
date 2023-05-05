import { useEffect, useState } from "react";
import axios from "axios";
import { config } from '../../environments';
import { Card, Container, Table } from "react-bootstrap";
import Header from "../../components/Header/Header";

function Balance() {
    const siteUrl = config.apiUrl;
    const [confirmedBalance, setConfirmedBalance] = useState('0');
    const [pendingBalance, setPendingBalance] = useState('0');
    const [safeBalance, setSafeBalance] = useState('0');

    useEffect(() => {
        (async function () {
            try {
                const userAddress = sessionStorage['address'];
                const addressData = await axios.get(`${siteUrl}/address-data/${userAddress}`);
                const { confirmed, pending, safe } = addressData.data.balance;
                setConfirmedBalance(confirmed);
                setPendingBalance(pending);
                setSafeBalance(safe);
            } catch (err) {
                console.log(err.message);
            }
        })();
    }, []);

    return (
        <>
            <Header />
            <Container style={{ marginTop: "7rem" }}>
                <p align="left">Address: <i>{sessionStorage['address']}</i></p>
                <p align="left">Public Key: <i>{sessionStorage['pubKey']}</i></p>
                <Card className="mt-5">
                    <Table>
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Balance</th>
                                <th>Info</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Confirmed</td>
                                <td>{Number(confirmedBalance) / 1000000} EDU</td>
                                <td>Transactions have been mined and are on the blockchain</td>
                            </tr>
                            <tr>
                                <td>Safe</td>
                                <td>{Number(safeBalance) / 1000000} EDU</td>
                                <td>This balance is safe, as 3 blocks have been mined since its initial confirmation to the blockchain.</td>
                            </tr>
                            <tr>
                                <td>Pending</td>
                                <td>{Number(pendingBalance) / 1000000} EDU</td>
                                <td>This balance will be confirmed once the next block is mined.</td>
                            </tr>
                        </tbody>
                    </Table>
                </Card>
            </Container>
        </>
    );
}

export default Balance;