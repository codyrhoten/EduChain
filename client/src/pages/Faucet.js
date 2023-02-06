import { useEffect, useRef, useState } from "react";
import { faucetAddress, faucetPrivKey, faucetPubKey, miningAddress } from '../utils/accounts.js';
import { sha256, sign } from '../utils/cryptography.js';
import axios from "axios";
import Header from "../components/Header/Header";
import { Button, Card, Col, Container, Form, InputGroup, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

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
        const addressData = await axios.get(`http://localhost:5555/address-data/${faucetAddress}`);
        setBalance(addressData.data.balance.confirmed);
    }

    useEffect(() => {
        searchInput.current.value = '';
        setFaucet(faucetAddress);
        getBalance();
    }, []);

    async function sendTx(tx) {
        try {
            const response = await fetch('http://localhost:5555/txs/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tx),
            });

            const data = await response.json();

            if (data.errorMsg) {
                setError(data.errorMsg);
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
        const inputAddress = searchInput.current.value;
        setSearch(inputAddress);
        const validAddress = /^[0-9a-f]{40}$/.test(inputAddress);

        if (!validAddress) {
            setError('Please enter a valid address');
            return;
        }

        let transaction = {
            from: faucetAddress,
            to: inputAddress,
            amount: 50,
            fee: 10,
            timestamp: Date.now(),
            senderPubKey: faucetPubKey
        };

        const txDataJson = JSON.stringify(transaction);
        transaction.hash = sha256(txDataJson);

        transaction.senderSig = sign(faucetPrivKey, transaction.hash);
        sendTx(transaction);
        setError('');
    };

    const handleClose = () => {
        searchInput.current.value = '';
        getBalance();
        setShow(false);
        setTxHash('');
    }

    return (
        <>
            <Header navLinks={navLinks} />
            <Container className='postion-relative'>
                <Modal show={show} onHide={handleClose} size='lg'>
                    <Modal.Header closeButton>
                        <Modal.Title>Transaction Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='text-break'>
                        <p className='text-center fs-5 m-0'>
                            We sent 50 coins to address{' '}
                            <Link
                                to={`/address/${search}`}
                                style={{ fontSize: '16px', textDecoration: 'none' }}
                            >
                                {search}
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
                    <h1>School Faucet</h1>
                    <Col className='lead'>
                        This faucet allows you to receive School coins for free.
                    </Col>
                    <Col className='fs-4'>available balance: {balance} coins</Col>
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