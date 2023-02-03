import { useState, useContext } from "react";
import { useWallet } from '../../wallet-context';
import { createWallet } from '../../utils/cryptography.js';
import { Container, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";

function WalletHome({ navLinks, setWalletStatus }) {
    const [isCreated, setIsCreated] = useState(false);
    const { isLocked, changeWalletState } = useWallet();
    const links = (isLocked === true) ? navLinks.locked : navLinks.unlocked;

    function displayWallet() {
        if (!isLocked) {
            return (
                <>
                    <p><i>Private Key:</i> {sessionStorage['privKey']}</p>
                    <br />
                    <p><i>Public Key:</i> {sessionStorage['pubKey']}</p>
                    <br />
                    <p><i>Address:</i> {sessionStorage['address']}</p>
                </>
            );
        }
    }

    function handleClick() {
        const wallet = createWallet();
        sessionStorage['privKey'] = wallet.privKey;
        sessionStorage['pubKey'] = wallet.pubKey;
        sessionStorage['address'] = wallet.address;
        changeWalletState(false);
        setIsCreated(true);
    }

    return (
        <>
            <Header navLinks={links} setWalletStatus={setWalletStatus} />
            <Container className='text-center'>
                <h1 className='mt-3'>School Wallet Home</h1>
                {
                    !isCreated ? (
                        <>
                            <Col className='p-5'>
                                <div className='px-5'>
                                    <p className='px-5'>
                                        School Wallet is used to hold, send and receive School Coins &#40;SCH&#41;. It can generate a new address for you to use, and you can access it any time with your private key.
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
                        <>
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
                            <div className='mt-2'>{displayWallet()}</div>
                        </>
                    )
                }
            </Container>
        </>
    );
}

export default WalletHome;