import { useRef, useState } from 'react';
import { useWallet } from '../../wallet-context';
import { keyPairFromPrivKey, createWallet } from '../../utils/cryptography';
import { Container, Col, Form } from 'react-bootstrap';
import Header from '../../components/Header/Header';
import Button from '../../components/Button';

function Open() {
    const [isOpen, setIsOpen] = useState(false);
    const userPrivateKey = useRef();
    const [error, setError] = useState('');
    const { isLocked, changeWalletState } = useWallet();

    function displayWallet() {
        if (!isLocked) {
            return (
                <>
                    <p><i>Private Key:</i> {sessionStorage['privKey']}</p>
                    <br />
                    <p><i>Address:</i> {sessionStorage['address']}</p>
                </>
            );
        }
    }

    function handleSubmit() {
        if (userPrivateKey.current.value === '') {
            setError('Please enter a private key.');
        } else if (!(/^[0-9a-f]{64}$/.test(userPrivateKey.current.value))) {
            setError('Please enter a valid private key.');
        } else {
            const keyPair = keyPairFromPrivKey(userPrivateKey.current.value);
            const wallet = createWallet(keyPair);
            sessionStorage['privKey'] = wallet.privKey;
            sessionStorage['pubKey'] = wallet.pubKey;
            sessionStorage['address'] = wallet.address;
            changeWalletState(false);
            setIsOpen(true);
        }
    }

    return (
        <>
            <Header />
            <Container className='text-center' style={{ marginTop: "7rem" }}>
                <h1 className='mt-3'><i>Open Wallet</i></h1>
                {
                    !isOpen ? (
                        <>
                            <Col className='p-5'>
                                <div className='px-5'>
                                    <p className='px-5'>
                                        EduWallet is used to hold, send and receive EduChain Coins &#40;EDU&#41;. Open it to start sending transactions and view your balance.
                                    </p>
                                </div>
                            </Col>
                            {isLocked && (
                                <>
                                    {error && <p><i>{error}</i></p>}
                                    <Form.Control 
                                        className='mb-5' 
                                        placeholder='Enter the private key of your wallet'
                                        ref={userPrivateKey}
                                    />
                                    <Button title="Open Wallet" clickHandler={handleSubmit} />
                                </>

                            )}
                        </>
                    ) : (
                        <>
                            <button
                                className='rounded my-3 px-4 py-3'
                                style={{
                                    textDecoration: 'none',
                                    color: 'black',
                                    backgroundColor: 'rgb(255, 255, 51)',
                                }}
                                disabled
                            >
                                Wallet opened successfully!
                            </button>
                            <div className='mt-2'>{displayWallet()}</div>
                        </>
                    )
                }
            </Container>
        </>
    );
}

export default Open;