const crypto = require("crypto");
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Header from "../components/Header";
import faucet from '../utils/faucetDetails.js';

const SHA256 = message => {
    return crypto.createHash("sha256").update(message).digest("hex");
};

function Faucet({ navLinks }) {
    const [faucet, setFaucet] = useState({});
    const [userAddress, setUserAddress] = useState('');
    const [txHash, setTxHash] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        setUserAddress(sessionStorage.getItem('address'));

        async function getBalance() {
            // let [balances] = await Promise.all()
            return 'Services not set up yet'
        }

        getBalance();
    }, []);

    const signTx = () => {
        const validAddress = /^[0-9a-f]{40}$/.test(userAddress);

        if (!validAddress) {
            setError('Invalid address');
            return;
        }

        let transaction = {
            from: faucet.fAddress,
            to: userAddress,
            amount: 3,
            gas: 0
        };

        let txJson = JSON.stringify(transaction);
        transaction.hash = SHA256(txJson);

        transaction.signature = faucet.fKeyPair.sign(transaction.hash);
        sendTx(transaction);
    };

    const sendTx = tx => {
        return `tx ${tx.hash} not sent because there's no node yet`;
    };

    return (
        <>
            <Header navLinks={navLinks} />
            <Container className='postion-relative'>
                <h1 >Faucet page</h1>
            </Container>
        </>
    );
}

export default Faucet;