const crypto = require("crypto");
import { useEffect, useState } from "react";
import { Card, Col, Container, Form, InputGroup, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import faucet from '../utils/faucetDetails.js';

const SHA256 = message => {
    return crypto.createHash("sha256").update(message).digest("hex");
};

function Faucet({ navLinks }) {
    const [faucet, setFaucet] = useState({});
    const [userAddress, setUserAddress] = useState('');
    const [show, setShow] = useState(false);
    const [txHash, setTxHash] = useState('');
    const handleShow = () => setShow(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setUserAddress(sessionStorage.getItem('address'));

        async function getBalance() {
            // let [balances] = await Promise.all()
            return 'Services not set up yet'
        }

        getBalance();
    }, []);

    const handleClose = async () => {
        setUserAddress(sessionStorage.getItem('address'));

        let [balances] = 'backend call';
        let { balance } = 'result of backend call'; //  balances.data;

        setShow(false);
        setTxHash('');
    };

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

    const minNextBlock = () => {
        return 'Miner not yet set up';
    };

    return (
        <>
            <Header navLinks={navLinks} />
            <Container className='postion-relative'>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Transaction Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p align='center'>We sent 3 coins to address</p>
                        <p>
                            <Link to={`/address/${userAddress}`}>
                                {userAddress}
                            </Link>
                        </p>
                        <p>
                            tx:{' '}
                            <Link to={`/tx/${txHash}`}>{txHash}</Link>
                        </p>
                        {isMining && 
                            <img />
                        }
                    </Modal.Body>
                </Modal>
                <Container align='center'>
                    <h1>Faucet</h1>
                    <Col>
                        Axiom Faucet allows you to receive Axiom coins for free.
                    </Col>
                    <Col>Available Balance: {balance} coins</Col>
                </Container>
                <Card>
                    <Card.Header>Axiom Faucet</Card.Header>
                    <Card.Body>
                        <Form.Label htmlFor='basic-url'>Recipient</Form.Label>
                        <InputGroup>
                            <Form.Control
                                aria-label='Large'
                                id='basic-url'
                                placeholder='your address here'
                                defaultValue={userAddress}
                            />
                            {{/* Node selection
                                <Form.Label htmlFor='inputGroup1'></Form.Label>
                                    
                            */}}
                        </InputGroup>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
}

export default Faucet;