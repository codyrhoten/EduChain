import { useEffect, useRef, useState } from "react";
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
    const [show, setShow] = useState(false);
    const [txHash, setTxHash] = useState('');
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const searchInput = useRef();
    const handleShow = () => setShow(true);

    /* async  */function getBalance() {
        // make a call to server
        setBalance(balance - 3); // set balance to result of server call
    }

    useEffect(() => {
        searchInput.current.value = '';
        setFaucet(_faucet);
        setBalance(100000);
    }, []);

    const handleClose = () => {
        // make a call to server
        /* let [balances] = 'backend call';
        let balance = 'result of backend call'; */

        searchInput.current.value = '';
        getBalance();
        setShow(false);
        setTxHash('');
    }

    const signTx = () => {
        setSearch(searchInput.current.value);
        const validAddress = /^[0-9a-f]{40}$/.test(searchInput.current.value);

        if (!validAddress) {
            setError('Please enter a valid address');
            return;
        }

        let transaction = {
            from: faucet.fAddress,
            to: searchInput.current.value,
            amount: 3,
            gas: 0
        };

        let txJson = JSON.stringify(transaction);
        transaction.hash = SHA256(txJson);


        transaction.signature = faucet.fKeyPair.sign(transaction.hash);
        sendTx(transaction);
        setError('');
    };

    const sendTx = tx => {
        setTxHash(tx.hash);
        handleShow();
        console.log(`tx ${tx.hash} not sent because there's no node yet`);
    };

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
                            We sent 3 coins to address{' '}
                            <Link
                                to={`/address/${search}`}
                                style={{
                                    fontSize: '16px',
                                    textDecoration: 'none'
                                }}
                            >
                                {search}
                            </Link>
                        </p>
                        <p className='fs-5 text-center'>
                            tx:{' '}
                            <Link
                                to={`/tx/${txHash}`}
                                style={{
                                    fontSize: '16px',
                                    textDecoration: 'none'
                                }}
                            >
                                {txHash}
                            </Link>
                        </p>
                    </Modal.Body>
                </Modal>
                <Container align='center'>
                    <h1>Axiom Faucet</h1>
                    <Col className='lead'>
                        This faucet allows you to receive Axiom coins for free.
                    </Col>
                    <Col className='fs-4'>available balance: {balance} coins</Col>
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
                                ref={searchInput}
                                aria-label='Large'
                                id='basic-url'
                                placeholder='your address here'
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