import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, InputGroup, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import _faucet from '../utils/faucetDetails.js';
const crypto = require("crypto");

const SHA256 = message => {
    return crypto.createHash("sha256").update(message).digest("hex");
};

function Faucet({ navLinks }) {
    const [faucet, setFaucet] = useState({});
    const [balance, setBalance] = useState(0);
    const [userAddress, setUserAddress] = useState('');
    const [show, setShow] = useState(false);
    const [txHash, setTxHash] = useState('');
    const handleShow = () => setShow(true);
    const [error, setError] = useState('');

    /* async  */function getBalance() {
        // make a call to server
        setBalance(100000); // set balance to result of server call
        return 'Services not set up yet'
    }

    useEffect(() => {
        setFaucet(_faucet);
        setUserAddress(sessionStorage.getItem('address'));
        getBalance();
    }, []);

    const handleClose = async () => {
        setUserAddress(sessionStorage.getItem('address'));
        // make a call to server
        /* let [balances] = 'backend call';
        let balance = 'result of backend call'; */

        getBalance();
        setShow(false);
        setTxHash('');
    };

    const signTx = () => {
        const validAddress = /^[0-9a-f]{40}$/.test(userAddress);

        console.log(validAddress)
        if (!validAddress) {
            setError('Please enter a valid address');
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
        handleShow();
        return `tx ${tx.hash} not sent because there's no node yet`;
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
                    </Modal.Body>
                </Modal>
                <Container align='center'>
                    <h1>Axiom Faucet</h1>
                    <Col className='lead'>
                        This faucet allows you to receive Axiom coins for free.
                    </Col>
                    <Col className='fs-4'>Available Balance: {balance} coins</Col>
                </Container>
                <Card>
                    <Card.Body>
                        {error && <p><i>{error}</i></p>}
                        <Form.Label
                            htmlFor='basic-url'
                            className='fs-5'
                        >
                            Recipient
                        </Form.Label>
                        <InputGroup>
                            <Form.Control
                                aria-label='Large'
                                id='basic-url'
                                placeholder='your address here'
                                defaultValue={userAddress}
                            />
                        </InputGroup>
                        {
                            !txHash &&
                            <Button
                                onClick={signTx}
                                className='p-2 mt-3 w-100 button-solid'
                                style={{
                                    backgroundColor: 'rgb(255, 223, 0)',
                                    color: 'black',
                                    border: '0px'
                                }}
                            >
                                Submit
                            </Button>
                        }
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
}

export default Faucet;