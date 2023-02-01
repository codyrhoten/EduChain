import { useState } from 'react';
import { createWallet } from '../../utils/cryptography.js';
import Header from '../../components/Header';
import { Container } from 'react-bootstrap';

function Create({ navLinks, setWalletStatus, walletStatus }) {
    const [isCreated, setIsCreated] = useState(false);
    const links = (walletStatus === 'locked') ? navLinks.locked : navLinks.unlocked;

    function displayWallet() {
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

    function handleClick() {
        const wallet = createWallet();
        sessionStorage['privKey'] = wallet.privKey;
        sessionStorage['pubKey'] = wallet.pubKey;
        sessionStorage['address'] = wallet.address;
        setIsCreated(true);
        setWalletStatus('unlocked');
    }

    return (
        <>
            <Header navLinks={links} setWalletStatus={setWalletStatus} />
            <Container className='text-center'>
                <h1 className='my-5'>Start a new wallet</h1>
                {
                    !isCreated ? (
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
                            Create Now
                        </button>
                    ) : (
                        <>
                        <button 
                            className='rounded my-3 px-4 py-3 '
                            onClick={handleClick} 
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

export default Create;