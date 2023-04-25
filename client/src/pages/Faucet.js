import { useEffect, useRef, useState } from "react";
import { faucetAddress, faucetPrivKey, faucetPubKey, miningAddress } from '../utils/accounts.js';
import { sha256, sign } from '../utils/cryptography.js';
import axios from "axios";
import Header from "../components/Header/Header";
import { Button, Card, Col, Container, Form, InputGroup, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import shortenAddress from "../utils/shortenAddress.js";

function Faucet({ navLinks }) {
    const [faucet, setFaucet] = useState({});
    const [balance, setBalance] = useState(0);
    const [show, setShow] = useState(false);
    const [txHash, setTxHash] = useState('');
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const searchInput = useRef('');
    const handleShow = () => setShow(true);

    async function getBalance() {
        try {
            const addressData = await axios.get(`http://localhost:5555/address-data/${faucetAddress}`);
            setBalance(addressData.data.balance.confirmed);
        } catch (err) {
            console.log(err.message);
        }
    }

    useEffect(() => {
        setFaucet(faucetAddress);
        getBalance();
    }, []);

    async function sendTx(tx) {
        try {
            let response = await fetch('http://localhost:5555/txs/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tx)
            });

            response = await response.json();

            if (response.errorMsg) {
                setError(response.errorMsg);
                return;
            } else {
                setTxHash(tx.hash);
                handleShow();
                mineBlock();
            }
        } catch (err) {
            console.log(err);
            setError('Transaction failed to send.');
        }
    };

    async function mineBlock() {
        try {
            const response = await axios.post(
                `http://localhost:5555/mine/${miningAddress}`,
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.data.errorMsg) {
                setError(`Mining Error: ${response.data.errorMsg}`);
            }
        } catch (err) {
            console.log(err);
            setError('Mining request failed.');
        }
    }

    const processTx = () => {
        const { value: recipient } = searchInput.current;
        setSearch(recipient);
        const validAddress = /^[0-9a-f]{40}$/.test(recipient);

        if (!validAddress) {
            setError('Please enter a valid address');
            return;
        }

        let transaction = {
            from: faucetAddress,
            to: recipient,
            amount: 5000000,
            fee: 1000,
            timestamp: Date.now(),
            senderPubKey: faucetPubKey
        };

        const txDataJson = JSON.stringify(transaction);
        transaction.hash = sha256(txDataJson);

        transaction.senderSig = sign(faucetPrivKey, transaction.hash);
        sendTx(transaction);
        setSearch(recipient);
        setError('');
    };

    const handleClose = () => {
        let { value: search } = searchInput.current;
        search = '';
        getBalance();
        setShow(false);
        setTxHash('');
    }

    return (
        <>
            <Header navLinks={navLinks} />
            <Container style={{ marginTop: "7rem" }}>
                <Modal show={show} onHide={handleClose} size='lg'>
                    <Modal.Header closeButton>
                        <Modal.Title>Transaction Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='text-break'>
                        <p className='text-center fs-5 m-0'>
                            We sent 5 EDU to address{' '}
                            <Link
                                to={`/address/${search}`}
                                style={{ fontSize: '16px', textDecoration: 'none' }}
                            >
                                {shortenAddress(search, 6)}
                            </Link>
                        </p>
                        <p className='fs-5 text-center'>
                            tx:{' '}
                            <Link
                                to={`/tx/${txHash}`}
                                style={{ fontSize: '16px', textDecoration: 'none' }}
                            >
                                {txHash}
                            </Link>
                        </p>
                    </Modal.Body>
                </Modal>
                <Container align='center'>
                    <h1><i>EduFaucet</i></h1>
                    <Col className='lead my-3'>
                        This faucet allows you to receive EduChain coins &#40;EDU&#41; for free.
                    </Col>
                    <Col className='fs-4 mb-4'>available balance: {Number(balance) / 1000000} EDU</Col>
                </Container>
                <Card>
                    <Card.Body>
                        {error && <p><i>{error}</i></p>}
                        <Form.Label htmlFor='basic-url' className='fs-5'>Recipient</Form.Label>
                        <InputGroup>
                            <Form.Control
                                ref={searchInput}
                                aria-label='Large'
                                id='basic-url'
                                placeholder='your address here'
                            />
                        </InputGroup>
                        {
                            !txHash &&
                            <Button
                                onClick={processTx}
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