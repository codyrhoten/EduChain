import { useState, useRef } from 'react';
import { useWallet } from '../../wallet-context';
import { sha256, sign } from '../../utils/cryptography';
import axios from 'axios';
import { miningAddress } from '../../utils/accounts';
import { Container, Form, InputGroup, Modal } from 'react-bootstrap';
import Header from '../../components/Header/Header';
import { Link } from 'react-router-dom';

function SendTx({ navLinks }) {
    const [show, setShow] = useState(false);
    const [isSigned, setIsSigned] = useState(false);
    const [successTx, setSuccessTx] = useState(false);
    const [txHash, setTxHash] = useState('');
    const [error, setError] = useState('');
    const signedTx = useRef('');
    const recipient = useRef('');
    const amount = useRef(0);
    const fee = useRef(25);
    const { isLocked } = useWallet();
    const links = (isLocked === true) ? navLinks.locked : navLinks.unlocked;
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function handleClick() {
        handleShow();
        setSuccessTx(false);
        if (successTx) signedTx.current.value = '';
    }

    function signTx() {
        const validAddress = /^[0-9a-f]{40}$/.test(recipient.current);
        const validAmount = /^\d*\.?\d*$/.test(amount.current);

        if (!amount || !recipient) {
            setError('Make sure there is a recipient and an amount.');
            return;
        } else if (!validAddress) {
            setError('Please enter a valid address.');
            return;
        } else if (!validAmount) {
            setError('Please enter a valid amount.');
            return;
        } else {
            const transaction = {
                from: sessionStorage['address'],
                to: recipient.current,
                amount: Number(amount.current),
                fee: fee.current,
                timestamp: Date.now(),
                senderPubKey: sessionStorage['pubKey'],
            };

            const txDataJson = JSON.stringify(transaction);
            transaction.hash = sha256(txDataJson);
            transaction.senderSig = sign(sessionStorage['privKey'], transaction.hash);

            const txJson = JSON.stringify(transaction);
            signedTx.current.value = txJson;
            setIsSigned(true);
            setShow(false);
        }
    }

    async function sendTransaction() {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const response = await axios.post(
                `http://localhost:5555/txs/send`,
                signedTx,
                config
            );

            if (response.data.errorMsg) {
                setError(response.data.errorMsg);
                return;
            } else {
                setSuccessTx(true);
                mineBlock();
                recipient.current.value = '';
                amount.current.value = '';
                setIsSigned(false);
                setShow(false);
                setTxHash(response.data.txHash);
            }
        } catch (err) {
            console.log(err);
            setError('Transaction failed to send.');
        }
    }

    async function mineBlock() {
        try {
            const response = await axios.post(
                `http://localhost:5555/mine/${miningAddress}`,
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.data.errorMsg) {
                setError(`Mining Error: ${response.data.errorMsg}`);
            }

            console.log(response.data)
        } catch (err) {
            console.log(err);
            setError('Mining request failed.');
        }
    }

    return (
        <>
            <Header navLinks={links} />
            <Container className='text-center mt-3'>
                <h1 >Send Transaction</h1>
                <button
                    className='rounded mt-4 px-4 py-3 '
                    onClick={handleClick}
                    style={{
                        textDecoration: 'none',
                        color: 'black',
                        backgroundColor: 'rgb(255, 223, 0)',
                        fontFamily: 'Fragment Mono'
                    }}
                >
                    {isSigned ? 'Confirm transaction' : 'Create new transaction'}
                </button>
                <Modal show={show} onHide={handleClose} size='lg'>
                    <Modal.Header closebutton>
                        <Modal.Title>Transaction Requirements</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {error && <p><i>{error}</i></p>}
                        <InputGroup className='mb-3'>
                            <InputGroup.Text>Recipient</InputGroup.Text>
                            <Form.Control type='text' ref={recipient} />
                        </InputGroup>
                        <InputGroup className='mb-3'>
                            <InputGroup.Text>Amount</InputGroup.Text>
                            <Form.Control type='number' ref={amount} />
                        </InputGroup>
                        <InputGroup className='mb-3'>
                            <InputGroup.Text>Fee</InputGroup.Text>
                            <Form.Control readOnly ref={fee} value={fee.current} />
                        </InputGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            className='rounded mt-4 px-4 py-3 '
                            onClick={signTx}
                            style={{
                                textDecoration: 'none',
                                color: 'black',
                                backgroundColor: 'rgb(255, 223, 0)',
                                fontFamily: 'Fragment Mono'
                            }}
                        >
                            Sign transaction
                        </button>
                        {
                            isSigned && (
                                <button
                                    className='rounded mt-4 px-4 py-3 '
                                    onClick={sendTransaction}
                                    style={{
                                        textDecoration: 'none',
                                        color: 'black',
                                        backgroundColor: 'rgb(255, 223, 0)',
                                        fontFamily: 'Fragment Mono'
                                    }}
                                    disabled={!isSigned ? 'disabled' : ''}
                                >
                                    Send transaction
                                </button>
                            )
                        }
                    </Modal.Footer>
                </Modal>
                {
                    successTx && (
                        <>
                            <InputGroup className='my-3'>
                                <Form.Label htmlFor='signedTx'>Signature Details</Form.Label>
                                <Form.Control id='signedTx' as='textarea' readOnly ref={signedTx} />
                            </InputGroup>
                            <div className='text-center'>
                                <Link
                                    to={`/tx/${txHash}`}
                                    style={{ fontSize: '16px', textDecoration: 'none' }}
                                >
                                    {txHash}
                                </Link>
                            </div>
                        </>
                    )
                }
            </Container>
        </>
    );
}

export default SendTx;