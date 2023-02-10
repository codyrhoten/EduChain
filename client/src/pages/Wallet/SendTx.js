import { useState, useRef } from 'react';
import { useWallet } from '../../wallet-context';
import { sha256, sign } from '../../utils/cryptography';
import axios from 'axios';
import { miningAddress } from '../../utils/accounts';
import { Container, Form, InputGroup, Modal, Row } from 'react-bootstrap';
import Header from '../../components/Header/Header';
import { Link } from 'react-router-dom';
import shortenAddress from '../../utils/shortenAddress';

function SendTx({ navLinks }) {
    const [show, setShow] = useState(false);
    const [isSigned, setIsSigned] = useState(false);
    const [txHash, setTxHash] = useState('');
    const [error, setError] = useState('');
    const [signedTx, setSignedTx] = useState(null);
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const recipientRef = useRef('');
    const amountRef = useRef(0);
    const [fee, setFee] = useState(0.0005);
    const { isLocked } = useWallet();
    const links = (isLocked === true) ? navLinks.locked : navLinks.unlocked;
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function signTx() {
        const { value: amount } = amountRef.current;
        const { value: recipient } = recipientRef.current;
        const validAddress = /^[0-9a-f]{40}$/.test(recipient);
        const validAmount = /^\d*\.?\d*$/.test(amount);

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
                to: recipient,
                amount: (Number(amount) * 1000000),
                fee: (Number(fee) * 1000000),
                timestamp: Date.now(),
                senderPubKey: sessionStorage['pubKey'],
            };

            const txDataJson = JSON.stringify(transaction);
            transaction.hash = sha256(txDataJson);
            transaction.senderSig = sign(sessionStorage['privKey'], transaction.hash);

            setSignedTx(transaction);
            setIsSigned(true);
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

        } catch (err) {
            console.log(err);
            setError('Mining request failed.');
        }
    }

    async function sendTransaction() {
        let { value: _recipient } = recipientRef.current;
        let { value: _amount } = amountRef.current;

        try {
            const config = { headers: { 'Content-Type': 'application/json' } };

            const response = await axios.post(
                `http://localhost:5555/txs/send`,
                signedTx,
                config,
            );

            mineBlock();
            setRecipient(_recipient);
            setAmount(_amount)
            _recipient = '';
            _amount = '';
            setIsSigned(false);
            handleShow();
            setTxHash(response.data.txHash);
        } catch (err) {
            console.log(err);
            setError(err.response.data.errorMsg);
        }
    }

    return (
        <>
            <Header navLinks={links} />
            <Container className='text-center mt-3'>
                <Modal show={show} onHide={handleClose} size='lg'>
                    <Modal.Header closeButton>
                        <Modal.Title>Transaction Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p className='text-center fs-5 m-0'>
                            <Link
                                to={`/address/${recipient}`}
                                style={{ fontSize: '18px', textDecoration: 'none' }}
                            >
                                {shortenAddress(sessionStorage['address'], 6)}
                            </Link>
                            {' '}sent {Number(amount) / 1000000} SCH to{' '}
                            <Link
                                to={`/address/${recipient}`}
                                style={{ fontSize: '18px', textDecoration: 'none' }}
                            >
                                {shortenAddress(recipient, 6)}
                            </Link>
                        </p>
                        <p className='fs-5 text-center'>
                            Tx hash:{' '}
                            <Link
                                to={`/tx/${txHash}`}
                                style={{ fontSize: '16px', textDecoration: 'none' }}
                            >
                                {txHash}
                            </Link>
                        </p>
                    </Modal.Body>
                </Modal>
                <h1><i>Send Transaction</i></h1>
                <p className='text-center mb-3'>Sign the transaction once the form is filled out. Then you may send the signed transaction to be mined and stored on School Chain.</p>
                {error && <p><i>{error}</i></p>}
                <InputGroup className='my-3'>
                    <InputGroup.Text>Recipient</InputGroup.Text>
                    <Form.Control type='text' ref={recipientRef} placeholder='address' />
                </InputGroup>
                <InputGroup className='mb-3'>
                    <InputGroup.Text>Amount</InputGroup.Text>
                    <Form.Control type='number' ref={amountRef} placeholder='0' />
                    <InputGroup.Text>SCH</InputGroup.Text>
                </InputGroup>
                <InputGroup className='mb-3'>
                    <InputGroup.Text>Fee</InputGroup.Text>
                    <Form.Control readOnly value={fee} />
                    <InputGroup.Text>SCH</InputGroup.Text>
                </InputGroup>
                <Row>
                    <button
                        className='rounded mt-4 px-4 py-3 '
                        onClick={signTx}
                        style={!isSigned ? {
                            textDecoration: 'none',
                            color: 'black',
                            backgroundColor: 'rgb(255, 223, 0)',
                            fontFamily: 'Fragment Mono'
                        } : {
                            textDecoration: 'none',
                            color: 'black',
                            backgroundColor: 'rgb(95,158,160)',
                            fontFamily: 'Fragment Mono'
                        }}
                        disabled={isSigned ? 'disabled' : ''}
                    >
                        {!isSigned ? 'Sign transaction' : 'Transaction Signed'}
                    </button>
                    <button
                        className='rounded mt-4 px-4 py-3 '
                        onClick={sendTransaction}
                        style={isSigned ? {
                            textDecoration: 'none',
                            color: 'black',
                            backgroundColor: 'rgb(255, 223, 0)',
                            fontFamily: 'Fragment Mono'
                        } : {
                            textDecoration: 'none',
                            color: 'black',
                            backgroundColor: 'rgb(95,158,160)',
                            fontFamily: 'Fragment Mono'
                        }}
                        disabled={isSigned ? '' : 'disabled'}
                    >
                        Send transaction
                    </button>
                </Row>
            </Container>
        </>
    );
}

export default SendTx;