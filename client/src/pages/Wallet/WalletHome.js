import { useState } from "react";
import { useWallet } from '../../wallet-context';
import { generateKeyPair, createWallet } from '../../utils/cryptography.js';
import { Container, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";

function WalletHome({ setWalletStatus }) {
    const { isLocked, changeWalletState } = useWallet();
    const [isCreated, setIsCreated] = useState(false);

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

    function handleClick() {
        const keyPair = generateKeyPair();
        const wallet = createWallet(keyPair);
        sessionStorage['privKey'] = wallet.privKey;
        sessionStorage['pubKey'] = wallet.pubKey;
        sessionStorage['address'] = wallet.address;
        changeWalletState(false);
        setIsCreated(true);
    }

    return (
        <>
            <Header/>
            <Container className='text-center' style={{ marginTop: "7rem" }}>
                <h1 className='mt-3'><i>EduWallet</i></h1>
                {
                    !isCreated ? (
                        <>
                            <Col className='p-5'>
                                <div className='px-5'>
                                    <p className='px-5'>
                                        EduWallet is used to hold, send and receive EduChain Coins &#40;EDU&#41;. It can generate a new address for you to use, and you can access it any time with your private key.
                                    </p>
                                </div>
                            </Col>
                            {isLocked && (
                                <button
                                    className='rounded mt-2 px-4 py-3 '
                                    onClick={handleClick}
                                    style={{
                                        textDecoration: 'none',
                                        color: 'black',
                                        backgroundColor: 'rgb(255, 223, 0)',
                                        fontFamily: 'Fragment Mono'
                                    }}
                                >
                                    Create Wallet
                                </button>
                            )}
                        </>
                    ) : (
                        <button
                            className='rounded my-3 px-4 py-3'
                            style={{
                                textDecoration: 'none',
                                color: 'black',
                                backgroundColor: 'rgb(255, 255, 51)',
                                fontFamily: 'Fragment Mono'
                            }}
                            disabled
                        >
                            Wallet created successfully!
                        </button>
                    )
                }
                < div className='mt-2'>{displayWallet()}</div>
        </Container>
        </>
    );
}

export default WalletHome;