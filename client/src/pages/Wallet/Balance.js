import { useEffect, useState } from "react";
import { useWallet } from '../../wallet-context';
import { Card, Container, Table } from "react-bootstrap";
import Header from "../../components/Header/Header";
import axios from "axios";

function Balance({ navLinks, setWalletStatus, walletStatus }) {
    const [confirmedBalance, setConfirmedBalance] = useState('0');
    const [pendingBalance, setPendingBalance] = useState('0');
    const [safeBalance, setSafeBalance] = useState('0');
    const { isLocked } = useWallet();
    const links = (isLocked === true) ? navLinks.locked : navLinks.unlocked;

    useEffect(() => {
        (async function() {
            const userAddress = sessionStorage['address'];
            const addressData = await axios.get(`http://localhost:5555/address-data/${userAddress}`);
            const { confirmed, pending, safe } = addressData.data.balance;
            setConfirmedBalance(confirmed);
            setPendingBalance(pending);
            setSafeBalance(safe);
        })();
    }, []);

    return (
        <>
            <Header navLinks={links} />
            <Container >
                <h1 className='text-center'>Your Balance</h1>
                <Card>
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
                                <td>{confirmedBalance}</td>
                                <td>Transactions have been mined and are on the blockchain</td>
                            </tr>
                            <tr>
                                <td>Safe</td>
                                <td>{safeBalance}</td>
                                <td>This balance is safe, as 5 blocks have been mined since its initial confirmation to the blockchain.</td>
                            </tr>
                            <tr>
                                <td>Pending</td>
                                <td>{pendingBalance}</td>
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