import { useState } from "react";
import { useWallet } from '../../wallet-context';
import { generateKeyPair, createWallet } from '../../utils/cryptography.js';
import { Container, Col } from "react-bootstrap";
import Header from "../../components/Header/Header";
import Button from "../../components/Button";

function WalletHome() {
    const { isLocked, changeWalletState } = useWallet();
    const [isCreated, setIsCreated] = useState(false);

    function displayWallet() {
        if (!isLocked) {
            return (
                <>
                    <p align="left"><i>Public Key:</i> {sessionStorage['pubKey']}</p>
                    <br />
                    <p align="left"><i>Address:</i> {sessionStorage['address']}</p>
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
                                <Button title="Create Wallet" clickHandler={handleClick} />
                            )}
                        </>
                    ) : (
                        <button
                            className='rounded my-5 px-4 py-3'
                            style={{
                                textDecoration: 'none',
                                color: 'black',
                                backgroundColor: 'rgb(255, 223, 0)',
                                border: '1px solid black',
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