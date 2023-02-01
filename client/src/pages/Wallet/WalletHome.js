import { useState } from "react";
import { Container, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Header from "../../components/Header";

function WalletHome({ navLinks, setWalletStatus, walletStatus }) {
    const links = (walletStatus === 'locked') ? navLinks.locked : navLinks.unlocked;

    return (
        <>
            <Header navLinks={links} setWalletStatus={setWalletStatus} />
            <Container className='text-center'>
                <h1 className='mt-3'>School Wallet Home</h1>
                <Col className='p-5'>
                    <div className='px-5'>
                        <p className='px-5'>
                            School Wallet is used to hold, send and receive School Coins &#40;SCH&#41;. It can generate a new address for you to use, and you can access it any time with your private key.
                        </p>
                    </div>
                </Col>
                <Link
                    className='border border-dark border-2 rounded px-4 py-3'
                    to={'/wallet/create'}
                    style={{ 
                        textDecoration: 'none', 
                        color: 'black', 
                        backgroundColor: 'rgb(255, 223, 0)', 
                        fontFamily: 'Fragment Mono' 
                    }}
                >
                    Create Wallet
                </Link>

            </Container>
        </>
    );
}

export default WalletHome;